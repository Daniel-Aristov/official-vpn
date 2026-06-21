export interface ReferralBonusesStats {
  invitedCount: number
  bonusDays: number
  referralLink: string
}

export interface ReferralMoneyStats {
  invitedCount: number
  balance: number
  earned: number
  withdrawn: number
  referralLink: string
}

export interface ReferralData {
  bonuses: ReferralBonusesStats
  money: ReferralMoneyStats
}
