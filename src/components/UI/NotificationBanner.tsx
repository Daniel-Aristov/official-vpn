import type { ReactNode } from 'react'
import { InfoCircleIcon } from '../icons/InfoCircleIcon'
import { CheckmarkIcon } from '../icons/CheckmarkIcon'
import { BlockedCircleIcon } from '../icons/BlockedCircleIcon'
import { CloseIcon } from '../icons/CloseIcon'

type NotificationVariant = 'warning' | 'success' | 'blocked'

interface NotificationBannerProps {
  variant: NotificationVariant
  title: string
  message: string
  onClose?: () => void
  onAction?: () => void
  actionLabel?: string
}

const variantConfig: Record<
  NotificationVariant,
  { color: string; icon: ReactNode }
> = {
  warning: {
    color: '#FF6B6B',
    icon: <InfoCircleIcon />,
  },
  success: {
    color: '#139D76',
    icon: <CheckmarkIcon />,
  },
  blocked: {
    color: '#FF6B6B',
    icon: <BlockedCircleIcon />,
  },
}

export function NotificationBanner({
  variant,
  title,
  message,
  onClose,
  onAction,
  actionLabel = 'Поддержка',
}: NotificationBannerProps) {
  const { color, icon } = variantConfig[variant]

  return (
    <div className="bg-black/40 border border-white/10 rounded-[24px] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start flex-col gap-3 flex-1 min-w-0">
          <div className="shrink-0 mt-0.5">{icon}</div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[18px] leading-snug" style={{ color }}>
              {title}
            </p>
            <p className="text-white/80 text-[16px] leading-snug mt-[4px]">
              {message}
            </p>
          </div>
        </div>
        {variant === 'success' && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 text-white bg-white/10 border border-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors cursor-pointer"
          >
            <CloseIcon />
          </button>
        )}
      </div>
      {variant === 'blocked' && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-3 w-full bg-primary text-white font-semibold text-[15px] py-3 rounded-[14px] cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
