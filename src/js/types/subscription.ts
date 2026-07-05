import type { PaymentMethodId } from '@/data/paymentMethods'

export type SubscriptionPlanType = 'trial' | 'basic' | 'pro'

export interface SubscriptionDevice {
  id: string
  model: string
  platform: string
  updatedAt: string
}

export interface RenewalPeriod {
  id: string
  label: string
  months: number
  price: number
  description: string
}

export interface Subscription {
  id: string
  endDate: string
  isActive: boolean
  planType: SubscriptionPlanType
  price: number
  totalSlots: number
  vpnKey: string
  devices: SubscriptionDevice[]
  daysLeft: number | null
}

export interface PurchaseSubscriptionPayload {
  planType: SubscriptionPlanType
  periodId: string
  deviceCount: number
  paymentMethodId: PaymentMethodId
}

export interface PurchaseSlotsPayload {
  slotCount: number
  paymentMethodId: PaymentMethodId
}
