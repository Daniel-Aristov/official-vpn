import { Navigate, Route, Routes } from 'react-router-dom'
import { NotFoundRedirect } from '@/routes/NotFoundRedirect'
import { PrivateRoute } from '@/routes/PrivateRoute'
import { MainView } from '@/views/MainView'
import { EmailAuthPage } from '@/pages/auth/EmailAuthPage'
import { EmailVerifyPage } from '@/pages/auth/EmailVerifyPage'
import { HomePage } from '@/pages/auth/HomePage'
import { MainPage } from '@/pages/main/MainPage'
import { SetupPage } from '@/pages/main/SetupPage'
import { BuySubscriptionPage } from '@/pages/main/BuySubscriptionPage'
import { ProfilePage } from '@/pages/main/profile/ProfilePage'
import { AccessPreservationPage } from '@/pages/main/profile/AccessPreservationPage'
import { ReferralProgramPage } from '@/pages/main/profile/ReferralProgramPage'
import { PaymentHistoryPage } from '@/pages/main/profile/PaymentHistoryPage'
import { UserAgreementPage } from '@/pages/main/profile/UserAgreementPage'
import { PrivacyPolicyPage } from '@/pages/main/profile/PrivacyPolicyPage'
import { SupportPage } from '@/pages/main/support/SupportPage'
import { FaqPage } from '@/pages/main/support/FaqPage'
import { ContactSupportPage } from '@/pages/main/support/ContactSupportPage'
import { DevicesPage } from '@/pages/main/devices/DevicesPage'
import { BuySlotsPage } from '@/pages/main/devices/BuySlotsPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/auth/email" element={<EmailAuthPage />} />
      <Route path="/auth/email/verify" element={<EmailVerifyPage />} />
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
  )
}
