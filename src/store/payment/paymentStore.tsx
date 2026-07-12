import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { getAvailablePaymentMethodIds } from '@/js/constants/paymentMethods'
import * as paymentService from '@/js/services/paymentService'
import type { PaymentSettings, PaymentTransaction } from '@/js/types/payment'
import type { PaymentMethodId } from '@/js/types/payment'
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

  const setAutoRenewal = useCallback(
    async (enabled: boolean) => {
      if (!settings) return
      const data = await paymentService.setAutoRenewal(enabled, settings)
      setSettings(data)
    },
    [settings],
  )

  const setActivePaymentMethod = useCallback((methodId: PaymentMethodId) => {
    setSettings((prev) =>
      prev ? paymentService.applyActivePaymentMethod(methodId, prev) : prev,
    )
  }, [])

  const enablePaymentMethods = useCallback(async () => {
    const data = await paymentService.enablePaymentMethods()
    setSettings(data)
  }, [])

  const availablePaymentMethodIds = useMemo(
    () => getAvailablePaymentMethodIds(settings?.availableMethods),
    [settings?.availableMethods],
  )

  return (
    <PaymentContext.Provider
      value={{
        settings,
        transactions,
        availablePaymentMethodIds,
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
