import type { ReactNode } from 'react'

interface AppBackgroundProps {
  children: ReactNode
}

export function AppBackground({ children }: AppBackgroundProps) {
  return (
    <div className="relative min-h-svh bg-black overflow-hidden flex flex-col items-center">
      <div
        className="absolute rounded-[50%] pointer-events-none"
        style={{
          width: '40%',
          height: '69%',
          left: '70%',
          top: '-10%',
          background: 'var(--color-glow-blue)',
          filter: 'blur(75px)',
        }}
      />
      <div
        className="absolute rounded-[50%] pointer-events-none"
        style={{
          width: '40%',
          height: '42%',
          left: '12.8%',
          top: '-10%',
          transform: 'rotate(75deg)',
          background: 'var(--color-glow-cyan)',
          filter: 'blur(85px)',
        }}
      />
      <div
        className="absolute rounded-[50%] pointer-events-none"
        style={{
          width: '40%',
          height: '37%',
          left: '10.6%',
          top: '-24%',
          background: 'var(--color-glow-soft)',
          filter: 'blur(112px)',
        }}
      />
      <div className="relative z-10 w-full flex flex-col flex-1">
        {children}
      </div>
    </div>
  )
}
