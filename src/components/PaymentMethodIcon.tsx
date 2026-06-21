import { PaymentHistoryIcon } from '@/components/icons/PaymentHistoryIcon'
import { SBPLogoIcon } from '@/components/icons/SBPLogoIcon'
import { TetherLogoIcon } from '@/components/icons/TetherLogoIcon'
import type { PaymentMethod } from '@/data/paymentMethods'

interface PaymentMethodIconProps {
  method: PaymentMethod
  variant: 'checkout' | 'picker'
}

export function PaymentMethodIcon({ method, variant }: PaymentMethodIconProps) {
  if (variant === 'checkout') {
    if (method.id === 'card') {
      return <PaymentHistoryIcon className="w-7 h-7 shrink-0 text-white" />
    }
    if (method.id === 'sbp') {
      return <SBPLogoIcon className="h-7 w-auto shrink-0" />
    }
    return <TetherLogoIcon className="h-[19px] w-auto shrink-0" />
  }

  return (
    <div className="w-[72px] h-[50px] flex items-center justify-center rounded-[8px] bg-white/10 shrink-0 text-white">
      {method.id === 'card' ? (
        <PaymentHistoryIcon className="w-6 h-6" />
      ) : method.id === 'sbp' ? (
        <SBPLogoIcon className="h-[28px] w-auto" />
      ) : (
        <TetherLogoIcon className="h-[19px] w-auto" />
      )}
    </div>
  )
}
