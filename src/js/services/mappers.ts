import { getTrialEndDateIso } from '@/js/helpers/date'
import {
  MONEY_REFERRAL_LINK,
  REFERRAL_LINK,
  VPN_LINK,
} from '@/js/constants/urls'
import type {
  PlaceholderPost,
  PlaceholderTodo,
  PlaceholderUser,
} from '@/js/types/placeholder'
import type { PaymentSettings } from '@/js/types/payment'
import type { ReferralData } from '@/js/types/referral'
import type {
  Subscription,
  SubscriptionDevice,
  SubscriptionPlanType,
} from '@/js/types/subscription'
import type { User } from '@/js/types/user'

const DEFAULT_SUBSCRIPTION: Omit<Subscription, 'devices'> = {
  id: 'sub_1',
  endDate: getTrialEndDateIso(),
  isActive: true,
  planType: 'trial',
  price: 199,
  totalSlots: 3,
  vpnKey: VPN_LINK,
}

export function mapPlaceholderUser(
  raw: PlaceholderUser,
  overrides: Partial<User> = {},
): User {
  return {
    id: `usr_${raw.id}`,
    email: raw.email,
    isBlocked: false,
    isTelegramLinked: false,
    telegramId: null,
    username: raw.username,
    ...overrides,
  }
}

export function mapPlaceholderPostToDevice(post: PlaceholderPost): SubscriptionDevice {
  return {
    id: `dev_${post.id}`,
    model: post.title,
    platform: post.body,
    updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
  }
}

export function mapPlaceholderPostsToSubscription(
  todo: PlaceholderTodo,
  overrides: Partial<Subscription> = {},
): Subscription {
  const subscription = {
    ...DEFAULT_SUBSCRIPTION,
    isActive: todo.completed,
    devices: overrides.devices ?? [],
    ...overrides,
  }

  return {
    ...subscription,
    endDate:
      overrides.endDate ??
      (subscription.planType === 'trial'
        ? getTrialEndDateIso()
        : subscription.endDate),
  }
}

export function mapPlaceholderTodoToPayment(todo: PlaceholderTodo): PaymentSettings {
  return {
    isAutoRenewalEnabled: todo.completed,
    activePaymentMethodId: 'sbp',
    hasPaymentMethods: false,
  }
}

export function defaultReferralData(): ReferralData {
  return {
    bonuses: {
      invitedCount: 344,
      bonusDays: 12,
      referralLink: REFERRAL_LINK,
    },
    money: {
      invitedCount: 344,
      balance: 0,
      earned: 12412,
      withdrawn: 12412,
      referralLink: MONEY_REFERRAL_LINK,
    },
  }
}

export function parseDevicePostId(deviceId: string): number {
  const numeric = deviceId.replace(/^dev_/, '')
  return Number(numeric)
}

export function getPlanLabel(planType: SubscriptionPlanType): string {
  const labels: Record<SubscriptionPlanType, string> = {
    trial: 'бесплатный период',
    basic: 'BASIC',
    pro: 'PRO',
  }
  return labels[planType]
}

export function formatEndDate(isoDate: string): string {
  const date = new Date(isoDate)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatEndDateShort(isoDate: string): string {
  const date = new Date(isoDate)
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
