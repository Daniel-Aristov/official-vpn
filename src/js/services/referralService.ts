import { apiEndpoints } from '@/js/constants/api'
import { api } from '@/js/services/api'
import { defaultReferralData } from '@/js/services/mappers'
import type { PlaceholderPost } from '@/js/types/placeholder'
import type { ReferralData } from '@/js/types/referral'

export async function fetchReferralData(): Promise<ReferralData> {
  await api.get<PlaceholderPost[]>(`${apiEndpoints.posts}?_limit=1`)
  return defaultReferralData()
}

export function formatMoney(amount: number): string {
  return `${amount.toLocaleString('ru-RU')} ₽`
}
