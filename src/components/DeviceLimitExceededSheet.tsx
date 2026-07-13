import { BottomSheet } from '@/components/BottomSheet'
import { PrimaryButton } from '@/components/UI/PrimaryButton'

interface DeviceLimitExceededSheetProps {
  isOpen: boolean
  onClose: () => void
  onIncreaseLimit: () => void
  onManageDevices: () => void
}

export function DeviceLimitExceededSheet({
  isOpen,
  onClose,
  onIncreaseLimit,
  onManageDevices,
}: DeviceLimitExceededSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      title="Превышен лимит устройств"
      onClose={onClose}
    >
      <p className="text-white-80 text-[16px] leading-[120%] -mt-2">
        К вашей подписке подключено максимальное количество устройств. Чтобы
        добавить новое устройство, удалите неиспользуемые устройства или
        увеличьте лимит в настройках тарифа.
      </p>

      <div className="flex flex-col gap-2">
        <PrimaryButton size="large" type="button" onClick={onIncreaseLimit}>
          Увеличить лимит
        </PrimaryButton>
        <PrimaryButton
          size="large"
          variant="secondary"
          type="button"
          onClick={onManageDevices}
        >
          Перейти к управлению устройств
        </PrimaryButton>
      </div>
    </BottomSheet>
  )
}
