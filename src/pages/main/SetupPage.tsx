import { useRef, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AddSubscriptionAlert } from '@/components/AddSubscriptionAlert'
import { TelegramLinkSheet } from '@/components/TelegramLinkSheet'
import { InstallSheet } from '@/components/InstallSheet'
import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { ChevronLeftIcon } from '@/components/icons/ChevronLeftIcon'
import { CheckmarkIcon } from '@/components/icons/CheckmarkIcon'
import { CopyIcon } from '@/components/icons/CopyIcon'
import { DownloadIcon } from '@/components/icons/DownloadIcon'
import { GearIcon } from '@/components/icons/GearIcon'
import { InfoCircleIcon } from '@/components/icons/InfoCircleIcon'
import { LinkIcon } from '@/components/icons/LinkIcon'
import { PlusCircleIcon } from '@/components/icons/PlusCircleIcon'

const SHEET_ANIMATION_MS = 300

const TOTAL_STEPS = 3
const CIRCLE_SIZE = 240
const STROKE_WIDTH = 7
const CIRCLE_CENTER = CIRCLE_SIZE / 2
const CIRCLE_R = CIRCLE_CENTER - STROKE_WIDTH / 2
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_R

const VPN_LINK = 'https://a.my-keyboards.shop/configure-happ-official-vpn'
const SUBSCRIPTION_DEEP_LINK =
  'happ://add/https://official.vpn/s/sfRasfjgaAd412s41#OfficialVPN'

type Platform = 'IOS' | 'Android' | 'Windows' | 'Macbook' | 'Android TV'

function detectCurrentDevice(): Platform {
  const ua = navigator.userAgent
  if (/iPhone|iPad|iPod/.test(ua)) return 'IOS'
  if (/Android/.test(ua)) return 'Android'
  if (/Win/.test(ua)) return 'Windows'
  if (/Mac/.test(ua)) return 'Macbook'
  return 'Windows'
}

const platforms: Platform[] = [
  'IOS',
  'Android',
  'Windows',
  'Macbook',
  'Android TV',
]

const platformLabels: Record<Platform, string> = {
  IOS: 'IOS',
  Android: 'Android',
  Windows: 'Windows',
  Macbook: 'macOS',
  'Android TV': 'Android TV',
}

