import { useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from '@/store/auth/authContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null)

  return (
    <AuthContext.Provider value={{ email, setEmail }}>
      {children}
    </AuthContext.Provider>
  )
}
