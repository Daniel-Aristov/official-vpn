import { BottomSheet } from '@/components/BottomSheet'
import { PrimaryButton } from '@/components/UI/PrimaryButton'

const TELEGRAM_BOT_URL = 'https://t.me/official_vpnbot'

interface TelegramLinkSheetProps {
  isOpen: boolean
  onClose: () => void
  onLink: () => void
  onLater: () => void
}

export function TelegramLinkSheet({
  isOpen,
  onClose,
  onLink,
  onLater,
}: TelegramLinkSheetProps) {
  const handleLink = () => {
    window.open(TELEGRAM_BOT_URL, '_blank', 'noopener,noreferrer')
    onLink()
  }

  return (
    <BottomSheet
      isOpen={isOpen}
      title="Привязка к Telegram"
      onClose={onClose}
    >
      <p className="text-white/80 text-[16px] leading-[130%]">
        Чтобы не потерять доступ, пожалуйста привяжите ваш телеграм-аккаунт
      </p>
      <div className="flex flex-col gap-2">
        <PrimaryButton size="large" onClick={handleLink}>
          Привязать к telegram
        </PrimaryButton>
        <PrimaryButton size="large" variant="secondary" onClick={onLater}>
          Сделать позже
        </PrimaryButton>
      </div>
    </BottomSheet>
  )
}
