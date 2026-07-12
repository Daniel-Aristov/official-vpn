import { BottomSheet } from '@/components/BottomSheet'
import { PrimaryButton } from '@/components/UI/PrimaryButton'

interface PricingExplanationSheetProps {
  isOpen: boolean
  onClose: () => void
  pricePerDevice?: number
  remainingDays?: number
  currentPeriodSurcharge?: number
  nextPeriodMonthlyPrice?: number
}

export function PricingExplanationSheet({
  isOpen,
  onClose,
  pricePerDevice = 60,
  remainingDays = 60,
  currentPeriodSurcharge = 120,
  nextPeriodMonthlyPrice = 259,
}: PricingExplanationSheetProps) {
  const total = currentPeriodSurcharge + nextPeriodMonthlyPrice

  return (
    <BottomSheet
      isOpen={isOpen}
      title="Пояснение к расчёту стоимости"
      onClose={onClose}
    >
      <p className="text-white/80 text-[16px] leading-[130%]">
        Итоговая стоимость подписки формируется из базового тарифа и
        подключённых дополнительных опций.
      </p>
      <div className="flex flex-col text-white/80 text-[16px] leading-[130%]">
        <p>Цена за 1 устройство: {pricePerDevice} Р в месяц.</p>
        <p>Остаток подписки: {remainingDays} дней.</p>
        <p>Доплата за текущий период: {currentPeriodSurcharge} Р.</p>
      </div>
      <p className="text-white/80 text-[16px] leading-[130%]">
        Оплата за следующие периоды: {nextPeriodMonthlyPrice} Р в месяц.
      </p>
      <p className="text-white/80 text-[16px] leading-[130%]">
        Итого: {currentPeriodSurcharge} + {nextPeriodMonthlyPrice} = {total} Р
      </p>
      <PrimaryButton size="large" onClick={onClose}>
        Всё понять, закрыть
      </PrimaryButton>
    </BottomSheet>
  )
}
