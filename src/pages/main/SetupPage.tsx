import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRightIcon } from '../../components/icons/ArrowRightIcon'
import { ChevronDownIcon } from '../../components/icons/ChevronDownIcon'
import { ChevronLeftIcon } from '../../components/icons/ChevronLeftIcon'
import { DownloadIcon } from '../../components/icons/DownloadIcon'

const TOTAL_STEPS = 3
const CIRCLE_SIZE = 240
const STROKE_WIDTH = 7
const CIRCLE_CENTER = CIRCLE_SIZE / 2
const CIRCLE_R = CIRCLE_CENTER - STROKE_WIDTH / 2
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_R

type Platform = 'IOS' | 'Android' | 'Windows'

const platforms: Platform[] = ['IOS', 'Android', 'Windows']

export function SetupPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [platform, setPlatform] = useState<Platform>('IOS')
  const [showPlatforms, setShowPlatforms] = useState(false)

  const progress = (step / TOTAL_STEPS) * CIRCUMFERENCE
  const gap = CIRCUMFERENCE - progress

  return (
    <main className="flex flex-col flex-1 px-4 pt-4">
      <div className="flex items-center justify-between py-2">
        <button
          type="button"
          onClick={() => navigate('/main')}
          className="w-9 h-9 flex items-center justify-center text-white cursor-pointer"
        >
          <ChevronLeftIcon />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowPlatforms((v) => !v)}
            className="flex items-center gap-1 bg-[#FFFFFF]/10 border border-[#FFFFFF]/20 text-white text-[16px] font-semibold px-4 py-1 rounded-full cursor-pointer"
          >
            {platform}
            <ChevronDownIcon />
          </button>
          {showPlatforms && (
            <div className="absolute right-0 top-full mt-1 bg-[#2C2C2E] rounded-2xl overflow-hidden z-10 min-w-[120px]">
              {platforms.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setPlatform(p)
                    setShowPlatforms(false)
                  }}
                  className={`w-full px-4 py-3 text-left text-[14px] font-medium cursor-pointer ${p === platform ? 'text-white' : 'text-white/60'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 mt-4">
        <h1 className="text-center text-white text-[28px] font-bold tracking-[-0.5px]">
          Установка на {platform}
        </h1>
        <p className="text-center text-white/80 text-[16px] leading-[130%]">
          Установите приложение HAPP
          <br />и вернитесь к этому экрану
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div
          className="relative flex items-center justify-center"
          style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
        >
          <svg
            width={CIRCLE_SIZE}
            height={CIRCLE_SIZE}
            viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`}
            fill="none"
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            <circle
              cx={CIRCLE_CENTER}
              cy={CIRCLE_CENTER}
              r={CIRCLE_R}
              fill="none"
              stroke="#3A3A3C"
              strokeWidth={STROKE_WIDTH}
            />
            <circle
              cx={CIRCLE_CENTER}
              cy={CIRCLE_CENTER}
              r={CIRCLE_R}
              fill="none"
              stroke="#255de0"
              strokeWidth={STROKE_WIDTH}
              strokeDasharray={`${progress} ${gap}`}
              strokeLinecap="round"
              transform={`rotate(-90 ${CIRCLE_CENTER} ${CIRCLE_CENTER})`}
            />
          </svg>
          <div className="flex flex-col items-center z-10">
            <span className="text-white">
              <DownloadIcon className="w-12 h-12" />
            </span>
            <span className="text-white text-[24px] font-semibold leading-none mt-2">
              {step} шаг
            </span>
            <span className="text-white/50 text-[14px] mt-1 font-medium">
              из {TOTAL_STEPS}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-4">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold text-[16px] py-[16px] rounded-2xl cursor-pointer"
        >
          <DownloadIcon />
          Установить приложение
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(s + 1, TOTAL_STEPS))}
          className="w-full flex items-center justify-center gap-3 text-white font-semibold text-[16px] py-[16px] rounded-2xl bg-[#2C2C2E] cursor-pointer"
        >
          Следующий шаг
          <ArrowRightIcon />
        </button>
      </div>
    </main>
  )
}
