import { UI_PERIOD_TO_API } from '@/js/constants/periods'
import { apiEndpoints } from '@/js/constants/api'
import { mapPaymentMethodIdToApi } from '@/js/constants/paymentMethods'
import { api } from '@/js/services/utils/api'
import { fetchUserMeDto } from '@/js/services/userService'
import {
  getBaseSlots,
  mapDeviceDtoToDomain,
  mapDomainPlanToApi,
  mapPricingToPeriods,
  mapSubscriptionToDomain,
  mapTrialSubscription,
} from '@/js/services/utils/mappers'
import type {
  AddSlotsRequestDto,
  AddSlotsResponseDto,
  CreateSubscriptionRequestDto,
  CreateSubscriptionResponseDto,
  DevicesListResponseDto,
  SubscriptionMeResponseDto,
  SubscriptionPricingResponseDto,
  UpdateSubscriptionRequestDto,
} from '@/js/types/dto'
import type {
  PurchaseSlotsPayload,
  PurchaseSubscriptionPayload,
  RenewalPeriod,
  Subscription,
  SubscriptionPlanType,
} from '@/js/types/subscription'

let subscriptionMeRequest: Promise<SubscriptionMeResponseDto | null> | null = null

export async function fetchSubscriptionMe(): Promise<SubscriptionMeResponseDto | null> {
  subscriptionMeRequest ??= api
    .get<SubscriptionMeResponseDto>(apiEndpoints.subscriptions.me)
    .catch(() => null)
    .finally(() => {
      subscriptionMeRequest = null
    })

  return subscriptionMeRequest
}

export async function fetchPricing(): Promise<SubscriptionPricingResponseDto> {
  return api.get<SubscriptionPricingResponseDto>(
    apiEndpoints.subscriptions.pricing,
  )
}

export async function fetchRenewalPeriods(
  planType: SubscriptionPlanType = 'basic',
): Promise<RenewalPeriod[]> {
  const pricing = await fetchPricing()
  const apiPlan = mapDomainPlanToApi(planType)
  return mapPricingToPeriods(pricing, apiPlan)
}

export async function fetchSubscription(): Promise<Subscription> {
  const [user, subscription, devicesResponse] = await Promise.all([
    fetchUserMeDto(),
    fetchSubscriptionMe(),
    api
      .get<DevicesListResponseDto>(apiEndpoints.subscriptions.devices)
      .catch(() => null),
  ])

  const devices =
    devicesResponse?.devices.map(mapDeviceDtoToDomain) ?? []

  if (!subscription) {
    return {
      ...mapTrialSubscription(user),
      devices,
      totalSlots: devicesResponse?.max_allowed ?? getBaseSlots('basic'),
    }
  }

  return mapSubscriptionToDomain(subscription, user, devices)
}

export async function removeDevice(deviceId: string): Promise<void> {
  await api.delete(apiEndpoints.subscriptions.device(deviceId))
}

export async function removeAllDevices(): Promise<Subscription> {
  await api.delete(apiEndpoints.subscriptions.devices)
  return fetchSubscription()
}

export async function purchaseSubscription(
  payload: PurchaseSubscriptionPayload,
): Promise<CreateSubscriptionResponseDto> {
  const baseSlots = getBaseSlots(payload.planType)

  return api.post<CreateSubscriptionResponseDto>(
    apiEndpoints.subscriptions.create,
    {
      subscription_type: mapDomainPlanToApi(payload.planType),
      period: UI_PERIOD_TO_API[payload.periodId] ?? '3_months',
      payment_method: mapPaymentMethodIdToApi(payload.paymentMethodId),
      add_hwid: Math.max(0, payload.deviceCount - baseSlots),
    } satisfies CreateSubscriptionRequestDto,
  )
}

export async function purchaseSlots(
  payload: PurchaseSlotsPayload,
): Promise<AddSlotsResponseDto> {
  return api.post<AddSlotsResponseDto>(
    apiEndpoints.subscriptions.addSlots,
    {
      count: payload.slotCount,
      payment_method: mapPaymentMethodIdToApi(payload.paymentMethodId),
    } satisfies AddSlotsRequestDto,
  )
}

export async function upgradeSubscription(
  planType: SubscriptionPlanType,
): Promise<Subscription> {
  await api.patch<SubscriptionMeResponseDto>(apiEndpoints.subscriptions.me, {
    subscription_type: mapDomainPlanToApi(planType),
  } satisfies UpdateSubscriptionRequestDto)

  return fetchSubscription()
}

export { getBaseSlots, formatEndDate, formatEndDateShort, getPlanLabel } from '@/js/services/utils/mappers'
