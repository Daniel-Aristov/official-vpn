interface AddSubscriptionAlertProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  deepLink: string
}

export function AddSubscriptionAlert({
  isOpen,
  onClose,
  onConfirm,
  deepLink,
}: AddSubscriptionAlertProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center px-6">
      <button
        type="button"
        aria-label="Закрыть"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-default"
      />
      <div className="relative w-full max-w-[300px] bg-white/40 backdrop-blur-xl border border-white/40 rounded-[24px] p-[12px] flex flex-col gap-8">
        <p className="text-white text-[17px] leading-[130%] break-all p-2">
          Открыть {deepLink}
        </p>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 text-white text-[17px] font-semibold bg-black/20 rounded-full cursor-pointer"
          >
            Нет
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-3 text-white text-[17px] font-semibold bg-primary rounded-full cursor-pointer"
          >
            Да
          </button>
        </div>
      </div>
    </div>
  )
}
