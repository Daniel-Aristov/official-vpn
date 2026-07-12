import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { openInNewTab } from '@/js/helpers/browser'
import { pollPaymentStatus } from '@/js/services/paymentService'
import {
  getMinRenewalPrice as getMinRenewalPriceFromPricing,
  mapPricingToPeriods,
} from '@/js/services/utils/mappers'
import * as subscriptionService from '@/js/services/subscriptionService'
import type { AddSlotsResponseDto, CreateSubscriptionResponseDto } from '@/js/types/dto'
import type { SubscriptionPricingResponseDto } from '@/js/types/dto'
import type {
  PurchaseSlotsPayload,
  PurchaseSubscriptionPayload,
  RenewalPeriod,
  Subscription,
  SubscriptionPlanType,
} from '@/js/types/subscription'
import { SubscriptionContext } from '@/store/subscription/subscriptionContext'

const PURCHASE_SUCCESS_AUTO_HIDE_MS = 10 * 60 * 1000

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [renewalPeriods, setRenewalPeriods] = useState<RenewalPeriod[]>([])
  const [pricing, setPricing] = useState<SubscriptionPricingResponseDto | null>(
    null,
  )
  const [isLoading, setIsLoading] = useState(false)
  const [purchaseSuccessPlanType, setPurchaseSuccessPlanType] =
    useState<SubscriptionPlanType | null>(null)
  const purchaseSuccessAutoHideRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  )

  const clearPurchaseSuccessAutoHide = useCallback(() => {
    if (purchaseSuccessAutoHideRef.current) {
      clearTimeout(purchaseSuccessAutoHideRef.current)
      purchaseSuccessAutoHideRef.current = null
    }
  }, [])

  const schedulePurchaseSuccessAutoHide = useCallback(() => {
    clearPurchaseSuccessAutoHide()
    purchaseSuccessAutoHideRef.current = setTimeout(() => {
      purchaseSuccessAutoHideRef.current = null
      setPurchaseSuccessPlanType(null)
    }, PURCHASE_SUCCESS_AUTO_HIDE_MS)
  }, [clearPurchaseSuccessAutoHide])

  useEffect(() => {
    return () => clearPurchaseSuccessAutoHide()
  }, [clearPurchaseSuccessAutoHide])

  const fetchSubscription = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await subscriptionService.fetchSubscription()
      setSubscription(data)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchRenewalPeriods = useCallback(
    async (planType: SubscriptionPlanType = 'basic') => {
      const data = await subscriptionService.fetchPricing()
      setPricing(data)
      const apiPlan = planType === 'pro' ? 'pro' : 'basic'
      setRenewalPeriods(mapPricingToPeriods(data, apiPlan))
    },
    [],
  )

  const getPeriodsForPlan = useCallback(
    (planType: SubscriptionPlanType): RenewalPeriod[] => {
      if (pricing) {
        const apiPlan = planType === 'pro' ? 'pro' : 'basic'
        return mapPricingToPeriods(pricing, apiPlan)
      }
      return renewalPeriods
    },
    [pricing, renewalPeriods],
  )

  const getMinRenewalPrice = useCallback(
    (planType: SubscriptionPlanType): number => {
      if (!pricing) return 0
      return getMinRenewalPriceFromPricing(pricing, planType)
    },
    [pricing],
  )

  const removeDevice = useCallback(async (deviceId: string) => {
    await subscriptionService.removeDevice(deviceId)
    setSubscription((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        devices: prev.devices.filter((device) => device.id !== deviceId),
      }
    })
  }, [])

  const startPaymentStatusPolling = useCallback(
    (orderId: string) => {
      void pollPaymentStatus(orderId).then(async (result) => {
        if (result?.status !== 'completed') return

        const data = await subscriptionService.fetchSubscription()
        setSubscription(data)
      })
    },
    [],
  )

  const openPaymentOrder = useCallback(
    (order: CreateSubscriptionResponseDto | AddSlotsResponseDto) => {
      if (order.payment_url) {
        openInNewTab(order.payment_url)
      }

      if (order.order_id) {
        startPaymentStatusPolling(order.order_id)
      }
    },
    [startPaymentStatusPolling],
  )

  const purchaseSubscription = useCallback(
    async (payload: PurchaseSubscriptionPayload) => {
      const order = await subscriptionService.purchaseSubscription(payload)
      openPaymentOrder(order)
      setPurchaseSuccessPlanType(payload.planType)
      schedulePurchaseSuccessAutoHide()
    },
    [openPaymentOrder, schedulePurchaseSuccessAutoHide],
  )

  const clearPurchaseSuccess = useCallback(() => {
    clearPurchaseSuccessAutoHide()
    setPurchaseSuccessPlanType(null)
  }, [clearPurchaseSuccessAutoHide])

  const purchaseSlots = useCallback(
    async (payload: PurchaseSlotsPayload) => {
      const order = await subscriptionService.purchaseSlots(payload)
      openPaymentOrder(order)
    },
    [openPaymentOrder],
  )

  const upgradeSubscription = useCallback(
    async (planType: SubscriptionPlanType) => {
      const data = await subscriptionService.upgradeSubscription(planType)
      setSubscription(data)
    },
    [],
  )

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        renewalPeriods,
        isLoading,
        purchaseSuccessPlanType,
        fetchSubscription,
        fetchRenewalPeriods,
        getPeriodsForPlan,
        getMinRenewalPrice,
        removeDevice,
        purchaseSubscription,
        purchaseSlots,
        upgradeSubscription,
        clearPurchaseSuccess,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}
