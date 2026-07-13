import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { InfoCircleIcon } from '@/components/icons/InfoCircleIcon'
import { CheckmarkIcon } from '@/components/icons/CheckmarkIcon'
import { BlockedCircleIcon } from '@/components/icons/BlockedCircleIcon'
import { CloseIcon } from '@/components/icons/CloseIcon'
import { FADE_TRANSITION, TAB_PRESS_TRANSITION } from '@/js/constants/motion'

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
    color: 'var(--color-error)',
    icon: <InfoCircleIcon className="text-error" />,
  },
  success: {
    color: 'var(--color-success)',
    icon: <CheckmarkIcon />,
  },
  blocked: {
    color: 'var(--color-error)',
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
  const isWarningClickable = variant === 'warning' && onAction

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={FADE_TRANSITION}
      className={`bg-black-40 border border-white-10 rounded-[24px] p-4${isWarningClickable ? ' cursor-pointer' : ''}`}
      {...(isWarningClickable && {
        role: 'button',
        tabIndex: 0,
        onClick: onAction,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onAction()
          }
        },
      })}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start flex-col gap-3 flex-1 min-w-0">
          <div className="shrink-0 mt-0.5">{icon}</div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[18px] leading-snug" style={{ color }}>
              {title}
            </p>
            <p className="text-white-80 text-[16px] leading-snug mt-[4px]">
              {message}
            </p>
          </div>
        </div>
        {variant === 'success' && onClose && (
          <motion.button
            type="button"
            onClick={onClose}
            whileTap={{ scale: 0.82 }}
            transition={TAB_PRESS_TRANSITION}
            className="shrink-0 text-white bg-white-10 border border-white-20 rounded-full w-8 h-8 flex items-center justify-center transition-colors cursor-pointer"
          >
            <CloseIcon />
          </motion.button>
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
    </motion.div>
  )
}
