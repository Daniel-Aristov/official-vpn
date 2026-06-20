import { createContext } from 'react'

export interface AuthState {
  email: string | null
  setEmail: (email: string) => void
}

export const AuthContext = createContext<AuthState | null>(null)
