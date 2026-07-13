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
import { DownloadProvider } from '@/store/download/downloadStore'
import { useDownload } from '@/store/download/useDownload'

function AppDataLoader({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const { fetchUser } = useUser()
  const { fetchSubscription, fetchRenewalPeriods } = useSubscription()
  const { fetchPaymentData } = usePayment()
  const { fetchReferralData } = useReferral()
  const { fetchDownloadLinks } = useDownload()
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
    void fetchDownloadLinks()
  }, [
    isAuthenticated,
    fetchUser,
    fetchSubscription,
    fetchRenewalPeriods,
    fetchPaymentData,
    fetchReferralData,
    fetchDownloadLinks,
  ])

  return children
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <SubscriptionProvider>
        <PaymentProvider>
          <ReferralProvider>
            <DownloadProvider>
              <AppDataLoader>{children}</AppDataLoader>
            </DownloadProvider>
          </ReferralProvider>
        </PaymentProvider>
      </SubscriptionProvider>
    </UserProvider>
  )
}
