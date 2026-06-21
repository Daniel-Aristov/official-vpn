import { useCallback, useState } from 'react'
import type { ReactNode } from 'react'
import * as subscriptionService from '@/js/services/subscriptionService'
import type {
  PurchaseSlotsPayload,
  PurchaseSubscriptionPayload,
  RenewalPeriod,
  Subscription,
} from '@/js/types/subscription'
import { SubscriptionContext } from '@/store/subscription/subscriptionContext'

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [renewalPeriods, setRenewalPeriods] = useState<RenewalPeriod[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchSubscription = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await subscriptionService.fetchSubscription()
      setSubscription(data)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchRenewalPeriods = useCallback(async () => {
    const data = await subscriptionService.fetchRenewalPeriods()
    setRenewalPeriods(data)
  }, [])

  const removeDevice = useCallback(async (deviceId: string) => {
    const data = await subscriptionService.removeDevice(deviceId)
    setSubscription(data)
  }, [])

  const purchaseSubscription = useCallback(
    async (payload: PurchaseSubscriptionPayload) => {
      const data = await subscriptionService.purchaseSubscription(payload)
      setSubscription(data)
    },
    [],
  )

  const purchaseSlots = useCallback(async (payload: PurchaseSlotsPayload) => {
    const data = await subscriptionService.purchaseSlots(payload)
    setSubscription(data)
  }, [])

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        renewalPeriods,
        isLoading,
        fetchSubscription,
        fetchRenewalPeriods,
        removeDevice,
        purchaseSubscription,
        purchaseSlots,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}
