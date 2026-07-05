import { useEffect, useMemo } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import type { MainViewOutletContext } from '@/views/MainView'
import { DownloadIcon } from '@/components/icons/DownloadIcon'
import { GlobeIcon } from '@/components/icons/GlobeIcon'
import { SmartphoneIcon } from '@/components/icons/SmartphoneIcon'
import { ChevronRightIcon } from '@/components/icons/ChevronRightIcon'
import { NotificationBanner } from '@/components/NotificationBanner'
import { useUser } from '@/store/user/useUser'
import { useSubscription } from '@/store/subscription/useSubscription'
import { formatEndDate, getPlanLabel } from '@/js/services/utils/mappers'
import { getSubscriptionRenewalPath } from '@/js/constants/subscription'
import { formatSubscriptionExpiresIn } from '@/js/helpers/date'

const planStyles: Record<string, string> = {
  trial: 'text-white/50 bg-white/10 border-white/20',
  basic: 'text-primary bg-primary/20 border-primary/40 px-[14px]',
  pro: 'text-yellow-300 bg-yellow-500/20 border-yellow-400/40 px-[18px]',
}

export function MainPage() {
  const navigate = useNavigate()
  const { setHideTabBar } = useOutletContext<MainViewOutletContext>()
  const { user } = useUser()
  const {
    subscription,
    purchaseSuccessPlanType,
    clearPurchaseSuccess,
    getMinRenewalPrice,
  } = useSubscription()

  const isBlocked = user?.isBlocked ?? false
  const daysLeft = subscription?.daysLeft ?? null
  const isExpiringSoon =
    subscription?.isActive &&
    daysLeft !== null &&
    daysLeft >= 1 &&
    daysLeft <= 7

  const notification = useMemo(() => {
    if (isBlocked) {
      return {
        variant: 'blocked' as const,
        title: 'Вы заблокированы!',
        message: 'Вам необходимо обратиться в поддержку!',
      }
    }
    if (purchaseSuccessPlanType && subscription) {
      return {
        variant: 'success' as const,
        title: 'Подписка успешно добавлена!',
        message: `Период: до ${formatEndDate(subscription.endDate)}`,
      }
    }
    if (isExpiringSoon && subscription && daysLeft !== null) {
      return {
        variant: 'warning' as const,
        title: `Подписка закончится ${formatSubscriptionExpiresIn(daysLeft)}`,
        message: 'Не забудьте продлить подписку, иначе вы потеряете доступ к VPN',
      }
    }
    return null
  }, [isBlocked, purchaseSuccessPlanType, isExpiringSoon, daysLeft, subscription])

  useEffect(() => {
    setHideTabBar(isBlocked)
    return () => setHideTabBar(false)
  }, [isBlocked, setHideTabBar])

  const planLabel = subscription ? getPlanLabel(subscription.planType) : ''
  const renewalPath = getSubscriptionRenewalPath(subscription?.planType)
  const minRenewalPrice = subscription
    ? getMinRenewalPrice(subscription.planType)
    : 0
  const planStyle =
    planStyles[subscription?.planType ?? 'trial'] ?? planStyles.trial

  return (
    <main className="flex flex-col flex-1 min-h-0 px-4 pt-4 max-w-[768px] mx-auto w-full gap-5">
      {notification && (
        <NotificationBanner
          variant={notification.variant}
          title={notification.title}
          message={notification.message}
          onClose={
            notification.variant === 'success'
              ? clearPurchaseSuccess
              : undefined
          }
          onAction={() =>
            navigate(
              notification.variant === 'warning'
                ? renewalPath
                : '/main/support',
            )
          }
        />
      )}

      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex flex-1 items-center justify-center min-h-0">
          <img
            src="/logoWithText.svg"
            alt="Official VPN"
            className="w-full h-auto max-w-[249px]"
          />
        </div>

        {!isBlocked && subscription && (
          <div className="bg-[#FFFFFF]/10 border border-[#FFFFFF]/10 rounded-[24px] p-4 flex flex-col overflow-hidden">
            <div className="flex items-start justify-between mb-[16px]">
              <div className="flex flex-col">
                <p className="text-white font-bold text-[16px] leading-[130%]">
                  до {formatEndDate(subscription.endDate)}
                </p>
                <p
                  className={`text-[16px] font-medium leading-[130%] ${
                    subscription.isActive ? 'text-[#139D76]' : 'text-white/50'
                  }`}
                >
                  {subscription.isActive ? 'online' : 'offline'}
                </p>
              </div>
              <span
                className={`text-[12px] leading-[120%] font-medium border px-[10px] py-2 rounded-full ${planStyle}`}
              >
                {planLabel}
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate(renewalPath)}
              className="flex items-center justify-between bg-primary p-4 rounded-[16px] cursor-pointer"
            >
              <div className="flex items-center gap-2 text-white">
                <GlobeIcon />
                <span className="font-semibold text-[16px]">
                  Продлить подписку
                </span>
              </div>
              <span className="text-white font-semibold text-[16px]">
                от {minRenewalPrice} ₽
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
              <div className="flex items-center gap-1">
                <span className="text-white text-[14px] leading-[110%]">
                  Ваши устройства:
                </span>
                <span className="bg-white/10 text-white text-[16px] font-bold w-6 h-6 flex items-center justify-center rounded-full">
                  {subscription.devices.length}
                </span>
              </div>
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
