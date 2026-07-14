import { useMemo, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { TelegramLinkSheet } from '@/components/TelegramLinkSheet'
import { InstallSheet } from '@/components/InstallSheet'
import { PrimaryButton } from '@/components/UI/PrimaryButton'
import {
  SUBSCRIPTION_DEEP_LINK,
  type InstallPlatform,
} from '@/js/constants/urls'
import { SHEET_EASE, TAB_PRESS_TRANSITION } from '@/js/constants/motion'
import {
  detectCurrentDevice,
  INSTALL_PLATFORMS,
  SETUP_PLATFORM_LABELS,
} from '@/js/helpers/platform'
import { useSheet } from '@/js/helpers/useSheet'
import { useSubscription } from '@/store/subscription/useSubscription'
import { useUser } from '@/store/user/useUser'
import { useDownload } from '@/store/download/useDownload'
import { CopyButton } from '@/components/UI/CopyButton'
import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { ChevronLeftIcon } from '@/components/icons/ChevronLeftIcon'
import { CheckmarkIcon } from '@/components/icons/CheckmarkIcon'
import { DownloadIcon } from '@/components/icons/DownloadIcon'
import { GearIcon } from '@/components/icons/GearIcon'
import { InfoCircleIcon } from '@/components/icons/InfoCircleIcon'
import { LinkIcon } from '@/components/icons/LinkIcon'
import { PlusCircleIcon } from '@/components/icons/PlusCircleIcon'

const TOTAL_STEPS = 3
const CIRCLE_SIZE = 240
const STROKE_WIDTH = 7
const CIRCLE_CENTER = CIRCLE_SIZE / 2
const CIRCLE_R = CIRCLE_CENTER - STROKE_WIDTH / 2

export function SetupPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const openPlatformSelect = Boolean(
    (location.state as { openPlatformSelect?: boolean } | null)
      ?.openPlatformSelect,
  )
  const [step, setStep] = useState(1)
  const [platform, setPlatform] = useState<InstallPlatform>(() =>
    detectCurrentDevice(),
  )
  const [showPlatforms, setShowPlatforms] = useState(openPlatformSelect)
  const [started, setStarted] = useState(false)
  const installSheet = useSheet()
  const telegramSheet = useSheet()
  const { subscription } = useSubscription()
  const { user } = useUser()
  const { downloadLinks } = useDownload()
  const isTelegramLinked = user?.isTelegramLinked ?? false
  const vpnKey = subscription?.vpnKey ?? ''
  const currentDevice = useMemo(() => detectCurrentDevice(), [])

  useEffect(() => {
    if (!openPlatformSelect) return
    navigate(location.pathname, { replace: true, state: null })
  }, [openPlatformSelect, location.pathname, navigate])

  const goToMain = () => {
    telegramSheet.close()
    navigate('/main')
  }

  const exitSetup = () => {
    if (isTelegramLinked) {
      navigate('/main')
      return
    }
    telegramSheet.open()
  }

  const handleCompleteSetup = () => {
    exitSetup()
  }

  const handleStartSetup = () => {
    setShowPlatforms(false)
    setStep(1)
    setStarted(true)
  }

  const handleBack = () => {
    setShowPlatforms(false)
    if (step > 1) {
      setStep((s) => s - 1)
      return
    }
    setStarted(false)
  }

  const handleNextStep = () => {
    setShowPlatforms(false)
    setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  }

  const handlePlatformChange = (p: InstallPlatform) => {
    setPlatform(p)
    setShowPlatforms(false)
    setStarted(false)
    setStep(1)
  }

  const isDoneStep = started && step === TOTAL_STEPS
  const progressRatio = started ? step / TOTAL_STEPS : 0
  const label = SETUP_PLATFORM_LABELS[platform]

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
              className="flex items-center gap-1 bg-white-10 backdrop-blur-md border border-white-20 text-white text-[16px] font-semibold pl-5 pr-4 py-1 rounded-full cursor-pointer"
            >
              {label}
              <ChevronDownIcon
                className={`transition-transform duration-200 ${showPlatforms ? 'rotate-180' : ''}`}
              />
            </button>
            <AnimatePresence>
              {showPlatforms && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -8 }}
                  transition={{ duration: 0.18, ease: SHEET_EASE }}
                  style={{ transformOrigin: 'top right' }}
                  className="absolute right-0 top-full mt-2 bg-white-10 backdrop-blur-md border border-white-20 rounded-2xl z-10 min-w-[140px] py-1"
                >
                  {INSTALL_PLATFORMS.filter((p) => p !== platform).map((p) => (
                    <motion.button
                      key={p}
                      type="button"
                      onClick={() => handlePlatformChange(p)}
                      whileTap={{ scale: 0.95 }}
                      transition={TAB_PRESS_TRANSITION}
                      className="w-full px-4 py-1.5 text-left text-white text-[16px] font-semibold cursor-pointer"
                    >
                      {SETUP_PLATFORM_LABELS[p]}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 mt-4">
          <h1 className="text-center text-white text-[28px] font-bold tracking-[-0.5px]">
            {!started
              ? `Настройка на ${label}`
              : step === TOTAL_STEPS
                ? 'Готово'
                : step === 2
                  ? 'Подписка'
                  : `Установка на ${label}`}
          </h1>
          <p className="text-center text-white-80 text-[16px] leading-[130%] min-h-[42px] flex items-center justify-center">
            {!started ? (
              <>
                Быстрая настройка VPN
                <br />
                за пару минут и за 3 шага
              </>
            ) : step === TOTAL_STEPS ? (
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

        <div className="flex justify-center py-8">
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
                stroke="var(--color-stroke-muted)"
                strokeWidth={STROKE_WIDTH}
              />
              <motion.circle
                cx={CIRCLE_CENTER}
                cy={CIRCLE_CENTER}
                r={CIRCLE_R}
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth={STROKE_WIDTH}
                strokeLinecap={progressRatio > 0 ? 'round' : 'butt'}
                transform={`rotate(-90 ${CIRCLE_CENTER} ${CIRCLE_CENTER})`}
                initial={false}
                animate={{ pathLength: progressRatio }}
                transition={{ duration: 0.5, ease: SHEET_EASE }}
              />
            </svg>
            <div className="flex flex-col items-center z-10">
              {started ? (
                isDoneStep ? (
                  <motion.span
                    initial={{ scale: 0, rotate: -45, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 420,
                      damping: 22,
                      mass: 0.7,
                    }}
                  >
                    <CheckmarkIcon className="w-12 h-12" fill="var(--color-white)" />
                  </motion.span>
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
                    <span className="text-white-50 text-[14px] mt-1 font-medium">
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

        <div className="flex flex-col gap-3 mb-4 mt-auto">
          <div
            className={`flex flex-col gap-3 ${started ? 'min-h-[124px] justify-end' : ''}`}
          >
            {!started && (
              <div className="flex items-center gap-3 bg-white-10 border border-white-10 px-4 py-3 rounded-[24px]">
                <InfoCircleIcon className="w-6 h-6 text-white-60 shrink-0" />
                <span className="text-white-80 text-[16px] leading-[120%]">
                  Выберите устройство перед началом
                </span>
              </div>
            )}
            {!started ? (
              <PrimaryButton size="large" onClick={handleStartSetup}>
                Начать настройку на этом устройстве
              </PrimaryButton>
            ) : step === TOTAL_STEPS ? (
              <PrimaryButton size="large" onClick={handleCompleteSetup}>
                Завершить настройку
              </PrimaryButton>
            ) : step === 2 ? (
              <>
                <motion.a
                  href={SUBSCRIPTION_DEEP_LINK}
                  whileTap={{ scale: 0.97 }}
                  transition={TAB_PRESS_TRANSITION}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold text-[16px] py-[16px] rounded-2xl cursor-pointer no-underline"
                >
                  <PlusCircleIcon className="w-6 h-6" />
                  Добавить подписку
                </motion.a>
                <motion.button
                  type="button"
                  onClick={handleNextStep}
                  whileTap={{ scale: 0.97 }}
                  transition={TAB_PRESS_TRANSITION}
                  className="w-full flex items-center justify-center gap-3 text-white font-semibold text-[16px] py-[16px] rounded-2xl bg-surface-elevated cursor-pointer"
                >
                  Следующий шаг
                  <ArrowRightIcon />
                </motion.button>
              </>
            ) : (
              <>
                <PrimaryButton size="large" onClick={installSheet.open}>
                  <DownloadIcon />
                  Установить приложение
                </PrimaryButton>
                <motion.button
                  type="button"
                  onClick={handleNextStep}
                  whileTap={{ scale: 0.97 }}
                  transition={TAB_PRESS_TRANSITION}
                  className="w-full flex items-center justify-center gap-3 text-white font-semibold text-[16px] py-[16px] rounded-2xl bg-surface-elevated cursor-pointer"
                >
                  Следующий шаг
                  <ArrowRightIcon />
                </motion.button>
              </>
            )}
          </div>

          {!started && (
            <div className="flex items-center gap-3 bg-secondary border border-white-10 px-4 py-2 rounded-[16px]">
              <LinkIcon className="w-6 h-6 text-white shrink-0" />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-white-80 text-[16px] font-semibold leading-[120%]">
                  Ссылка на VPN
                </span>
                <span className="text-white text-[16px] leading-[120%] truncate">
                  {vpnKey}
                </span>
              </div>
              <CopyButton
                text={vpnKey}
                iconClassName="w-5 h-5"
                className="bg-primary text-white p-2 rounded-full cursor-pointer shrink-0 w-[46px] h-[46px] flex items-center justify-center"
                aria-label="Скопировать ссылку"
              />
            </div>
          )}
        </div>
      </main>
      <InstallSheet
        isOpen={installSheet.isOpen}
        platform={platform}
        currentDevice={currentDevice}
        downloadLinks={downloadLinks}
        onClose={installSheet.close}
        onInstallProceed={handleNextStep}
      />
      <TelegramLinkSheet
        isOpen={telegramSheet.isOpen}
        onClose={telegramSheet.close}
        onLink={goToMain}
        onLater={goToMain}
      />
    </>
  )
}
