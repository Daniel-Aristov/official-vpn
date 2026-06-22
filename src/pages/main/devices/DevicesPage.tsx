import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AddSubscriptionAlert } from '@/components/AddSubscriptionAlert'
import { InfoCircleIcon } from '@/components/icons/InfoCircleIcon'
import { AndroidIcon } from '@/components/icons/AndroidIcon'
import { AndroidTvIcon } from '@/components/icons/AndroidTvIcon'
import { IosIcon } from '@/components/icons/IosIcon'
import { MacOsIcon } from '@/components/icons/MacOsIcon'
import { MonitorIcon } from '@/components/icons/MonitorIcon'
import { TrashIcon } from '@/components/icons/TrashIcon'
import { WindowsIcon } from '@/components/icons/WindowsIcon'
import { PrimaryButton } from '@/components/UI/PrimaryButton'
import { SUBSCRIPTION_DEEP_LINK } from '@/js/constants/urls'
import { openInNewTab } from '@/js/helpers/browser'
import { getDevicePlatformKind } from '@/js/helpers/platform'
import { useSubscription } from '@/store/subscription/useSubscription'
import type { SubscriptionDevice } from '@/js/types/subscription'

function DevicePlatformIcon({ platform }: { platform: string }) {
  const kind = getDevicePlatformKind(platform)

  if (kind === 'ios') return <IosIcon className="w-6 h-6" />
  if (kind === 'android-tv') return <AndroidTvIcon className="w-6 h-6" />
  if (kind === 'android') return <AndroidIcon className="w-6 h-6" />
  if (kind === 'windows') return <WindowsIcon className="w-6 h-6" />
  if (kind === 'mac') return <MacOsIcon className="w-6 h-6" />
  return <MonitorIcon className="w-6 h-6" />
}

function DeviceItem({
  device,
  onRemove,
}: {
  device: SubscriptionDevice
  onRemove: (id: string) => void
}) {
  return (
    <div className="flex flex-col gap-3 items-start bg-white/10 border border-white/10 rounded-[16px] p-4">
      <div className="flex items-center justify-between gap-2 w-full">
        <div className="w-[46px] h-[46px] flex items-center justify-center rounded-[16px] bg-white/10 shrink-0">
          <DevicePlatformIcon platform={device.platform} />
        </div>
        <button
          type="button"
          onClick={() => onRemove(device.id)}
          className="w-[46px] h-[46px] flex items-center justify-center rounded-full bg-[#B4CBFF] shrink-0 cursor-pointer"
          aria-label="Отключить устройство"
        >
          <TrashIcon />
        </button>
      </div>
      <div className="flex flex-col flex-1 gap-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-white/50 text-[14px] leading-[130%]">
            Модель:
          </span>
          <span className="text-white text-[14px] leading-[130%] font-medium">
            {device.model}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/50 text-[14px] leading-[130%]">
            Платформа:
          </span>
          <span className="text-white text-[14px] leading-[130%] font-medium">
            {device.platform}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/50 text-[14px] leading-[130%]">
            Обновлено:
          </span>
          <span className="text-white text-[14px] leading-[130%] font-medium">
            {device.updatedAt}
          </span>
        </div>
      </div>
    </div>
  )
}

