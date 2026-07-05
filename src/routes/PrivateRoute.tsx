import { Navigate, Outlet } from 'react-router-dom'
import { isAuthenticated } from '@/js/services/authService'

export function PrivateRoute() {
  return isAuthenticated() ? (
    <Outlet />
  ) : (
    <Navigate to="/auth/email" replace />
  )
}
