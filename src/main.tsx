import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@/styles/index.css'
import App from '@/App.tsx'
import { AuthProvider } from '@/store/auth/authStore'
import { AppStoreProvider } from '@/store/AppStoreProvider'

function renderApp() {
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
}

// Монтируем приложение только когда кадр реально виден пользователю,
// чтобы анимации входа стартовали в момент показа (одинаково при
// перезагрузке и при навигации), а не проигрывались вхолостую.
function start() {
  requestAnimationFrame(renderApp)
}

if (document.visibilityState === 'visible') {
  start()
} else {
  const onVisible = () => {
    if (document.visibilityState !== 'visible') return
    document.removeEventListener('visibilitychange', onVisible)
    start()
  }
  document.addEventListener('visibilitychange', onVisible)
}
