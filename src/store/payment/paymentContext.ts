import { createContext } from 'react'
import type { PaymentSettings, PaymentTransaction } from '@/js/types/payment'
import type { PaymentMethodId } from '@/data/paymentMethods'

export interface PaymentState {
  settings: PaymentSettings | null
  transactions: PaymentTransaction[]
  isLoading: boolean
  fetchPaymentData: () => Promise<void>
  setAutoRenewal: (enabled: boolean) => Promise<void>
  setActivePaymentMethod: (methodId: PaymentMethodId) => Promise<void>
  enablePaymentMethods: () => Promise<void>
}

export const PaymentContext = createContext<PaymentState | null>(null)
