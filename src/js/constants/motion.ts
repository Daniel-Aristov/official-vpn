import type { Transition } from 'motion/react'

export const SHEET_EASE = [0.25, 0.46, 0.45, 0.94] as const

export const SHEET_TRANSITION: Transition = {
  duration: 0.3,
  ease: SHEET_EASE,
}

export const TAB_INDICATOR_TRANSITION: Transition = {
  duration: 0.28,
  ease: SHEET_EASE,
}

export const LIQUID_TAB_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 160,
  damping: 28,
  mass: 1.4,
}

export const TAB_PRESS_TRANSITION: Transition = {
  duration: 0.15,
  ease: SHEET_EASE,
}

export const FADE_TRANSITION: Transition = {
  duration: 0.3,
  ease: SHEET_EASE,
}
