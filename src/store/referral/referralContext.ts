import { createContext } from 'react'
import type { ReferralData } from '@/js/types/referral'

export interface ReferralState {
  data: ReferralData | null
  isLoading: boolean
  fetchReferralData: () => Promise<void>
}

export const ReferralContext = createContext<ReferralState | null>(null)
