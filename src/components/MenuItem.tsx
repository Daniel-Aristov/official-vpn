import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { TAB_PRESS_TRANSITION } from '@/js/constants/motion'

interface MenuItemProps {
  icon: ReactNode
  title: string
  subtitle: string
  last?: boolean
  onClick?: () => void
}

export function MenuItem({ icon, title, subtitle, onClick }: MenuItemProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      transition={TAB_PRESS_TRANSITION}
      className="flex items-center gap-3 w-full text-left cursor-pointer"
    >
      <div className="w-[46px] h-[46px] flex items-center justify-center rounded-[16px] bg-white-10 text-white-50! shrink-0">
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-white text-[16px] font-semibold leading-[130%]">
          {title}
        </span>
        <span className="text-white-80 text-[14px] leading-[130%]">
          {subtitle}
        </span>
      </div>
    </motion.button>
  )
}
