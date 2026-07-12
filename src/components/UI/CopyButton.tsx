import { useState } from 'react'
import { motion } from 'motion/react'
import { CopyIcon } from '@/components/icons/CopyIcon'
import { CheckmarkIcon } from '@/components/icons/CheckmarkIcon'
import { copyToClipboard } from '@/js/helpers/clipboard'
import { TAB_PRESS_TRANSITION } from '@/js/constants/motion'

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
    <motion.button
      type="button"
      onClick={handleCopy}
      aria-label={ariaLabel}
      whileTap={{ scale: 0.82 }}
      transition={TAB_PRESS_TRANSITION}
      className={className}
    >
      {copied ? (
        <CheckmarkIcon className={iconClassName} fill="white" />
      ) : (
        <CopyIcon className={iconClassName} />
      )}
    </motion.button>
  )
}
