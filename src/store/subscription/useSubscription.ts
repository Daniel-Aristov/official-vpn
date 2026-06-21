import { useContext } from 'react'
import {
  SubscriptionContext,
  type SubscriptionState,
} from '@/store/subscription/subscriptionContext'

export function useSubscription(): SubscriptionState {
  const ctx = useContext(SubscriptionContext)
  if (!ctx)
    throw new Error('useSubscription must be used within SubscriptionProvider')
  return ctx
}
