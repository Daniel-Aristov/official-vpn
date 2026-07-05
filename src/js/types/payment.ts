import type { PaymentMethodId } from '@/data/paymentMethods'
import type { PaymentMethodsResponseDto } from '@/js/types/dto'

export interface PaymentTransaction {
  id: string
  orderId: string
  amount: number
  currency: string
  status: string
  description: string
  paymentMethod: string
  paymentMethodId: PaymentMethodId
  createdAt: string
}

export interface PaymentSettings {
  isAutoRenewalEnabled: boolean
  activePaymentMethodId: PaymentMethodId
  hasPaymentMethods: boolean
  availableMethods?: PaymentMethodsResponseDto
}
