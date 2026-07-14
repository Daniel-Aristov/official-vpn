import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@/styles/index.css'
import App from '@/App.tsx'
import { AuthProvider } from '@/store/auth/authStore'
import { AppStoreProvider } from '@/store/AppStoreProvider'

function markAppReady() {
  requestAnimationFrame(() =>
    document.documentElement.classList.add('app-ready'),
  )
}

if (document.visibilityState === 'visible') {
  markAppReady()
} else {
  const onVisible = () => {
    if (document.visibilityState !== 'visible') return
    document.removeEventListener('visibilitychange', onVisible)
    markAppReady()
  }
  document.addEventListener('visibilitychange', onVisible)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppStoreProvider>
          <App />
        </AppStoreProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
