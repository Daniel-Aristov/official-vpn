import { apiEndpoints } from '@/js/constants/api'
import { api } from '@/js/services/api'
import { mapPlaceholderUser } from '@/js/services/mappers'
import type { PlaceholderUser } from '@/js/types/placeholder'
import type { User } from '@/js/types/user'

let userCache: Partial<User> = {}

export async function fetchUser(): Promise<User> {
  const raw = await api.get<PlaceholderUser>(apiEndpoints.user())
  return mapPlaceholderUser(raw, userCache)
}

export async function linkTelegram(): Promise<User> {
  const raw = await api.patch<PlaceholderUser>(apiEndpoints.user(), {
    username: 'vpn_user',
  })

  userCache = {
    ...userCache,
    isTelegramLinked: true,
    telegramId: '123456789',
    username: raw.username ?? 'vpn_user',
  }

  return mapPlaceholderUser(raw, userCache)
}

export async function syncUserEmail(email: string): Promise<void> {
  await api.patch<PlaceholderUser>(apiEndpoints.user(), { email })
  userCache = { ...userCache, email }
}
