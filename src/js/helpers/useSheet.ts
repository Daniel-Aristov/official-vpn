import { useRef, useState } from 'react'
import { SHEET_ANIMATION_MS } from '@/js/constants/ui'

export function useSheet() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<number | null>(null)

  const open = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setMounted(true)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true))
    })
  }

  const close = () => {
    setVisible(false)
    timerRef.current = window.setTimeout(() => {
      setMounted(false)
      timerRef.current = null
    }, SHEET_ANIMATION_MS)
  }

  return { mounted, visible, open, close }
}
