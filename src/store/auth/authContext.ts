import { createContext } from 'react'

export interface AuthState {
  email: string | null
  isAuthenticated: boolean
  isLoading: boolean
  sendEmailCode: (email: string) => Promise<void>
  verifyEmailCode: (email: string, code: string) => Promise<boolean>
  resendEmailCode: (email: string) => Promise<void>
  logout: () => void
  setEmail: (email: string) => void
}

export const AuthContext = createContext<AuthState | null>(null)
