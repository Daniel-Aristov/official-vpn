import { createContext } from 'react'
import type { PaymentSettings, PaymentTransaction } from '@/js/types/payment'
import type { PaymentMethodId } from '@/js/types/payment'

export interface PaymentState {
  settings: PaymentSettings | null
  transactions: PaymentTransaction[]
  availablePaymentMethodIds: PaymentMethodId[]
  isLoading: boolean
  fetchPaymentData: () => Promise<void>
  setAutoRenewal: (enabled: boolean) => Promise<void>
  setActivePaymentMethod: (methodId: PaymentMethodId) => void
  enablePaymentMethods: () => Promise<void>
}

export const PaymentContext = createContext<PaymentState | null>(null)
