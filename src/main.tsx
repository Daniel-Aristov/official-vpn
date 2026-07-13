import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@/styles/index.css'
import App from '@/App.tsx'
import { AuthProvider } from '@/store/auth/authStore'
import { AppStoreProvider } from '@/store/AppStoreProvider'

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
