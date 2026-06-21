import { createContext } from 'react'
import type {
  PurchaseSlotsPayload,
  PurchaseSubscriptionPayload,
  RenewalPeriod,
  Subscription,
} from '@/js/types/subscription'

export interface SubscriptionState {
  subscription: Subscription | null
  renewalPeriods: RenewalPeriod[]
  isLoading: boolean
  fetchSubscription: () => Promise<void>
  fetchRenewalPeriods: () => Promise<void>
  removeDevice: (deviceId: string) => Promise<void>
  purchaseSubscription: (payload: PurchaseSubscriptionPayload) => Promise<void>
  purchaseSlots: (payload: PurchaseSlotsPayload) => Promise<void>
}

export const SubscriptionContext = createContext<SubscriptionState | null>(null)
