import type { ApiSubscriptionPlanType } from '@/js/types/dto/user.dto'

export type SubscriptionPeriodDto =
  | '1_month'
  | '3_months'
  | '6_months'
  | '1_year'

export type SubscriptionStatusDto = 'active' | string

export interface TariffPeriodsDto {
  one_month: number
  three_months: number
  six_months: number
  one_year: number
}

export interface TariffDto {
  price: number
  hwid: number
  price_per_hwid: number
  currency: string
  periods: TariffPeriodsDto
}

export interface SubscriptionPricingResponseDto {
  pro: TariffDto
  basic: TariffDto
}

export interface SubscriptionMeResponseDto {
  subscription_id: string
  subscription_type: ApiSubscriptionPlanType
  hwid: number
  add_hwid_count: number
  status: SubscriptionStatusDto
  expires_at: string
  auto_renew: boolean
  payment_method: string | null
  days_left: number
}

export interface CreateSubscriptionRequestDto {
  subscription_type: ApiSubscriptionPlanType
  period: SubscriptionPeriodDto
  payment_method: string | null
  add_hwid: number
}

export interface CreateSubscriptionResponseDto {
  order_id: string
  payment_url: string
  subscription_id: string
  expires_at: string
}

export interface UpdateSubscriptionRequestDto {
  subscription_type: ApiSubscriptionPlanType
}

export interface DeviceDto {
  hwid: string
  name: string
  os: string
  added_at: string
}

export interface DevicesListResponseDto {
  devices: DeviceDto[]
  total: number
  max_allowed: number
}

export interface AddSlotsRequestDto {
  count: number
  payment_method: string | null
}

export interface AddSlotsResponseDto {
  order_id: string
  payment_url: string
  subscription_id: string
  expires_at: string
}
