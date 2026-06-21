import type { PaymentMethodId } from '@/data/paymentMethods'

export interface PaymentTransaction {
  id: string
  amount: number
  date: string
  description: string
  paymentMethodId: PaymentMethodId
}

export interface PaymentSettings {
  isAutoRenewalEnabled: boolean
  activePaymentMethodId: PaymentMethodId
  hasPaymentMethods: boolean
}
