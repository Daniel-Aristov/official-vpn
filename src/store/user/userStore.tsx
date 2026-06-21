import { useCallback, useState } from 'react'
import type { ReactNode } from 'react'
import * as userService from '@/js/services/userService'
import type { User } from '@/js/types/user'
import { UserContext } from '@/store/user/userContext'

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchUser = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await userService.fetchUser()
      setUser(data)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const linkTelegram = useCallback(async () => {
    const data = await userService.linkTelegram()
    setUser(data)
  }, [])

  return (
    <UserContext.Provider value={{ user, isLoading, fetchUser, linkTelegram }}>
      {children}
    </UserContext.Provider>
  )
}
