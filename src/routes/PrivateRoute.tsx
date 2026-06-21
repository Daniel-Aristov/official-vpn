import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/store/auth/useAuth'

export function PrivateRoute() {
  const { email } = useAuth()
  return email ? <Outlet /> : <Navigate to="/" replace />
}
