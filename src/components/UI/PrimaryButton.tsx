import type { ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'motion/react'
import { TAB_PRESS_TRANSITION } from '@/js/constants/motion'

type PrimaryButtonVariant = 'primary' | 'secondary'
type PrimaryButtonSize = 'default' | 'large'

const variantClasses: Record<PrimaryButtonVariant, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
}

const sizeClasses: Record<PrimaryButtonSize, string> = {
  default: 'py-2 px-4 leading-[150%]',
  large: 'py-[16px] leading-[20px]',
}

type PrimaryButtonProps = HTMLMotionProps<'button'> & {
  variant?: PrimaryButtonVariant
  size?: PrimaryButtonSize
  children: ReactNode
}

export function PrimaryButton({
  variant = 'primary',
  size = 'default',
  className,
  children,
  type = 'button',
  disabled,
  ...props
}: PrimaryButtonProps) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={TAB_PRESS_TRANSITION}
      className={[
        'w-full flex items-center justify-center gap-2 rounded-2xl text-white font-semibold text-[16px] tracking-[-0.3px] cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </motion.button>
  )
}
