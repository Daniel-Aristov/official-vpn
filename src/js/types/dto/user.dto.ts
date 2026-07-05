export type ApiSubscriptionPlanType = 'basic' | 'pro'

export interface UserMeResponseDto {
  user_id: string
  email: string
  tg_id: number | null
  subscription_url: string
  subscription_type: ApiSubscriptionPlanType
  add_hwid: number
  subscription_expire_at: string
}

export interface UserSettingsPatchRequestDto {
  auto_renew: boolean
}

export interface UserSettingsPatchResponseDto {
  user_id: string
  auto_renew: boolean
  updated_at: string
}
