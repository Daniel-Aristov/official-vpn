import { Navigate } from 'react-router-dom'
import { isAuthenticated } from '@/js/services/authService'

export function NotFoundRedirect() {
  return (
    <Navigate to={isAuthenticated() ? '/main' : '/'} replace />
  )
}
