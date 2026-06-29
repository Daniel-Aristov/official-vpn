import { createContext } from 'react'
import type {
  PurchaseSlotsPayload,
  PurchaseSubscriptionPayload,
  RenewalPeriod,
  Subscription,
  SubscriptionPlanType,
} from '@/js/types/subscription'

export interface SubscriptionState {
  subscription: Subscription | null
  renewalPeriods: RenewalPeriod[]
  isLoading: boolean
  purchaseSuccessPlanType: SubscriptionPlanType | null
  fetchSubscription: () => Promise<void>
  fetchRenewalPeriods: () => Promise<void>
  removeDevice: (deviceId: string) => Promise<void>
  purchaseSubscription: (payload: PurchaseSubscriptionPayload) => Promise<void>
  purchaseSlots: (payload: PurchaseSlotsPayload) => Promise<void>
  clearPurchaseSuccess: () => void
}

export const SubscriptionContext = createContext<SubscriptionState | null>(null)
