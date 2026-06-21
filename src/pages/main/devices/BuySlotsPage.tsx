import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { BottomSheet } from '@/components/BottomSheet'
import { PricingExplanationSheet } from '@/components/PricingExplanationSheet'
import { PrimaryButton } from '@/components/UI/PrimaryButton'
import { ChevronLeftIcon } from '@/components/icons/ChevronLeftIcon'
import { GlobeIcon } from '@/components/icons/GlobeIcon'
import { UsefulLinkArrowIcon } from '@/components/icons/UsefulLinkArrowIcon'
import { ChevronRightIcon } from '@/components/icons/ChevronRightIcon'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { InfoQuestionIcon } from '@/components/icons/InfoQuestionIcon'
import { CheckmarkIcon } from '@/components/icons/CheckmarkIcon'
import { PaymentHistoryIcon } from '@/components/icons/PaymentHistoryIcon'
import { SBPLogoIcon } from '@/components/icons/SBPLogoIcon'
import { TetherLogoIcon } from '@/components/icons/TetherLogoIcon'
import {
  PAYMENT_METHODS,
  type PaymentMethod,
  type PaymentMethodId,
} from '@/data/paymentMethods'
import {
  PRICE_PER_SLOT_PERIOD,
  PRICE_PER_SLOT_MONTHLY,
  BASE_MONTHLY_SLOTS,
} from '@/js/constants/subscription'
import { useSheet } from '@/js/helpers/useSheet'

interface LocationState {
  slotCount?: number
  currentSlots?: number
  usedDevices?: number
}

function PaymentMethodIcon({
  method,
  variant,
}: {
  method: PaymentMethod
  variant: 'checkout' | 'picker'
}) {
  if (variant === 'checkout') {
    if (method.id === 'card') {
      return <PaymentHistoryIcon className="w-7 h-7 shrink-0 text-white" />
    }
    if (method.id === 'sbp') {
      return <SBPLogoIcon className="h-7 w-auto shrink-0" />
    }
    return <TetherLogoIcon className="h-[19px] w-auto shrink-0" />
  }

  return (
    <div className="w-[72px] h-[50px] flex items-center justify-center rounded-[8px] bg-white/10 shrink-0 text-white">
      {method.id === 'card' ? (
        <PaymentHistoryIcon className="w-6 h-6" />
      ) : method.id === 'sbp' ? (
        <SBPLogoIcon className="h-[28px] w-auto" />
      ) : (
        <TetherLogoIcon className="h-[19px] w-auto" />
      )}
    </div>
  )
}

export function BuySlotsPage() {
  const navigate = useNavigate()
  const { state } = useLocation() as { state: LocationState | null }
  const explanation = useSheet()
  const payment = useSheet()
  const paymentMethodChange = useSheet()
  const [slotCount, setSlotCount] = useState(state?.slotCount ?? 1)
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] =
    useState<PaymentMethodId>('sbp')

  const selectedPaymentMethod =
    PAYMENT_METHODS.find((method) => method.id === selectedPaymentMethodId) ??
    PAYMENT_METHODS[1]

  const currentSlots = state?.currentSlots ?? 6
  const usedDevices = state?.usedDevices ?? 3

  const currentPrice = slotCount * PRICE_PER_SLOT_PERIOD
  const monthlyPrice = BASE_MONTHLY_SLOTS + slotCount * PRICE_PER_SLOT_MONTHLY
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

      <PricingExplanationSheet
        isMounted={explanation.mounted}
        isVisible={explanation.visible}
        onClose={explanation.close}
        currentPeriodSurcharge={currentPrice}
        nextPeriodMonthlyPrice={monthlyPrice}
      />

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

        <div
          onClick={paymentMethodChange.open}
          className="bg-white/10 border border-white/10 rounded-[16px] p-4 flex items-center gap-3 w-full cursor-pointer"
        >
          <PaymentMethodIcon
            method={selectedPaymentMethod}
            variant="checkout"
          />
          <span className="text-white text-[16px] font-medium flex-1 text-left">
            {selectedPaymentMethod.checkoutLabel}
          </span>
          <button
            type="button"
            aria-label="Изменить способ оплаты"
            className="w-[28px] h-[28px] flex items-center justify-center rounded-full border border-white/10 bg-secondary shrink-0 text-white cursor-pointer"
          >
            <ChevronDownIcon className="shrink-0" />
          </button>
        </div>

        <PrimaryButton size="large">Оплатить {currentPrice} Р</PrimaryButton>

        <p className="text-white/40 text-[12px] leading-[130%] text-center">
          Нажимая на кнопку Оплатить, Вы соглашаетесь с{' '}
          <span className="underline cursor-pointer">офертой</span> и{' '}
          <span className="underline cursor-pointer">политикой конф.</span>
        </p>
      </BottomSheet>

      <BottomSheet
        isMounted={paymentMethodChange.mounted}
        isVisible={paymentMethodChange.visible}
        title="Изменить способ оплаты"
        onClose={paymentMethodChange.close}
        zIndexClass="z-70"
      >
        <div className="flex flex-col gap-3">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => {
                setSelectedPaymentMethodId(method.id)
                paymentMethodChange.close()
              }}
              className="bg-[#FFFFFF]/10 border border-[#FFFFFF]/10 rounded-[24px] p-4 flex items-center gap-3 w-full cursor-pointer"
            >
              <PaymentMethodIcon method={method} variant="picker" />
              <span className="text-white text-[16px] font-semibold leading-[130%] flex-1 text-left">
                {method.checkoutLabel}
              </span>
              {selectedPaymentMethodId === method.id && (
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#139D76] shrink-0">
                  <CheckmarkIcon fill="white" className="w-4 h-4" />
                </div>
              )}
            </button>
          ))}
        </div>
      </BottomSheet>
    </>
  )
}
