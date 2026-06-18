import { Route, Routes } from 'react-router-dom'
import { AppBackground } from './components/UI/AppBackground'
import { EmailAuthPage } from './pages/Auth/EmailAuthPage'
import { EmailVerifyPage } from './pages/Auth/EmailVerifyPage'
import { HomePage } from './pages/Auth/HomePage'

function App() {
  return (
    <AppBackground>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/email" element={<EmailAuthPage />} />
        <Route path="/auth/email/verify" element={<EmailVerifyPage />} />
      </Routes>
    </AppBackground>
  )
}

export default App
