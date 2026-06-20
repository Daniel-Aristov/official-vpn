import { PrimaryButton } from '@/components/UI/PrimaryButton'
import { CheckmarkIcon } from '@/components/icons/CheckmarkIcon'
import { InfoCircleIcon } from '@/components/icons/InfoCircleIcon'
import { LinkIcon } from '@/components/icons/LinkIcon'
import { CopyIcon } from '@/components/icons/CopyIcon'

const SITE_URL = 'https://official.vpn'

interface SuccessRegistrationModalProps {
  isOpen: boolean
  onReturnToApp: () => void
}

export function SuccessRegistrationModal({
  isOpen,
  onReturnToApp,
}: SuccessRegistrationModalProps) {
  if (!isOpen) return null

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(SITE_URL)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative w-full max-w-[386px] bg-[#28282D] border border-white/10 rounded-[32px] p-6 flex flex-col gap-4">
        <div className="w-[56px] h-[56px] flex items-center justify-center rounded-[16px] bg-white/10 shrink-0">
          <CheckmarkIcon className="w-6 h-6" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-white font-semibold text-[24px] leading-[130%]">
            Вы успешно зарегистрировались!
          </h2>
          <p className="text-white/80 text-[16px] leading-[130%]">
            Вам необходимо вернуться обратно в приложении
          </p>
        </div>
        <div className="bg-white/10 border border-white/10 rounded-[24px] p-4 flex flex-col gap-4">
          <div className="flex flex-col items-start gap-3">
            <InfoCircleIcon className="w-6 h-6 shrink-0 text-white/80" />
            <p className="text-white/80 text-[16px] leading-[130%]">
              Сохраните этот сайт, чтобы иметь возможность пользоваться своим
              личным кабинетом
            </p>
          </div>
          <div className="flex items-center gap-3 bg-secondary border border-white/10 rounded-[16px] px-4 py-[8px]">
            <LinkIcon className="w-6 h-6 shrink-0 text-white" />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-white/80 text-[16px] leading-[130%]">
                Ссылка на сайт
              </span>
              <span className="text-white text-[16px] leading-[130%] truncate">
                {SITE_URL}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyLink}
              aria-label="Скопировать ссылку"
              className="w-[46px] h-[46px] flex items-center justify-center rounded-full bg-primary text-white cursor-pointer shrink-0"
            >
              <CopyIcon />
            </button>
          </div>
        </div>
        <PrimaryButton size="large" onClick={onReturnToApp}>
          Вернуться в приложение
        </PrimaryButton>
      </div>
    </div>
  )
}
