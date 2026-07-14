import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import * as referralService from '@/js/services/referralService'
import type { ReferralData } from '@/js/types/referral'
import { ReferralContext } from '@/store/referral/referralContext'

export function ReferralProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ReferralData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchReferralData = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await referralService.fetchReferralData()
      setData(result)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const value = useMemo(
    () => ({ data, isLoading, fetchReferralData }),
    [data, isLoading, fetchReferralData],
  )

  return (
    <ReferralContext.Provider value={value}>
      {children}
    </ReferralContext.Provider>
  )
}
