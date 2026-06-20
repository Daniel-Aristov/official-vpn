import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { BottomTabBar } from '@/components/BottomTabBar'

export type MainViewOutletContext = {
  setHideTabBar: (hide: boolean) => void
}

export function MainView() {
  const [hideTabBar, setHideTabBar] = useState(false)

  return (
    <div className={`flex flex-col flex-1 ${hideTabBar ? '' : 'pb-24'}`}>
      <Outlet context={{ setHideTabBar } satisfies MainViewOutletContext} />
      {!hideTabBar && <BottomTabBar />}
    </div>
  )
}
