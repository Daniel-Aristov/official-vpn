import type { ReactNode } from 'react'
import { BottomSheet } from '@/components/BottomSheet'
import { PrimaryButton } from '@/components/UI/PrimaryButton'
import { TenLocationFlagsIcon as FourLocationFlagsIcon } from '@/components/icons/FourLocationFlagsIcon'
import { ShieldCheckIcon } from '@/components/icons/ShieldCheckIcon'
import { TenLocationFlagsIcon } from '@/components/icons/TenLocationFlagsIcon'

interface UpgradeToProSheetProps {
  isMounted: boolean
  isVisible: boolean
  onClose: () => void
  onUpgrade?: () => void
  proPlanPrice?: number
  basicPlanPrice?: number
}

function PlanFeature({
  text,
  iconFill,
  textClassName,
  trailing,
}: {
  text: string
  iconFill: string
  textClassName: string
  trailing?: ReactNode
}) {
  return (
    <li className="flex items-center gap-2">
      <ShieldCheckIcon fill={iconFill} className="shrink-0" />
      <span className={`text-[14px] leading-[120%] ${textClassName}`}>{text}</span>
      {trailing}
    </li>
  )
}

export function UpgradeToProSheet({
  isMounted,
  isVisible,
  onClose,
  onUpgrade,
  proPlanPrice = 597,
  basicPlanPrice = 299,
}: UpgradeToProSheetProps) {
  return (
    <BottomSheet
      isMounted={isMounted}
      isVisible={isVisible}
      title="Переход на PRO"
      onClose={onClose}
    >
      <p className="text-white/50 text-[14px] leading-[120%] -mt-2">
        Переход на PRO выполняется без доплаты с пересчетом оставшихся дней
        активной подписки
      </p>

      <div className="pointer-events-none flex flex-col gap-3">
        <div className="border-2 border-primary bg-primary/30 rounded-[20px] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-white font-semibold text-[16px] leading-[130%]">
              PRO план
            </span>
            <span className="text-white font-bold text-[24px] leading-[110%]">
              {proPlanPrice} ₽
            </span>
          </div>
          <ul className="flex flex-col gap-2">
            <PlanFeature
              text="Больше 10 локаций"
              iconFill="#B4CBFF"
              textClassName="text-[#B4CBFF]"
              trailing={<TenLocationFlagsIcon className="shrink-0" />}
            />
            <PlanFeature
              text="6 устройств"
              iconFill="#B4CBFF"
              textClassName="text-[#B4CBFF]"
            />
            <PlanFeature
              text="Обход белых списков на LTE"
              iconFill="#B4CBFF"
              textClassName="text-[#B4CBFF]"
            />
            <PlanFeature
              text="YouTube без рекламы"
              iconFill="#B4CBFF"
              textClassName="text-[#B4CBFF]"
            />
          </ul>
        </div>

        <div className="bg-white/10 border border-white/10 rounded-[20px] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-white font-semibold text-[16px] leading-[130%]">
              Базовый план
            </span>
            <span className="text-white font-bold text-[24px] leading-[110%]">
              {basicPlanPrice} ₽
            </span>
          </div>
          <ul className="flex flex-col gap-2">
            <PlanFeature
              text="Всего 4 локации"
              iconFill="#FFFFFF80"
              textClassName="text-white/50"
              trailing={<FourLocationFlagsIcon className="shrink-0" />}
            />
            <PlanFeature
              text="До 3 устройств"
              iconFill="#FFFFFF80"
              textClassName="text-white/50"
            />
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <PrimaryButton size="large" type="button" onClick={onUpgrade}>
          Перейти на PRO
        </PrimaryButton>
        <PrimaryButton size="large" variant="secondary" type="button" onClick={onClose}>
          В следующий раз
        </PrimaryButton>
      </div>
    </BottomSheet>
  )
}