export function SetupPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [platform, setPlatform] = useState<Platform>('IOS')
  const [showPlatforms, setShowPlatforms] = useState(false)
  const [started, setStarted] = useState(false)
  const [isSheetMounted, setIsSheetMounted] = useState(false)
  const [isSheetVisible, setIsSheetVisible] = useState(false)
  const [isSubscriptionAlertOpen, setIsSubscriptionAlertOpen] = useState(false)
  const [isTelegramSheetMounted, setIsTelegramSheetMounted] = useState(false)
  const [isTelegramSheetVisible, setIsTelegramSheetVisible] = useState(false)
  const sheetCloseTimerRef = useRef<number | null>(null)
  const telegramSheetCloseTimerRef = useRef<number | null>(null)
  const currentDevice = useMemo(() => detectCurrentDevice(), [])

  const openInstallSheet = () => {
    if (sheetCloseTimerRef.current !== null) {
      window.clearTimeout(sheetCloseTimerRef.current)
      sheetCloseTimerRef.current = null
    }
    setIsSheetMounted(true)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsSheetVisible(true))
    })
  }

  const closeInstallSheet = () => {
    setIsSheetVisible(false)
    sheetCloseTimerRef.current = window.setTimeout(() => {
      setIsSheetMounted(false)
      sheetCloseTimerRef.current = null
    }, SHEET_ANIMATION_MS)
  }

  const openTelegramSheet = () => {
    if (telegramSheetCloseTimerRef.current !== null) {
      window.clearTimeout(telegramSheetCloseTimerRef.current)
      telegramSheetCloseTimerRef.current = null
    }
    setIsTelegramSheetMounted(true)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsTelegramSheetVisible(true))
    })
  }

  const closeTelegramSheet = () => {
    setIsTelegramSheetVisible(false)
    telegramSheetCloseTimerRef.current = window.setTimeout(() => {
      setIsTelegramSheetMounted(false)
      telegramSheetCloseTimerRef.current = null
    }, SHEET_ANIMATION_MS)
  }

  const goToMain = () => {
    closeTelegramSheet()
    navigate('/main')
  }

  const proceedToInstall = () => {
    setStep(2)
  }

  const confirmAddSubscription = () => {
    window.open(SUBSCRIPTION_DEEP_LINK, '_blank', 'noopener,noreferrer')
    setIsSubscriptionAlertOpen(false)
  }

  const handleStartSetup = () => {
    setStep(1)
    setStarted(true)
  }

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => s - 1)
      return
    }
    setStarted(false)
  }

  const handlePlatformChange = (p: Platform) => {
    setPlatform(p)
    setShowPlatforms(false)
    setStarted(false)
    setStep(1)
  }

  const progress = (step / TOTAL_STEPS) * CIRCUMFERENCE
  const gap = CIRCUMFERENCE - progress
  const label = platformLabels[platform]

  return (
    <>
      <main className="flex flex-col flex-1 px-4 pt-4 max-w-[768px] mx-auto w-full">
        <div className="flex items-center justify-between py-2">
          {started ? (
            <button
              type="button"
              onClick={handleBack}
              className="w-9 h-9 flex items-center justify-center text-white cursor-pointer"
            >
              <ChevronLeftIcon />
            </button>
          ) : (
            <div className="w-9 h-9" />
          )}

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPlatforms((v) => !v)}
              className="flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[16px] font-semibold px-4 py-1 rounded-full cursor-pointer"
            >
              {label}
              <ChevronDownIcon
                className={`transition-transform duration-200 ${showPlatforms ? 'rotate-180' : ''}`}
              />
            </button>
            {showPlatforms && (
              <div className="absolute right-0 top-full mt-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl z-10 min-w-[140px] py-1">
                {platforms
                  .filter((p) => p !== platform)
                  .map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handlePlatformChange(p)}
                      className="w-full px-4 py-1.5 text-left text-white text-[16px] font-semibold cursor-pointer"
                    >
                      {platformLabels[p]}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 mt-4">
          <h1 className="text-center text-white text-[28px] font-bold tracking-[-0.5px]">
            {!started
              ? `Настройка на ${label}`
              : step === 3
                ? 'Готово'
                : step === 2
                  ? 'Подписка'
                  : `Установка на ${label}`}
          </h1>
          <p className="text-center text-white/80 text-[16px] leading-[130%]">
            {!started ? (
              <>
                Быстрая настройка VPN
                <br />
                за пару минут и за 3 шага
              </>
            ) : step === 3 ? (
              'Нажмите на круглую кнопку включения VPN в приложении Happ'
            ) : step === 2 ? (
              'Добавьте подписку в приложение Happ с помощью кнопки ниже'
            ) : (
              <>
                Установите приложение HAPP
                <br />и вернитесь к этому экрану
              </>
            )}
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
              {started && (
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
              )}
            </svg>
            <div className="flex flex-col items-center z-10">
              {started ? (
                step === 3 ? (
                  <CheckmarkIcon className="w-12 h-12" fill="white" />
                ) : (
                  <>
                    <span className="text-white">
                      {step === 2 ? (
                        <PlusCircleIcon className="w-12 h-12" />
                      ) : (
                        <DownloadIcon className="w-12 h-12" />
                      )}
                    </span>
                    <span className="text-white text-[24px] font-semibold leading-none mt-2">
                      {step} шаг
                    </span>
                    <span className="text-white/50 text-[14px] mt-1 font-medium">
                      из {TOTAL_STEPS}
                    </span>
                  </>
                )
              ) : (
                <>
                  <span className="text-white">
                    <GearIcon className="w-12 h-12" />
                  </span>
                  <span className="text-white text-[20px] font-semibold leading-snug mt-2 text-center">
                    {platform === 'IOS' ? (
                      <>
                        3 шага и 3 дня
                        <br />
                        бесплатно
                      </>
                    ) : (
                      <>
                        Установка
                        <br />
                        за 3 шага
                      </>
                    )}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 mb-4">
          {!started && platform === 'IOS' && (
            <div className="flex items-center gap-3 bg-white/10 border border-white/10 px-4 py-3 rounded-[24px]">
              <InfoCircleIcon className="w-6 h-6 text-white/60 shrink-0" />
              <span className="text-white/80 text-[16px] leading-[120%]">
                Выберите устройство перед началом
              </span>
            </div>
          )}

          {!started ? (
            <button
              type="button"
              onClick={handleStartSetup}
              className="w-full flex items-center justify-center bg-primary text-white font-semibold text-[16px] py-[16px] rounded-2xl cursor-pointer"
            >
              Начать настройку на этом устройстве
            </button>
          ) : step === 3 ? (
            <button
              type="button"
              onClick={openTelegramSheet}
              className="w-full flex items-center justify-center bg-primary text-white font-semibold text-[16px] py-[16px] rounded-2xl cursor-pointer"
            >
              Завершить настройку
            </button>
          ) : step === 2 ? (
            <>
              <button
                type="button"
                onClick={() => setIsSubscriptionAlertOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold text-[16px] py-[16px] rounded-2xl cursor-pointer"
              >
                <PlusCircleIcon className="w-6 h-6" />
                Добавить подписку
              </button>
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(s + 1, TOTAL_STEPS))}
                className="w-full flex items-center justify-center gap-3 text-white font-semibold text-[16px] py-[16px] rounded-2xl bg-[#2C2C2E] cursor-pointer"
              >
                Следующий шаг
                <ArrowRightIcon />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={openInstallSheet}
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
            </>
          )}

          {!started && platform === 'Macbook' && (
            <div className="flex items-center gap-3 bg-secondary border border-white/10 px-4 py-2 rounded-[16px]">
              <LinkIcon className="w-6 h-6 text-white shrink-0" />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-white/80 text-[16px] font-semibold leading-[120%]">
                  Ссылка на VPN
                </span>
                <span className="text-white text-[16px] leading-[120%] truncate">
                  {VPN_LINK}
                </span>
              </div>
              <button
                type="button"
                className="bg-primary text-white p-2 rounded-full cursor-pointer shrink-0 w-[46px] h-[46px] flex items-center justify-center"
              >
                <CopyIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </main>
      <InstallSheet
        isMounted={isSheetMounted}
        isVisible={isSheetVisible}
        platform={platform}
        currentDevice={currentDevice}
        onClose={closeInstallSheet}
        onProceed={proceedToInstall}
      />
      <AddSubscriptionAlert
        isOpen={isSubscriptionAlertOpen}
        deepLink={SUBSCRIPTION_DEEP_LINK}
        onClose={() => setIsSubscriptionAlertOpen(false)}
        onConfirm={confirmAddSubscription}
      />
      <TelegramLinkSheet
        isMounted={isTelegramSheetMounted}
        isVisible={isTelegramSheetVisible}
        onClose={closeTelegramSheet}
        onLink={goToMain}
        onLater={goToMain}
      />
    </>
  )
}
