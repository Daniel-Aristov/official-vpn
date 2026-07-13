import { Outlet, useLocation } from 'react-router-dom'

export function AuthView() {
  const location = useLocation()

  return (
    <div key={location.pathname} className="page-enter flex flex-col flex-1">
      <Outlet />
    </div>
  )
}
