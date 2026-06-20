import { Outlet } from 'react-router-dom'
import { BottomTabBar } from './BottomTabBar'

export function MainLayout() {
  return (
    <div className="flex flex-col flex-1 pb-24">
      <Outlet />
      <BottomTabBar />
    </div>
  )
}
