import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import type { MainViewOutletContext } from '@/views/MainView'
import { DownloadIcon } from '@/components/icons/DownloadIcon'
import { GlobeIcon } from '@/components/icons/GlobeIcon'
import { SmartphoneIcon } from '@/components/icons/SmartphoneIcon'
import { ChevronRightIcon } from '@/components/icons/ChevronRightIcon'
import { NotificationBanner } from '@/components/NotificationBanner'

type DemoVariant = 'warning' | 'success' | 'blocked' | null

const demoVariants: DemoVariant[] = ['warning', 'success', 'blocked', null]

const notificationData = {
  warning: {
    title: 'Подписка закончится через 7 дней',
    message: 'Не забудьте продлить подписку, иначе вы потеряете доступ к VPN',
  },
  success: {
    title: 'Подписка успешно добавлена!',
    message: 'Период: до 27 май 2026',
  },
  blocked: {
    title: 'Вы заблокированы!',
    message: 'Вам необходимо обратиться в поддержку!',
  },
}

export function MainPage() {
  const navigate = useNavigate()
  const { setHideTabBar } = useOutletContext<MainViewOutletContext>()
  const [demoIndex, setDemoIndex] = useState(0)
  const variant = demoVariants[demoIndex]

  const cycleVariant = () => setDemoIndex((i) => (i + 1) % demoVariants.length)

  useEffect(() => {
    setHideTabBar(variant === 'blocked')
    return () => setHideTabBar(false)
  }, [variant, setHideTabBar])

  return (
    <main className="flex flex-col flex-1 px-4 pt-4 max-w-[768px] mx-auto w-full">
      {variant && (
        <NotificationBanner
          variant={variant}
          title={notificationData[variant].title}
          message={notificationData[variant].message}
          onClose={cycleVariant}
          onAction={() => navigate('/main/support')}
        />
      )}

      <div
        className={`flex flex-col flex-1 ${variant === 'blocked' ? 'justify-center' : 'justify-end'}`}
      >
        <div
          className={`flex items-center justify-center ${variant === 'blocked' ? '' : 'mb-[120px]'}`}
        >
          <button
            type="button"
            onClick={cycleVariant}
            className="cursor-pointer"
          >
            <img
              src="/logoWithText.svg"
              alt="Official VPN"
              className="w-full h-auto max-w-[249px]"
            />
          </button>
        </div>

        {variant !== 'blocked' && (
          <div className="bg-[#FFFFFF]/10 border border-[#FFFFFF]/10 rounded-[24px] p-4 flex flex-col overflow-hidden">
            <div className="flex items-start justify-between mb-[16px]">
              <div className="flex flex-col">
                <p className="text-white font-bold text-[18px]">
                  до 27 мая 2026
                </p>
                <p className="text-[#139D76] text-[16px] font-medium">online</p>
              </div>
              <span className="text-white/50 text-[12px] bg-white/10 font-medium border border-white/20 px-3 py-2 rounded-full">
                бесплатный период
              </span>
            </div>

            <button
              type="button"
              className="flex items-center justify-between bg-primary p-4 rounded-[16px] cursor-pointer"
            >
              <div className="flex items-center gap-2 text-white">
                <GlobeIcon />
                <span className="font-semibold text-[16px]">
                  Продлить подписку
                </span>
              </div>
              <span className="text-white font-semibold text-[16px]">
                от 199 Р
              </span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/main/setup')}
              className="flex items-center justify-between bg-[#B4CBFF] p-4 rounded-[16px] cursor-pointer mt-[8px]"
            >
              <div className="flex items-center gap-2 text-[#1D4297]">
                <DownloadIcon fill="#1D4297" />
                <span className="font-semibold text-[16px]">
                  Установка и настройка
                </span>
              </div>
              <span className="text-white/50">
                <SmartphoneIcon />
              </span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/main/devices')}
              className="flex items-center justify-between px-4 py-[6px] bg-white/10 rounded-full mt-[24px] cursor-pointer"
            >
              <span className="text-white text-[14px] leading-[110%]">
                Ваши <br /> устройства:
              </span>
              <span className="bg-white/10 text-white text-[16px] font-bold w-6 h-6 flex items-center justify-center rounded-full">
                3
              </span>
              <div className="flex items-center gap-1 text-white text-[14px] font-medium">
                Посмотреть
                <ChevronRightIcon />
              </div>
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
