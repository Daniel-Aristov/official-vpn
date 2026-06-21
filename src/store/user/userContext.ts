import { createContext } from 'react'
import type { User } from '@/js/types/user'

export interface UserState {
  user: User | null
  isLoading: boolean
  fetchUser: () => Promise<void>
  linkTelegram: () => Promise<void>
}

export const UserContext = createContext<UserState | null>(null)
