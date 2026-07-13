import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from 'motion/react'
import { GearIcon } from '@/components/icons/GearIcon'
import { HeadphonesIcon } from '@/components/icons/HeadphonesIcon'
import { HomeIcon } from '@/components/icons/HomeIcon'
import { PersonIcon } from '@/components/icons/PersonIcon'
import { TAB_PRESS_TRANSITION } from '@/js/constants/motion'

const tabs = [
  { path: '/main', label: 'Главная', icon: HomeIcon, end: true },
  { path: '/main/setup', label: 'Настройка', icon: GearIcon, end: false },
  {
    path: '/main/profile',
    label: 'Профиль',
    icon: PersonIcon,
    end: false,
    matchPrefixes: ['/main/devices'],
  },
  {
    path: '/main/support',
    label: 'Поддержка',
    icon: HeadphonesIcon,
    end: false,
  },
] as const

type TabConfig = (typeof tabs)[number]

function isTabActive(tab: TabConfig, pathname: string) {
  if (
    'matchPrefixes' in tab &&
    tab.matchPrefixes?.some((prefix) => pathname.startsWith(prefix))
  ) {
    return true
  }

  return tab.end ? pathname === tab.path : pathname.startsWith(tab.path)
}

const indicatorGlassStyle = {
  boxShadow:
    'inset 0 1px 0 rgba(255, 255, 255, 0.28), inset 0 -1px 0 rgba(255, 255, 255, 0.06), 0 4px 16px rgba(0, 0, 0, 0.18)',
} as const

const TAB_UNIT = `((100% - 8px) / ${tabs.length})`

const LEAD_SPRING = { type: 'spring', stiffness: 420, damping: 34, mass: 0.7 } as const
const LAG_SPRING = { type: 'spring', stiffness: 280, damping: 30, mass: 0.8 } as const
const SNAP_SPRING = { type: 'spring', stiffness: 380, damping: 32, mass: 0.7 } as const

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function BottomTabBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const navRef = useRef<HTMLElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const activeIndex = tabs.findIndex((tab) => isTabActive(tab, location.pathname))

  const leadingUnit = useMotionValue(Math.max(activeIndex, 0))
  const trailingUnit = useMotionValue(Math.max(activeIndex, 0) + 1)
  const dragScaleY = useMotionValue(1)
  const prevIndexRef = useRef(activeIndex)

  const scaleX = useTransform(
    [leadingUnit, trailingUnit],
    ([leading, trailing]: number[]) => trailing - leading,
  )
  const baseTransform = useMotionTemplate`translateX(calc(${leadingUnit} * 100%)) scaleX(${scaleX})`
  const indicatorTransform = useMotionTemplate`translateX(calc(${leadingUnit} * 100%)) scaleX(${scaleX}) scaleY(${dragScaleY})`

  useEffect(() => {
    const prevIndex = prevIndexRef.current
    prevIndexRef.current = activeIndex
    if (activeIndex < 0 || prevIndex === activeIndex || isDragging) return

    const movingRight = activeIndex > prevIndex
    animate(leadingUnit, activeIndex, movingRight ? LAG_SPRING : LEAD_SPRING)
    animate(
      trailingUnit,
      activeIndex + 1,
      movingRight ? LEAD_SPRING : LAG_SPRING,
    )
  }, [activeIndex, isDragging, leadingUnit, trailingUnit])

  useEffect(() => {
    animate(dragScaleY, isDragging ? 1.08 : 1, SNAP_SPRING)
  }, [isDragging, dragScaleY])

  const getUnitFromPointer = (clientX: number) => {
    const rect = navRef.current?.getBoundingClientRect()
    if (!rect) return activeIndex
    const tabWidth = (rect.width - 8) / tabs.length
    return clamp((clientX - rect.left - 4) / tabWidth, 0, tabs.length)
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (activeIndex < 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    setIsDragging(true)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const leading = clamp(
      getUnitFromPointer(event.clientX) - 0.5,
      0,
      tabs.length - 1,
    )
    leadingUnit.set(leading)
    trailingUnit.set(leading + 1)
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    setIsDragging(false)
    const nearestIndex = clamp(
      Math.round(getUnitFromPointer(event.clientX) - 0.5),
      0,
      tabs.length - 1,
    )
    navigate(tabs[nearestIndex].path)
    if (nearestIndex !== activeIndex) return
    animate(leadingUnit, activeIndex, SNAP_SPRING)
    animate(trailingUnit, activeIndex + 1, SNAP_SPRING)
  }

  return createPortal(
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(16px,env(safe-area-inset-bottom))] pointer-events-none">
      <nav
        ref={navRef}
        className="relative mx-auto flex h-[61px] w-full max-w-[768px] items-stretch overflow-hidden rounded-full p-1 pointer-events-auto"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(7px)',
          WebkitBackdropFilter: 'blur(7px)',
          boxShadow:
            '0 8px 40px 0 rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.18), inset -1px 0 0 rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.10)',
        }}
      >
        {activeIndex >= 0 && (
          <motion.span
            className="absolute top-1 bottom-1 left-1 rounded-full bg-primary pointer-events-none"
            style={{
              width: `calc(${TAB_UNIT})`,
              transform: indicatorTransform,
              transformOrigin: 'left center',
              willChange: 'transform',
              ...indicatorGlassStyle,
            }}
          />
        )}
        {tabs.map((tab) => (
          <motion.button
            key={tab.path}
            type="button"
            onClick={() => navigate(tab.path)}
            aria-label={tab.label}
            aria-current={isTabActive(tab, location.pathname) ? 'page' : undefined}
            whileTap={{ scale: 0.82 }}
            transition={TAB_PRESS_TRANSITION}
            className={[
              'relative z-10 flex flex-1 min-w-0 max-w-full items-center justify-center rounded-full transition-colors duration-300',
              isTabActive(tab, location.pathname)
                ? 'text-white'
                : 'text-white/40',
            ].join(' ')}
          >
            <tab.icon />
          </motion.button>
        ))}
        {activeIndex >= 0 && (
          <motion.div
            className="absolute top-1 bottom-1 left-1 z-20 rounded-full cursor-grab active:cursor-grabbing"
            style={{
              width: `calc(${TAB_UNIT})`,
              transform: baseTransform,
              transformOrigin: 'left center',
              willChange: 'transform',
              touchAction: 'none',
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />
        )}
      </nav>
    </div>,
    document.body,
  )
}
