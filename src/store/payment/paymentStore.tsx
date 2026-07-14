import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { getAvailablePaymentMethodIds } from '@/js/constants/paymentMethods'
import * as paymentService from '@/js/services/paymentService'
import type { PaymentSettings, PaymentTransaction } from '@/js/types/payment'
import type { PaymentMethodId } from '@/js/types/payment'
import { PaymentContext } from '@/store/payment/paymentContext'

const TRANSACTIONS_PAGE_SIZE = 20

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<PaymentSettings | null>(null)
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMoreTransactions, setIsLoadingMoreTransactions] =
    useState(false)
  const [transactionsPage, setTransactionsPage] = useState(0)
  const [hasMoreTransactions, setHasMoreTransactions] = useState(false)

  const fetchPaymentData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [settingsData, transactionsData] = await Promise.all([
        paymentService.fetchPaymentSettings(),
        paymentService.fetchTransactionsPage({
          page: 0,
          size: TRANSACTIONS_PAGE_SIZE,
        }),
      ])
      setSettings(settingsData)
      setTransactions(transactionsData.transactions)
      setTransactionsPage(transactionsData.page)
      setHasMoreTransactions(!transactionsData.isLast)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchMoreTransactions = useCallback(async () => {
    if (isLoadingMoreTransactions || !hasMoreTransactions) return
    setIsLoadingMoreTransactions(true)
    try {
      const nextPage = transactionsPage + 1
      const data = await paymentService.fetchTransactionsPage({
        page: nextPage,
        size: TRANSACTIONS_PAGE_SIZE,
      })
      setTransactions((prev) => [...prev, ...data.transactions])
      setTransactionsPage(data.page)
      setHasMoreTransactions(!data.isLast)
    } finally {
      setIsLoadingMoreTransactions(false)
    }
  }, [hasMoreTransactions, isLoadingMoreTransactions, transactionsPage])

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

  const value = useMemo(
    () => ({
      settings,
      transactions,
      availablePaymentMethodIds,
      isLoading,
      hasMoreTransactions,
      isLoadingMoreTransactions,
      fetchPaymentData,
      fetchMoreTransactions,
      setAutoRenewal,
      setActivePaymentMethod,
      enablePaymentMethods,
    }),
    [
      settings,
      transactions,
      availablePaymentMethodIds,
      isLoading,
      hasMoreTransactions,
      isLoadingMoreTransactions,
      fetchPaymentData,
      fetchMoreTransactions,
      setAutoRenewal,
      setActivePaymentMethod,
      enablePaymentMethods,
    ],
  )

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  )
}
