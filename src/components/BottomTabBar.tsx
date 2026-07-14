import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
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
  boxShadow: 'var(--shadow-glass-indicator)',
} as const

const TAB_UNIT = `((100% - 8px) / ${tabs.length})`

const TAB_INDICATOR_EASE = 'cubic-bezier(0.45, 0, 0.55, 1)'
const TAB_INDICATOR_TRANSITION_CSS = `transform 170ms ${TAB_INDICATOR_EASE}`

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

// Откладываем навигацию на кадр после отрисовки, чтобы смещение
// индикатора рисовалось мгновенно и не блокировалось загрузкой страницы.
function deferNavigate(fn: () => void) {
  requestAnimationFrame(() => requestAnimationFrame(fn))
}

export function BottomTabBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const navRef = useRef<HTMLElement>(null)
  const pillRef = useRef<HTMLSpanElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const activeIndex = tabs.findIndex((tab) => isTabActive(tab, location.pathname))

  const leadingRef = useRef(Math.max(activeIndex, 0))
  const trailingRef = useRef(Math.max(activeIndex, 0) + 1)
  const dragScaleRef = useRef(1)
  const prevIndexRef = useRef(activeIndex)

  const applyTransform = (leading: number, trailing: number, dragScale: number) => {
    const scaleX = trailing - leading
    const baseTransform = `translateX(calc(${leading} * 100%)) scaleX(${scaleX})`
    if (handleRef.current) handleRef.current.style.transform = baseTransform
    if (pillRef.current) {
      pillRef.current.style.transform = `${baseTransform} scaleY(${dragScale})`
    }
  }

  const setTransitionEnabled = (enabled: boolean) => {
    const value = enabled ? TAB_INDICATOR_TRANSITION_CSS : 'none'
    if (handleRef.current) handleRef.current.style.transition = value
    if (pillRef.current) pillRef.current.style.transition = value
  }

  useLayoutEffect(() => {
    applyTransform(leadingRef.current, trailingRef.current, dragScaleRef.current)
    setTransitionEnabled(true)
  }, [])

  useLayoutEffect(() => {
    const prevIndex = prevIndexRef.current
    prevIndexRef.current = activeIndex
    if (activeIndex < 0 || prevIndex === activeIndex || isDragging) return

    leadingRef.current = activeIndex
    trailingRef.current = activeIndex + 1
    setTransitionEnabled(true)
    applyTransform(leadingRef.current, trailingRef.current, dragScaleRef.current)
  }, [activeIndex, isDragging])

  useLayoutEffect(() => {
    dragScaleRef.current = isDragging ? 1.08 : 1
    setTransitionEnabled(true)
    applyTransform(leadingRef.current, trailingRef.current, dragScaleRef.current)
  }, [isDragging])

  const moveIndicatorTo = (index: number) => {
    leadingRef.current = index
    trailingRef.current = index + 1
    setTransitionEnabled(true)
    applyTransform(leadingRef.current, trailingRef.current, dragScaleRef.current)
  }

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
    leadingRef.current = leading
    trailingRef.current = leading + 1
    setTransitionEnabled(false)
    applyTransform(leadingRef.current, trailingRef.current, dragScaleRef.current)
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    setIsDragging(false)
    const nearestIndex = clamp(
      Math.round(getUnitFromPointer(event.clientX) - 0.5),
      0,
      tabs.length - 1,
    )
    deferNavigate(() => navigate(tabs[nearestIndex].path))
    if (nearestIndex !== activeIndex) return
    leadingRef.current = activeIndex
    trailingRef.current = activeIndex + 1
    setTransitionEnabled(true)
    applyTransform(leadingRef.current, trailingRef.current, dragScaleRef.current)
  }

  return createPortal(
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(16px,env(safe-area-inset-bottom))] pointer-events-none">
      <nav
        ref={navRef}
        className="relative mx-auto flex h-[61px] w-full max-w-[768px] items-stretch overflow-hidden rounded-full p-1 pointer-events-auto"
        style={{
          background: 'var(--color-white-8)',
          backdropFilter: 'blur(7px)',
          WebkitBackdropFilter: 'blur(7px)',
          boxShadow: 'var(--shadow-tabbar)',
          border: '1px solid var(--color-white-10)',
        }}
      >
        {activeIndex >= 0 && (
          <span
            ref={pillRef}
            className="absolute top-1 bottom-1 left-1 rounded-full bg-primary pointer-events-none will-change-transform"
            style={{
              width: `calc(${TAB_UNIT})`,
              transformOrigin: 'left center',
              ...indicatorGlassStyle,
            }}
          />
        )}
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.path}
            type="button"
            onClick={() => {
              if (index !== activeIndex && !isDragging) moveIndicatorTo(index)
              deferNavigate(() => navigate(tab.path))
            }}
            aria-label={tab.label}
            aria-current={isTabActive(tab, location.pathname) ? 'page' : undefined}
            whileTap={{ scale: 0.82 }}
            transition={TAB_PRESS_TRANSITION}
            className={[
              'relative z-10 flex flex-1 min-w-0 max-w-full items-center justify-center rounded-full transition-colors duration-200',
              isTabActive(tab, location.pathname)
                ? 'text-white'
                : 'text-white-40',
            ].join(' ')}
          >
            <tab.icon />
          </motion.button>
        ))}
        {activeIndex >= 0 && (
          <div
            ref={handleRef}
            className="absolute top-1 bottom-1 left-1 z-20 rounded-full cursor-grab active:cursor-grabbing will-change-transform"
            style={{
              width: `calc(${TAB_UNIT})`,
              transformOrigin: 'left center',
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
