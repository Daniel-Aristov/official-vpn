import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { NotFoundRedirect } from '@/routes/NotFoundRedirect'
import { PrivateRoute } from '@/routes/PrivateRoute'
import { AuthView } from '@/views/AuthView'
import { MainView } from '@/views/MainView'
import { HomePage } from '@/pages/auth/HomePage'

const EmailAuthPage = lazy(() =>
  import('@/pages/auth/EmailAuthPage').then((m) => ({ default: m.EmailAuthPage })),
)
const EmailVerifyPage = lazy(() =>
  import('@/pages/auth/EmailVerifyPage').then((m) => ({ default: m.EmailVerifyPage })),
)
const MainPage = lazy(() =>
  import('@/pages/main/MainPage').then((m) => ({ default: m.MainPage })),
)
const SetupPage = lazy(() =>
  import('@/pages/main/SetupPage').then((m) => ({ default: m.SetupPage })),
)
const BuySubscriptionPage = lazy(() =>
  import('@/pages/main/BuySubscriptionPage').then((m) => ({
    default: m.BuySubscriptionPage,
  })),
)
const ProfilePage = lazy(() =>
  import('@/pages/main/profile/ProfilePage').then((m) => ({ default: m.ProfilePage })),
)
const AccessPreservationPage = lazy(() =>
  import('@/pages/main/profile/AccessPreservationPage').then((m) => ({
    default: m.AccessPreservationPage,
  })),
)
const ReferralProgramPage = lazy(() =>
  import('@/pages/main/profile/ReferralProgramPage').then((m) => ({
    default: m.ReferralProgramPage,
  })),
)
const PaymentHistoryPage = lazy(() =>
  import('@/pages/main/profile/PaymentHistoryPage').then((m) => ({
    default: m.PaymentHistoryPage,
  })),
)
const UserAgreementPage = lazy(() =>
  import('@/pages/main/profile/UserAgreementPage').then((m) => ({
    default: m.UserAgreementPage,
  })),
)
const PrivacyPolicyPage = lazy(() =>
  import('@/pages/main/profile/PrivacyPolicyPage').then((m) => ({
    default: m.PrivacyPolicyPage,
  })),
)
const SupportPage = lazy(() =>
  import('@/pages/main/support/SupportPage').then((m) => ({ default: m.SupportPage })),
)
const FaqPage = lazy(() =>
  import('@/pages/main/support/FaqPage').then((m) => ({ default: m.FaqPage })),
)
const ContactSupportPage = lazy(() =>
  import('@/pages/main/support/ContactSupportPage').then((m) => ({
    default: m.ContactSupportPage,
  })),
)
const DevicesPage = lazy(() =>
  import('@/pages/main/devices/DevicesPage').then((m) => ({ default: m.DevicesPage })),
)
const BuySlotsPage = lazy(() =>
  import('@/pages/main/devices/BuySlotsPage').then((m) => ({ default: m.BuySlotsPage })),
)

function RouteFallback() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
    </div>
  )
}

export function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<AuthView />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/email" element={<EmailAuthPage />} />
          <Route path="/auth/email/verify" element={<EmailVerifyPage />} />
        </Route>
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/main" element={<MainView />}>
            <Route index element={<MainPage />} />
            <Route path="setup" element={<SetupPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="profile/access" element={<AccessPreservationPage />} />
            <Route path="profile/referral" element={<ReferralProgramPage />} />
            <Route path="profile/payment" element={<PaymentHistoryPage />} />
            <Route path="profile/agreement" element={<UserAgreementPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="support/faq" element={<FaqPage />} />
            <Route path="support/contact" element={<ContactSupportPage />} />
            <Route path="devices" element={<DevicesPage />} />
            <Route path="devices/slots" element={<BuySlotsPage />} />
            <Route path="subscription" element={<BuySubscriptionPage />} />
            <Route path="*" element={<Navigate to="/main" replace />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundRedirect />} />
      </Routes>
    </Suspense>
  )
}
