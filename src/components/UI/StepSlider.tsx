import { useEffect, useRef } from 'react'

const THUMB_SIZE = 28
const DRAG_THRESHOLD = 3

type StepSliderProps = {
  options: number[]
  value: number
  onChange: (index: number) => void
  getStepAriaLabel?: (option: number) => string
  className?: string
}

export function StepSlider({
  options,
  value,
  onChange,
  getStepAriaLabel,
  className,
}: StepSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const currentIndexRef = useRef(value)
  const pointerStartXRef = useRef(0)
  const hasDraggedRef = useRef(false)
  const thumbOffset = THUMB_SIZE / 2
  const lastIndex = options.length - 1

  useEffect(() => {
    currentIndexRef.current = value
  }, [value])

  const getIndexFromPointer = (clientX: number): number => {
    if (!trackRef.current) return currentIndexRef.current
    const { left, width } = trackRef.current.getBoundingClientRect()
    const x = Math.min(
      Math.max(clientX - left - thumbOffset, 0),
      width - THUMB_SIZE,
    )
    return Math.round((x / (width - THUMB_SIZE)) * lastIndex)
  }

  const setIndex = (index: number) => {
    if (index === currentIndexRef.current) return
    currentIndexRef.current = index
    onChange(index)
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    pointerStartXRef.current = e.clientX
    hasDraggedRef.current = false
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons === 0) return
    if (
      !hasDraggedRef.current &&
      Math.abs(e.clientX - pointerStartXRef.current) >= DRAG_THRESHOLD
    ) {
      hasDraggedRef.current = true
    }
    if (hasDraggedRef.current) {
      setIndex(getIndexFromPointer(e.clientX))
    }
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIndex(getIndexFromPointer(e.clientX))
    e.preventDefault()
    hasDraggedRef.current = false
  }

  return (
    <div
      ref={trackRef}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={lastIndex}
      aria-valuenow={value}
      aria-valuetext={
        getStepAriaLabel?.(options[value]) ?? String(options[value])
      }
      className={[
        'relative h-[28px] touch-none select-none cursor-pointer overflow-hidden',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div className="absolute inset-0 bg-white/10 rounded-full" />
      <div
        className="absolute left-0 top-0 bottom-0 bg-primary rounded-full transition-all duration-200"
        style={{
          width: (() => {
            const p = value / lastIndex
            return `calc(${p * 100}% + ${THUMB_SIZE * (1 - p)}px)`
          })(),
        }}
      />
      {options.map((option, idx) => {
        const p = idx / lastIndex
        const isSelected = idx === value
        return (
          <div
            key={option}
            aria-hidden
            style={{
              left: `calc(${p * 100}% + ${thumbOffset - p * THUMB_SIZE}px)`,
            }}
            className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-[44px] h-[44px] flex items-center justify-center z-10"
          >
            <div
              className={`transition-all duration-200 rounded-full pointer-events-none ${
                isSelected
                  ? 'w-[28px] h-[28px] bg-[#24326A] border-3 border-primary'
                  : 'w-3 h-3 bg-white/30'
              }`}
            />
          </div>
        )
      })}
    </div>
  )
}
