import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { BottomTabBar } from '@/components/BottomTabBar'

export type MainViewOutletContext = {
  setHideTabBar: (hide: boolean) => void
}

export function MainView() {
  const [hideTabBar, setHideTabBar] = useState(false)
  const location = useLocation()

  return (
    <div className={`flex flex-col flex-1 ${hideTabBar ? '' : 'pb-24'}`}>
      <div key={location.pathname} className="page-enter flex flex-col flex-1 min-h-0">
        <Outlet context={{ setHideTabBar } satisfies MainViewOutletContext} />
      </div>
      {!hideTabBar && <BottomTabBar />}
    </div>
  )
}
