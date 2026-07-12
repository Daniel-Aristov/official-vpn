import { useState } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { BottomTabBar } from '@/components/BottomTabBar'
import { PAGE_TRANSITION, PAGE_VARIANTS } from '@/js/constants/motion'

export type MainViewOutletContext = {
  setHideTabBar: (hide: boolean) => void
}

function FrozenOutlet({ context }: { context: MainViewOutletContext }) {
  const outlet = useOutlet(context)
  const [frozenOutlet] = useState(outlet)
  return frozenOutlet
}

export function MainView() {
  const [hideTabBar, setHideTabBar] = useState(false)
  const location = useLocation()

  return (
    <div className={`flex flex-col flex-1 ${hideTabBar ? '' : 'pb-24'}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          variants={PAGE_VARIANTS}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={PAGE_TRANSITION}
          className="flex flex-col flex-1 min-h-0"
        >
          <FrozenOutlet context={{ setHideTabBar } satisfies MainViewOutletContext} />
        </motion.div>
      </AnimatePresence>
      {!hideTabBar && <BottomTabBar />}
    </div>
  )
}
