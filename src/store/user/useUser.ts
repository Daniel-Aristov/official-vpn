import { useContext } from 'react'
import { UserContext, type UserState } from '@/store/user/userContext'

export function useUser(): UserState {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}
