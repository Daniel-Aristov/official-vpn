import { useState } from 'react'
import { CopyIcon } from '@/components/icons/CopyIcon'
import { CheckmarkIcon } from '@/components/icons/CheckmarkIcon'
import { copyToClipboard } from '@/js/helpers/clipboard'

const DEFAULT_CLASS =
  'w-[46px] h-[46px] flex items-center justify-center rounded-full bg-primary text-white cursor-pointer shrink-0'

interface CopyButtonProps {
  text: string
  className?: string
  iconClassName?: string
  'aria-label'?: string
}

export function CopyButton({
  text,
  className = DEFAULT_CLASS,
  iconClassName,
  'aria-label': ariaLabel = 'Скопировать',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await copyToClipboard(text)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={ariaLabel}
      className={`tap-scale-strong ${className}`}
    >
      {copied ? (
        <CheckmarkIcon className={iconClassName} fill="var(--color-white)" />
      ) : (
        <CopyIcon className={iconClassName} />
      )}
    </button>
  )
}
