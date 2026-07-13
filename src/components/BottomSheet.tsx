import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { CloseIcon } from '@/components/icons/CloseIcon'
import { SHEET_TRANSITION, TAB_PRESS_TRANSITION } from '@/js/constants/motion'

interface BottomSheetProps {
  isOpen: boolean
  title: string
  onClose: () => void
  children: ReactNode
  zIndexClass?: string
}

export function BottomSheet({
  isOpen,
  title,
  onClose,
  children,
  zIndexClass = 'z-60',
}: BottomSheetProps) {
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className={`fixed inset-0 ${zIndexClass} flex items-end justify-center`}
        >
          <motion.button
            type="button"
            aria-label="Закрыть"
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={SHEET_TRANSITION}
          />
          <motion.div
            className="relative w-full max-w-[768px] bg-[#28282D] border border-white/10 rounded-t-[32px] p-6 flex flex-col gap-4"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={SHEET_TRANSITION}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-white font-semibold text-[24px] leading-[120%]">
                {title}
              </h2>
              <motion.button
                type="button"
                onClick={onClose}
                aria-label="Закрыть"
                whileTap={{ scale: 0.82 }}
                transition={TAB_PRESS_TRANSITION}
                className="shrink-0 text-white bg-white/10 border border-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors cursor-pointer"
              >
                <CloseIcon />
              </motion.button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
