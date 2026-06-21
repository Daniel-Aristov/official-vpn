import type { ReactNode } from 'react'

interface AppBackgroundProps {
  children: ReactNode
}

export function AppBackground({ children }: AppBackgroundProps) {
  return (
    <div className="relative min-h-svh bg-black overflow-hidden flex flex-col items-center">
      <div
        className="glow-anim-1 absolute rounded-[50%] pointer-events-none"
        style={{
          background: 'var(--color-glow-blue)',
        }}
      />
      <div
        className="glow-anim-2 absolute rounded-[50%] pointer-events-none"
        style={{
          background: 'var(--color-glow-cyan)',
        }}
      />
      <div
        className="glow-anim-3 absolute rounded-[50%] pointer-events-none"
        style={{
          background: 'var(--color-glow-soft)',
        }}
      />
      <div className="relative z-10 w-full flex flex-col flex-1">
        {children}
      </div>
    </div>
  )
}
