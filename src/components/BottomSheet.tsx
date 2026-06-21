import type { ReactNode } from 'react'
import { CloseIcon } from '@/components/icons/CloseIcon'

interface BottomSheetProps {
  isMounted: boolean
  isVisible: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export function BottomSheet({
  isMounted,
  isVisible,
  title,
  onClose,
  children,
}: BottomSheetProps) {
  if (!isMounted) return null

  return (
    <div className="fixed inset-0 z-60 flex items-end justify-center">
      <button
        type="button"
        aria-label="Закрыть"
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm cursor-default transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`relative w-full max-w-[768px] bg-[#28282D] border border-white/10 rounded-t-[32px] p-6 flex flex-col gap-4 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-white font-semibold text-[24px] leading-[120%]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="shrink-0 text-white bg-white/10 border border-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors cursor-pointer"
          >
            <CloseIcon />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
