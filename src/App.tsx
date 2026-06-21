import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppBackground } from '@/components/UI/AppBackground'
import { ErrorNotificationModal } from '@/components/ErrorNotificationModal'
import { SuccessRegistrationModal } from '@/components/SuccessRegistrationModal'
import { AppRoutes } from '@/routes/AppRoutes'

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
      <AppRoutes />
    </AppBackground>
  )
}

export default App
