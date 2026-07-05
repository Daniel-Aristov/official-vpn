import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from '@/store/auth/useAuth'
import { UserProvider } from '@/store/user/userStore'
import { SubscriptionProvider } from '@/store/subscription/subscriptionStore'
import { PaymentProvider } from '@/store/payment/paymentStore'
import { ReferralProvider } from '@/store/referral/referralStore'
import { useUser } from '@/store/user/useUser'
import { useSubscription } from '@/store/subscription/useSubscription'
import { usePayment } from '@/store/payment/usePayment'
import { useReferral } from '@/store/referral/useReferral'

function AppDataLoader({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const { fetchUser } = useUser()
  const { fetchSubscription, fetchRenewalPeriods } = useSubscription()
  const { fetchPaymentData } = usePayment()
  const { fetchReferralData } = useReferral()
  const isLoadedRef = useRef(false)

  useEffect(() => {
    if (!isAuthenticated) {
      isLoadedRef.current = false
      return
    }

    if (isLoadedRef.current) return
    isLoadedRef.current = true

    void fetchUser()
    void fetchSubscription()
    void fetchRenewalPeriods()
    void fetchPaymentData()
    void fetchReferralData()
  }, [
    isAuthenticated,
    fetchUser,
    fetchSubscription,
    fetchRenewalPeriods,
    fetchPaymentData,
    fetchReferralData,
  ])

  return children
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <SubscriptionProvider>
        <PaymentProvider>
          <ReferralProvider>
            <AppDataLoader>{children}</AppDataLoader>
          </ReferralProvider>
        </PaymentProvider>
      </SubscriptionProvider>
    </UserProvider>
  )
}
