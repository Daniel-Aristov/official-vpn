import { useCallback, useState } from 'react'
import type { ReactNode } from 'react'
import * as paymentService from '@/js/services/paymentService'
import type { PaymentSettings, PaymentTransaction } from '@/js/types/payment'
import type { PaymentMethodId } from '@/data/paymentMethods'
import { PaymentContext } from '@/store/payment/paymentContext'

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<PaymentSettings | null>(null)
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchPaymentData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [settingsData, transactionsData] = await Promise.all([
        paymentService.fetchPaymentSettings(),
        paymentService.fetchTransactions(),
      ])
      setSettings(settingsData)
      setTransactions(transactionsData)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const setAutoRenewal = useCallback(async (enabled: boolean) => {
    const data = await paymentService.setAutoRenewal(enabled)
    setSettings(data)
  }, [])

  const setActivePaymentMethod = useCallback(
    async (methodId: PaymentMethodId) => {
      const data = await paymentService.setActivePaymentMethod(methodId)
      setSettings(data)
    },
    [],
  )

  const enablePaymentMethods = useCallback(async () => {
    const data = await paymentService.enablePaymentMethods()
    setSettings(data)
  }, [])

  return (
    <PaymentContext.Provider
      value={{
        settings,
        transactions,
        isLoading,
        fetchPaymentData,
        setAutoRenewal,
        setActivePaymentMethod,
        enablePaymentMethods,
      }}
    >
      {children}
    </PaymentContext.Provider>
  )
}
