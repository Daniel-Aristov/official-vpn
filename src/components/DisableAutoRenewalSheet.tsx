import { BottomSheet } from '@/components/BottomSheet'
import { PrimaryButton } from '@/components/UI/PrimaryButton'

interface DisableAutoRenewalSheetProps {
  isMounted: boolean
  isVisible: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DisableAutoRenewalSheet({
  isMounted,
  isVisible,
  onClose,
  onConfirm,
}: DisableAutoRenewalSheetProps) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <BottomSheet
      isMounted={isMounted}
      isVisible={isVisible}
      title="Отключить автопродление?"
      onClose={onClose}
    >
      <p className="text-white/80 text-[16px] leading-[130%]">
        Чтобы не потерять доступ к VPN, мы рекомендуем оставить автопродление
        включённым. Вы уверены, что хотите его отключить?
      </p>
      <div className="flex flex-col gap-2">
        <PrimaryButton size="large" onClick={onClose}>
          Нет
        </PrimaryButton>
        <PrimaryButton size="large" variant="secondary" onClick={handleConfirm}>
          Да
        </PrimaryButton>
      </div>
    </BottomSheet>
  )
}
