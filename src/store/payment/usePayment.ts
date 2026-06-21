import { useContext } from 'react'
import { PaymentContext, type PaymentState } from '@/store/payment/paymentContext'

export function usePayment(): PaymentState {
  const ctx = useContext(PaymentContext)
  if (!ctx) throw new Error('usePayment must be used within PaymentProvider')
  return ctx
}
