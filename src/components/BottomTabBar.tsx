import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import { GearIcon } from '@/components/icons/GearIcon'
import { HeadphonesIcon } from '@/components/icons/HeadphonesIcon'
import { HomeIcon } from '@/components/icons/HomeIcon'
import { PersonIcon } from '@/components/icons/PersonIcon'
import { TAB_INDICATOR_TRANSITION } from '@/js/constants/motion'

const tabs = [
  { path: '/main', label: 'Главная', icon: HomeIcon, end: true },
  { path: '/main/setup', label: 'Настройка', icon: GearIcon, end: false },
  { path: '/main/profile', label: 'Профиль', icon: PersonIcon, end: false },
  {
    path: '/main/support',
    label: 'Поддержка',
    icon: HeadphonesIcon,
    end: false,
  },
] as const

export function BottomTabBar() {
  const location = useLocation()

  const activeIndex = tabs.findIndex(({ path, end }) =>
    end ? location.pathname === path : location.pathname.startsWith(path),
  )

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full px-4 pb-4 z-50">
      <nav
        className="relative flex w-full h-[61px] items-stretch rounded-full p-1 overflow-hidden"
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
            className="absolute top-1 bottom-1 left-1 rounded-full bg-primary"
            style={{ width: `calc((100% - 8px) / ${tabs.length})` }}
            animate={{ x: `${activeIndex * 100}%` }}
            transition={TAB_INDICATOR_TRANSITION}
          />
        )}
        {tabs.map(({ path, label, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            aria-label={label}
            className={({ isActive }) =>
              [
                'relative flex flex-1 min-w-0 max-w-full items-center justify-center rounded-full transition-colors duration-300',
                isActive ? 'text-white' : 'text-white/40',
              ].join(' ')
            }
          >
            <Icon />
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
