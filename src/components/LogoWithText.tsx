import { useEffect, useRef } from 'react'

const LOGO_SRC = '/logoWithText.svg'
const LOGO_ALT = 'Official VPN'
const KEEPER_ID = 'logo-with-text-keeper'

let logoElement: HTMLImageElement | null = null

function getLogoElement(): HTMLImageElement {
  if (!logoElement) {
    logoElement = document.createElement('img')
    logoElement.src = LOGO_SRC
    logoElement.alt = LOGO_ALT
    logoElement.decoding = 'async'
    logoElement.fetchPriority = 'high'
  }
  return logoElement
}

function getKeeper(): HTMLElement {
  let keeper = document.getElementById(KEEPER_ID)
  if (!keeper) {
    keeper = document.createElement('div')
    keeper.id = KEEPER_ID
    keeper.className =
      'fixed w-0 h-0 overflow-hidden opacity-0 pointer-events-none'
    keeper.setAttribute('aria-hidden', 'true')
    document.body.appendChild(keeper)
    keeper.appendChild(getLogoElement())
  }
  return keeper
}

if (typeof document !== 'undefined') {
  getKeeper()
}

type LogoWithTextProps = {
  className?: string
}

export function LogoWithText({ className }: LogoWithTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const logo = getLogoElement()
    if (className) {
      logo.className = className
    }

    const container = containerRef.current
    if (!container) return

    container.appendChild(logo)

    return () => {
      getKeeper().appendChild(logo)
    }
  }, [className])

  return <div ref={containerRef} />
}
