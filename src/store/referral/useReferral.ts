import { useContext } from 'react'
import { ReferralContext, type ReferralState } from '@/store/referral/referralContext'

export function useReferral(): ReferralState {
  const ctx = useContext(ReferralContext)
  if (!ctx) throw new Error('useReferral must be used within ReferralProvider')
  return ctx
}
