import { useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { BottomSheet } from '@/components/BottomSheet'
import { PrimaryButton } from '@/components/UI/PrimaryButton'
import { ChevronLeftIcon } from '@/components/icons/ChevronLeftIcon'
import { GlobeIcon } from '@/components/icons/GlobeIcon'
import { UsefulLinkArrowIcon } from '@/components/icons/UsefulLinkArrowIcon'
import { ChevronRightIcon } from '@/components/icons/ChevronRightIcon'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { InfoQuestionIcon } from '@/components/icons/InfoQuestionIcon'
import { SBPLogoIcon } from '@/components/icons/SBPLogoIcon'

const SHEET_ANIMATION_MS = 300
const PRICE_PER_SLOT_PERIOD = 60
const PRICE_PER_SLOT_MONTHLY = 80
const BASE_MONTHLY = 259

function useSheet() {
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

interface LocationState {
  slotCount?: number
  currentSlots?: number
  usedDevices?: number
}

export function BuySlotsPage() {
  const navigate = useNavigate()
  const { state } = useLocation() as { state: LocationState | null }
  const explanation = useSheet()
  const payment = useSheet()
  const [slotCount, setSlotCount] = useState(state?.slotCount ?? 1)

  const currentSlots = state?.currentSlots ?? 6
  const usedDevices = state?.usedDevices ?? 3

  const currentPrice = slotCount * PRICE_PER_SLOT_PERIOD
  const monthlyPrice = BASE_MONTHLY + slotCount * PRICE_PER_SLOT_MONTHLY
  const totalDevices = currentSlots + slotCount
  const availableDevices = currentSlots - usedDevices + slotCount

  return (
    <>
      <main className="flex flex-col flex-1 max-w-[768px] mx-auto w-full">
        <div className="flex items-center gap-3 px-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Назад"
            className="w-6 h-6 flex items-center justify-center text-white cursor-pointer shrink-0"
          >
            <ChevronLeftIcon />
          </button>
        </div>

        <div className="flex flex-col flex-1 p-4 gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-white text-[28px] font-semibold leading-[130%]">
              Покупка слотов
            </h1>
            <p className="text-white/80 text-[16px] leading-[120%]">
              Без необходимости удалять новые устройства.
            </p>
          </div>

          <button
            type="button"
            className="bg-[#FFFFFF]/10 border border-[#FFFFFF]/10 rounded-[24px] px-4 py-3 flex items-center gap-3 w-full cursor-pointer"
          >
            <div className="w-[46px] h-[46px] flex items-center justify-center rounded-[16px] bg-white/10 shrink-0 text-white">
              <GlobeIcon />
            </div>
            <div className="flex flex-col flex-1 gap-1 min-w-0 text-left">
              <span className="text-white text-[16px] font-semibold leading-[130%]">
                PRO • {currentSlots} устройств
              </span>
              <span className="text-[#139D76] text-[14px] leading-[110%]">
                Активна до 27.02.2026
              </span>
            </div>
            <span className="bg-secondary rounded-full w-[46px] h-[46px] flex items-center justify-center shrink-0 text-white">
              <UsefulLinkArrowIcon />
            </span>
          </button>

          <div className="bg-[#FFFFFF]/10 border border-[#FFFFFF]/10 rounded-[24px] p-4 flex flex-col gap-3">
            <span className="text-white text-[18px] font-medium">
              Добавление устройств
            </span>

            <div className="flex items-center justify-between bg-secondary rounded-full p-1">
              <button
                type="button"
                onClick={() => setSlotCount((c) => Math.max(1, c - 1))}
                className="w-[72px] h-[56px] flex items-center justify-center rounded-full bg-[#24326A] border-3 border-blue-500 text-white text-[26px] leading-none cursor-pointer shrink-0 font-medium"
              >
                −
              </button>
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-white font-semibold text-[24px] leading-none select-none">
                  {slotCount}
                </span>
                <span className="text-white/50 text-[14px] leading-[120%] font-medium">
                  Доступно {availableDevices}/{totalDevices}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSlotCount((c) => Math.min(99, c + 1))}
                className="w-[72px] h-[56px] flex items-center justify-center rounded-full bg-[#24326A] border-3 border-blue-500 text-white text-[26px] leading-none cursor-pointer shrink-0 font-medium"
              >
                +
              </button>
            </div>

            <div className="flex flex-col bg-white/10 rounded-[16px] p-4">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-[14px] leading-[130%]">
                  {slotCount} {slotCount === 1 ? 'устройство' : 'устройства'}
                  <br />* {PRICE_PER_SLOT_PERIOD} Р * 2 месяца
                </span>
                <span className="text-white font-semibold text-[18px] leading-[130%]">
                  {currentPrice} ₽
                </span>
              </div>
              <div className="h-px bg-white/20 my-3" />
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-[14px] leading-[130%]">
                  Со следующего
                  <br />
                  продления:
                </span>
                <span className="text-white font-semibold text-[18px] leading-[130%]">
                  {monthlyPrice} ₽ / мес
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={explanation.open}
            className="flex items-center justify-between gap-[6px] text-[#A5A6A7] rounded-full px-4 py-3 bg-white/10 text-[14px] cursor-pointer"
          >
            <div className="flex items-center gap-[6px]">
              <InfoQuestionIcon className="w-4 h-4 shrink-0" />
              <span>Пояснение к расчёту стоимости</span>
            </div>
            <ChevronRightIcon className="shrink-0" />
          </button>

          <div className="mt-auto">
            <PrimaryButton size="large" onClick={payment.open}>
              <div className="flex items-center w-full justify-between gap-2 px-4">
                <span>Купить слоты</span>
                <div className="flex items-center gap-[10px]">
                  <span className="text-white/50">
                    {totalDevices} устройств
                  </span>
                  <span className="text-white">{currentPrice} ₽</span>
                </div>
              </div>
            </PrimaryButton>
          </div>
        </div>
      </main>

      <BottomSheet
        isMounted={explanation.mounted}
        isVisible={explanation.visible}
        title="Пояснение к расчёту стоимости"
        onClose={explanation.close}
      >
        <p className="text-white/80 text-[16px] leading-[130%]">
          Итоговая стоимость подписки формируется из базового тарифа и
          подключённых дополнительных опций.
        </p>
        <div className="flex flex-col text-white/80 text-[16px] leading-[130%]">
          <p>Цена за 1 устройство: 60 Р в месяц.</p>
          <p>Остаток подписки: 60 дней.</p>
          <p>Доплата за текущий период: 120 Р.</p>
        </div>
        <p className="text-white/80 text-[16px] leading-[130%]">
          Оплата за следующие периоды: 259 Р в месяц.
        </p>
        <p className="text-white/80 text-[16px] leading-[130%]">
          Итого: 120 + 259 = 379 Р
        </p>
        <PrimaryButton size="large" onClick={explanation.close}>
          Всё понять, закрыть
        </PrimaryButton>
      </BottomSheet>

      <BottomSheet
        isMounted={payment.mounted}
        isVisible={payment.visible}
        title="Подтверждение оплаты"
        onClose={payment.close}
      >
        <div className="bg-white/10 rounded-[16px] p-3 flex flex-col">
          <p className="text-white/90 text-[14px] leading-[120%]">
            +{slotCount} {slotCount === 1 ? 'устройство' : 'устройства'} до 27
            ноября 2026
          </p>
          <p className="text-white/50 text-[12px] leading-[120%]">
            далее {monthlyPrice} рублей в месяц с 27 ноября
          </p>
          <div className="h-px bg-white/20 my-3" />
          <p className="text-white/80 text-[14px] leading-[120%]">
            Количество устройств: {totalDevices}
          </p>
        </div>

        <button
          type="button"
          className="bg-white/10 border border-white/10 rounded-[16px] p-4 flex items-center gap-3 w-full cursor-pointer"
        >
          <SBPLogoIcon className="h-7 w-auto shrink-0" />
          <span className="text-white text-[16px] font-medium flex-1 text-left">
            Оплата новым СБП
          </span>
          <div className="w-[28px] h-[28px] flex items-center justify-center rounded-full border border-white/10 bg-secondary shrink-0 text-white">
            <ChevronDownIcon className="shrink-0" />
          </div>
        </button>

        <PrimaryButton size="large">Оплатить {currentPrice} Р</PrimaryButton>

        <p className="text-white/40 text-[12px] leading-[130%] text-center">
          Нажимая на кнопку Оплатить, Вы соглашаетесь с{' '}
          <span className="underline cursor-pointer">офертой</span> и{' '}
          <span className="underline cursor-pointer">политикой конф.</span>
        </p>
      </BottomSheet>
    </>
  )
}
