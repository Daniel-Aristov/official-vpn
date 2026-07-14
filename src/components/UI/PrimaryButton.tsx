import type { ButtonHTMLAttributes, ReactNode } from 'react'

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

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
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
    <button
      type={type}
      disabled={disabled}
      className={[
        'tap-scale w-full flex items-center justify-center gap-2 rounded-2xl text-white font-semibold text-[16px] tracking-[-0.3px] cursor-pointer',
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
    </button>
  )
}
