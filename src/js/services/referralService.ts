import { defaultReferralData } from '@/js/services/utils/mappers'
import type { ReferralData } from '@/js/types/referral'

export async function fetchReferralData(): Promise<ReferralData> {
  return defaultReferralData()
}

export function formatMoney(amount: number): string {
  return `${amount.toLocaleString('ru-RU')} ₽`
}
