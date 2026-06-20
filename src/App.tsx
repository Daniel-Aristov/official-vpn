import { useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { AppBackground } from '@/components/UI/AppBackground'
import { ErrorNotificationModal } from '@/components/ErrorNotificationModal'
import { SuccessRegistrationModal } from '@/components/SuccessRegistrationModal'
import { MainView } from '@/views/MainView'
import { EmailAuthPage } from '@/pages/auth/EmailAuthPage'
import { EmailVerifyPage } from '@/pages/auth/EmailVerifyPage'
import { HomePage } from '@/pages/auth/HomePage'
import { MainPage } from '@/pages/main/MainPage'
import { ProfilePage } from '@/pages/main/ProfilePage'
import { SetupPage } from '@/pages/main/SetupPage'
import { AccessPreservationPage } from '@/pages/main/AccessPreservationPage'
import { ReferralProgramPage } from '@/pages/main/ReferralProgramPage'
import { ContactSupportPage } from '@/pages/main/ContactSupportPage'
import { FaqPage } from '@/pages/main/FaqPage'
import { SupportPage } from '@/pages/main/SupportPage'

function App() {
  const navigate = useNavigate()
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  return (
    <AppBackground>
      <ErrorNotificationModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        onSupport={() => {
          setIsErrorModalOpen(false)
          navigate('/main/support')
        }}
      />
      <SuccessRegistrationModal
        isOpen={isSuccessModalOpen}
        onReturnToApp={() => setIsSuccessModalOpen(false)}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/email" element={<EmailAuthPage />} />
        <Route path="/auth/email/verify" element={<EmailVerifyPage />} />
        <Route path="/main" element={<MainView />}>
          <Route index element={<MainPage />} />
          <Route path="setup" element={<SetupPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/access" element={<AccessPreservationPage />} />
          <Route path="profile/referral" element={<ReferralProgramPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="support/faq" element={<FaqPage />} />
          <Route path="support/contact" element={<ContactSupportPage />} />
        </Route>
      </Routes>
    </AppBackground>
  )
}

export default App
