import { PaymentHistoryIcon } from '@/components/icons/PaymentHistoryIcon'
import { SBPLogoIcon } from '@/components/icons/SBPLogoIcon'
import { TetherLogoIcon } from '@/components/icons/TetherLogoIcon'
import { WalletIcon } from '@/components/icons/WalletIcon'
import type { PaymentMethodId } from '@/js/types/payment'

interface PaymentMethodIconProps {
  methodId: PaymentMethodId
  variant: 'checkout' | 'picker'
}

export function PaymentMethodIcon({ methodId, variant }: PaymentMethodIconProps) {
  if (variant === 'checkout') {
    if (methodId === 'card') {
      return <PaymentHistoryIcon className="w-7 h-7 shrink-0 text-white" />
    }
    if (methodId === 'sbp') {
      return <SBPLogoIcon className="h-7 w-auto shrink-0" />
    }
    if (methodId === 'wallet') {
      return <WalletIcon className="w-7 h-7 shrink-0 text-white" />
    }
    return <TetherLogoIcon className="h-[19px] w-auto shrink-0" />
  }

  return (
    <div className="w-[72px] h-[50px] flex items-center justify-center rounded-[8px] bg-white/10 shrink-0 text-white">
      {methodId === 'card' ? (
        <PaymentHistoryIcon className="w-6 h-6" />
      ) : methodId === 'sbp' ? (
        <SBPLogoIcon className="h-[28px] w-auto" />
      ) : methodId === 'wallet' ? (
        <WalletIcon className="w-6 h-6" />
      ) : (
        <TetherLogoIcon className="h-[19px] w-auto" />
      )}
    </div>
  )
}
