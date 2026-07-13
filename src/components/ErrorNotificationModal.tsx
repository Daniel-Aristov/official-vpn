import { PrimaryButton } from '@/components/UI/PrimaryButton'

interface ErrorNotificationModalProps {
  isOpen: boolean
  onClose: () => void
  onSupport: () => void
}

export function ErrorNotificationModal({
  isOpen,
  onClose,
  onSupport,
}: ErrorNotificationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Закрыть"
        onClick={onClose}
        className="absolute inset-0 bg-black-50 backdrop-blur-sm cursor-default"
      />
      <div className="relative w-full max-w-[386px] bg-surface border border-white-10 rounded-[32px] p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-white font-semibold text-[24px] leading-[130%]">
            Произошла ошибка
          </h2>
          <p className="text-white-80 text-[16px] leading-[130%]">
            Попробуйте ещё раз через некоторое время, либо напишите в поддержку
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <PrimaryButton size="large" onClick={onSupport}>
            Написать в поддержку
          </PrimaryButton>
          <PrimaryButton size="large" variant="secondary" onClick={onClose}>
            Закрыть
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}
