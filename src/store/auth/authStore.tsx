import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import * as authService from '@/js/services/authService'
import { AuthContext } from '@/store/auth/authContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [email, setEmailState] = useState<string | null>(
    authService.getStoredEmail(),
  )
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated(),
  )
  const [isLoading, setIsLoading] = useState(false)

  const setEmail = useCallback((value: string) => {
    setEmailState(value)
  }, [])

  const sendEmailCode = useCallback(async (value: string) => {
    setIsLoading(true)
    try {
      await authService.sendEmailCode(value)
      setEmailState(value)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const verifyEmailCode = useCallback(async (value: string, code: string) => {
    setIsLoading(true)
    try {
      const result = await authService.verifyEmailCode(value, code)
      setEmailState(result.email)
      setIsAuthenticated(true)
      return true
    } catch {
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const resendEmailCode = useCallback(async (value: string) => {
    setIsLoading(true)
    try {
      await authService.sendEmailCode(value)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setEmailState(null)
    setIsAuthenticated(false)
  }, [])

  useEffect(() => {
    return authService.onSessionInvalidated(() => {
      setEmailState(null)
      setIsAuthenticated(false)
      navigate('/auth/email', { replace: true })
    })
  }, [navigate])

  const value = useMemo(
    () => ({
      email,
      isAuthenticated,
      isLoading,
      sendEmailCode,
      verifyEmailCode,
      resendEmailCode,
      logout,
      setEmail,
    }),
    [
      email,
      isAuthenticated,
      isLoading,
      sendEmailCode,
      verifyEmailCode,
      resendEmailCode,
      logout,
      setEmail,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
