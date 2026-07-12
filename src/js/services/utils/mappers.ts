import {
  PERIOD_LABELS,
  PRICING_PERIOD_TO_UI,
  UI_PERIOD_ORDER,
} from '@/js/constants/periods'
import { formatDateTimeUtc } from '@/js/helpers/date'
import {
  DOWNLOAD_LINKS,
  MONEY_REFERRAL_LINK,
  REFERRAL_LINK,
  type InstallPlatform,
} from '@/js/constants/urls'
import {
  getAvailablePaymentMethodIds,
  mapPaymentMethodToId,
  resolvePaymentMethodId,
} from '@/js/constants/paymentMethods'
import type { PaymentMethodId } from '@/js/types/payment'
import type {
  ApiSubscriptionPlanType,
  DeviceDto,
  DownloadLinkDto,
  DownloadOsDto,
  PaymentMethodsResponseDto,
  PaymentTransactionDto,
  SubscriptionMeResponseDto,
  SubscriptionPricingResponseDto,
  UserMeResponseDto,
} from '@/js/types/dto'
import type { PaymentSettings, PaymentTransaction } from '@/js/types/payment'
import type { ReferralData } from '@/js/types/referral'
import type {
  RenewalPeriod,
  Subscription,
  SubscriptionDevice,
  SubscriptionPlanType,
} from '@/js/types/subscription'
import type { User } from '@/js/types/user'

const BASE_SLOTS: Record<ApiSubscriptionPlanType, number> = {
  basic: 3,
  pro: 6,
}

export function mapApiPlanToDomain(
  plan: ApiSubscriptionPlanType,
): SubscriptionPlanType {
  return plan
}

export function mapDomainPlanToApi(
  plan: SubscriptionPlanType,
): ApiSubscriptionPlanType {
  if (plan === 'trial') return 'basic'
  return plan
}

export function mapDeviceDtoToDomain(device: DeviceDto): SubscriptionDevice {
  return {
    id: device.hwid,
    model: device.name,
    platform: device.os,
    updatedAt: formatDateTimeUtc(device.added_at),
  }
}

export function mapUserDtoToDomain(raw: UserMeResponseDto): User {
  return {
    id: raw.user_id,
    email: raw.email,
    isBlocked: false,
    isTelegramLinked: raw.tg_id !== null,
    telegramId: raw.tg_id !== null ? String(raw.tg_id) : null,
    username: null,
  }
}

export function mapSubscriptionToDomain(
  subscription: SubscriptionMeResponseDto,
  user: UserMeResponseDto,
  devices: SubscriptionDevice[],
): Subscription {
  const planType = mapApiPlanToDomain(subscription.subscription_type)
  const isActive = subscription.status === 'active'

  return {
    id: subscription.subscription_id,
    endDate: subscription.expires_at.slice(0, 10),
    isActive,
    planType: isActive ? planType : 'trial',
    price: 0,
    totalSlots: subscription.hwid + subscription.add_hwid_count,
    vpnKey: user.subscription_url,
    devices,
    daysLeft: subscription.days_left,
  }
}

export function mapTrialSubscription(user: UserMeResponseDto): Subscription {
  return {
    id: 'trial',
    endDate: user.subscription_expire_at.slice(0, 10),
    isActive: false,
    planType: 'trial',
    price: 0,
    totalSlots: BASE_SLOTS.basic,
    vpnKey: user.subscription_url,
    devices: [],
    daysLeft: null,
  }
}

export function mapPricingToPeriods(
  pricing: SubscriptionPricingResponseDto,
  planType: ApiSubscriptionPlanType,
): RenewalPeriod[] {
  const tariff = pricing[planType]

  return UI_PERIOD_ORDER.map((uiId) => {
    const pricingKey = Object.entries(PRICING_PERIOD_TO_UI).find(
      ([, id]) => id === uiId,
    )?.[0] as keyof typeof tariff.periods | undefined

    const meta = PERIOD_LABELS[uiId]
    const months =
      uiId === '1m' ? 1 : uiId === '3m' ? 3 : uiId === '6m' ? 6 : 12

    return {
      id: uiId,
      label: meta.label,
      months,
      price: pricingKey ? tariff.periods[pricingKey] : tariff.price,
      description: meta.description,
    }
  })
}

export function getMinRenewalPrice(
  pricing: SubscriptionPricingResponseDto,
  planType: SubscriptionPlanType,
): number {
  const periods = mapPricingToPeriods(pricing, mapDomainPlanToApi(planType))
  if (periods.length === 0) return 0
  return Math.min(...periods.map((period) => period.price))
}

export function mapPaymentMethodsToSettings(
  methods: PaymentMethodsResponseDto,
  subscription: SubscriptionMeResponseDto | null,
  activeMethodOverride?: PaymentMethodId,
): PaymentSettings {
  const available = getAvailablePaymentMethodIds(methods)
  const hasPaymentMethods = available.length > 0

  const preferredFromSubscription = subscription?.payment_method
    ? mapPaymentMethodToId(subscription.payment_method)
    : undefined

  let activePaymentMethodId = resolvePaymentMethodId(
    preferredFromSubscription,
    methods,
  )

  if (
    activeMethodOverride &&
    available.includes(activeMethodOverride)
  ) {
    activePaymentMethodId = activeMethodOverride
  }

  return {
    isAutoRenewalEnabled: subscription?.auto_renew ?? true,
    activePaymentMethodId,
    hasPaymentMethods,
    availableMethods: methods,
  }
}

export function mapPaymentTransactionDtoToDomain(
  tx: PaymentTransactionDto,
): PaymentTransaction {
  return {
    id: tx.id,
    orderId: tx.order_id,
    amount: tx.amount,
    currency: tx.currency,
    status: tx.status,
    description: tx.description,
    paymentMethod: tx.payment_method,
    paymentMethodId: mapPaymentMethodToId(tx.payment_method),
    createdAt: tx.created_at,
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

export function getBaseSlots(planType: SubscriptionPlanType): number {
  if (planType === 'pro') return BASE_SLOTS.pro
  return BASE_SLOTS.basic
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

const DOWNLOAD_OS_TO_PLATFORM: Record<DownloadOsDto, InstallPlatform> = {
  ios: 'IOS',
  android: 'Android',
  windows: 'Windows',
  macos: 'Macbook',
}

export function mapDownloadLinksToPlatforms(
  links: DownloadLinkDto[],
): Partial<Record<InstallPlatform, string>> {
  const result: Partial<Record<InstallPlatform, string>> = {}

  for (const item of links) {
    const platform = DOWNLOAD_OS_TO_PLATFORM[item.os]
    if (platform) {
      result[platform] = item.link
    }
  }

  return result
}

export function resolveDownloadLink(
  platform: InstallPlatform,
  links: Partial<Record<InstallPlatform, string>>,
): string {
  return links[platform] ?? DOWNLOAD_LINKS[platform]
}