export function DevicesPage() {
  const navigate = useNavigate()
  const { subscription, removeDevice } = useSubscription()
  const [slotCount, setSlotCount] = useState(1)
  const [isSubscriptionAlertOpen, setIsSubscriptionAlertOpen] = useState(false)

  const hasSubscription = subscription?.isActive ?? false
  const devices = subscription?.devices ?? []
  const totalSlots = subscription?.totalSlots ?? 0

  const confirmAddSubscription = () => {
    openInNewTab(SUBSCRIPTION_DEEP_LINK)
    setIsSubscriptionAlertOpen(false)
  }

  const handleRemoveDevice = (deviceId: string) => {
    void removeDevice(deviceId)
  }

  return (
    <>
      <main className="flex flex-col flex-1 p-4 gap-4 max-w-[768px] mx-auto w-full">
        <div className="rounded-[24px] p-4 flex flex-col gap-4 border border-[#FFFFFF]/10 bg-[#FFFFFF]/10">
          <div className="w-[56px] h-[56px] flex items-center justify-center rounded-[16px] bg-white/10">
            <MonitorIcon className="w-6 h-6" fillOpacity={1} />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-white text-[24px] font-semibold">Устройства</h1>
            <p className="text-white/80 text-[16px] leading-[130%]">
              Покупка слотов, удаление и добавление новых устройств
            </p>
          </div>
        </div>

        {hasSubscription && (
          <div className="bg-[#FFFFFF]/10 border border-[#FFFFFF]/10 rounded-[24px] p-4 flex items-start gap-3">
            <InfoCircleIcon className="w-6 h-6 text-white/80 shrink-0 mt-0.5" />
            <p className="text-white/80 text-[16px] leading-[120%]">
              Дополнительное устройство стоит 60 рублей в месяц. Для этого
              необходимо выбрать кол-во слотов и перейти к оплате.
            </p>
          </div>
        )}

        {!hasSubscription ? (
          <>
            <div
              style={{ minHeight: 140 }}
              className="bg-[#FFFFFF]/10 border border-[#FFFFFF]/10 rounded-[24px] p-4 w-full flex items-center justify-center text-white/80 text-[16px] leading-[130%] text-center"
            >
              <span className="min-h-[270px] flex items-center justify-center mx-auto">
                У вас ещё нет активных подписок для добавления устройств
              </span>
            </div>
            <PrimaryButton
              size="large"
              className="mt-4"
              onClick={() => setIsSubscriptionAlertOpen(true)}
            >
              Приобрести подписку
            </PrimaryButton>
          </>
        ) : (
          <>
            <div className="bg-[#FFFFFF]/10 border border-[#FFFFFF]/10 rounded-[24px] overflow-hidden p-4">
              <div className="flex items-center justify-between pb-4">
                <span className="text-white/50 text-[14px] font-medium">
                  Подключённые устройства
                </span>
                <span className="text-white/50 text-[13px] bg-white/10 px-2 py-0.5 rounded-full">
                  {devices.length}/{totalSlots}
                </span>
              </div>
              <div className="flex flex-col gap-4">
                {devices.map((device) => (
                  <DeviceItem
                    key={device.id}
                    device={device}
                    onRemove={handleRemoveDevice}
                  />
                ))}
              </div>
            </div>

            <div className="mt-auto flex items-center gap-3">
              <div className="flex items-center gap-4 bg-secondary border border-white/10 rounded-[16px] overflow-hidden shrink-0 py-3 px-4">
                <button
                  type="button"
                  onClick={() => setSlotCount((c) => Math.max(1, c - 1))}
                  className="flex items-center font-semibold justify-center text-white text-[24px] cursor-pointer leading-[115%] mb-[3px]"
                >
                  −
                </button>
                <span className="text-white font-semibold text-[24px] text-center select-none leading-[115%]">
                  {slotCount}
                </span>
                <button
                  type="button"
                  onClick={() => setSlotCount((c) => Math.min(99, c + 1))}
                  className="flex items-center font-semibold justify-center text-white text-[24px] cursor-pointer leading-[115%] mb-[3px]"
                >
                  +
                </button>
              </div>
              <PrimaryButton
                size="large"
                className="min-h-[56px]"
                onClick={() =>
                  navigate('/main/devices/slots', {
                    state: {
                      slotCount,
                      currentSlots: totalSlots,
                      usedDevices: devices.length,
                    },
                  })
                }
              >
                Приобрести слот
              </PrimaryButton>
            </div>
          </>
        )}
      </main>
      <AddSubscriptionAlert
        isOpen={isSubscriptionAlertOpen}
        deepLink={SUBSCRIPTION_DEEP_LINK}
        onClose={() => setIsSubscriptionAlertOpen(false)}
        onConfirm={confirmAddSubscription}
      />
    </>
  )
}
