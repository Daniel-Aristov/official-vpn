import { apiEndpoints } from '@/js/constants/api'
import {
  PERIODS,
  PERIOD_MONTHS,
} from '@/js/constants/subscription'
import { api } from '@/js/services/api'
import {
  mapPlaceholderPostsToSubscription,
  parseDevicePostId,
} from '@/js/services/mappers'
import type { PlaceholderPost, PlaceholderTodo } from '@/js/types/placeholder'
import type {
  PurchaseSlotsPayload,
  PurchaseSubscriptionPayload,
  RenewalPeriod,
  Subscription,
  SubscriptionPlanType,
} from '@/js/types/subscription'

const BASE_SLOTS: Record<SubscriptionPlanType, number> = {
  trial: 3,
  basic: 3,
  pro: 6,
}

let subscriptionCache: Partial<Subscription> = {}

async function getCurrentSubscription(): Promise<Subscription> {
  if (subscriptionCache.id) {
    return subscriptionCache as Subscription
  }

  return loadSubscription()
}

async function loadSubscription(): Promise<Subscription> {
  const [posts, todo] = await Promise.all([
    api.get<PlaceholderPost[]>(apiEndpoints.posts),
    api.get<PlaceholderTodo>(apiEndpoints.todo()),
  ])

  void posts

  return mapPlaceholderPostsToSubscription(todo, subscriptionCache)
}

export function getBaseSlots(planType: SubscriptionPlanType): number {
  return BASE_SLOTS[planType]
}

export async function fetchSubscription(): Promise<Subscription> {
  const subscription = await loadSubscription()
  subscriptionCache = subscription
  return subscription
}

export async function fetchRenewalPeriods(): Promise<RenewalPeriod[]> {
  await api.get<PlaceholderPost[]>(`${apiEndpoints.posts}?_limit=4`)

  return PERIODS.map((p) => ({
    id: p.id,
    label: p.label,
    months: PERIOD_MONTHS[p.id] ?? 1,
    price: p.price,
    description: p.description,
  }))
}

export async function removeDevice(deviceId: string): Promise<Subscription> {
  const postId = parseDevicePostId(deviceId)
  await api.delete(apiEndpoints.post(postId))

  const current = await getCurrentSubscription()

  subscriptionCache = {
    ...current,
    devices: current.devices.filter((d) => d.id !== deviceId),
  }

  return subscriptionCache as Subscription
}

export async function purchaseSubscription(
  payload: PurchaseSubscriptionPayload,
): Promise<Subscription> {
  await api.post<PlaceholderPost>(apiEndpoints.posts, {
    title: 'subscription_purchase',
    body: JSON.stringify(payload),
    userId: 1,
  })

  const months = PERIOD_MONTHS[payload.periodId] ?? 3
  const endDate = new Date()
  endDate.setMonth(endDate.getMonth() + months)

  const current = await getCurrentSubscription()

  subscriptionCache = {
    ...current,
    isActive: true,
    planType: payload.planType,
    totalSlots: Math.max(payload.deviceCount, BASE_SLOTS[payload.planType]),
    endDate: endDate.toISOString().slice(0, 10),
    devices: current.devices,
  }

  return subscriptionCache as Subscription
}

export async function purchaseSlots(
  payload: PurchaseSlotsPayload,
): Promise<Subscription> {
  await api.post<PlaceholderPost>(apiEndpoints.posts, {
    title: 'slots_purchase',
    body: JSON.stringify(payload),
    userId: 1,
  })

  const current = await getCurrentSubscription()

  subscriptionCache = {
    ...current,
    totalSlots: current.totalSlots + payload.slotCount,
  }

  return subscriptionCache as Subscription
}

export {
  formatEndDate,
  formatEndDateShort,
  getPlanLabel,
} from '@/js/services/mappers'
