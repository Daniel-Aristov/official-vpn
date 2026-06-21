import { useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BottomSheet } from '@/components/BottomSheet'
import { PricingExplanationSheet } from '@/components/PricingExplanationSheet'
import { DeviceLimitExceededSheet } from '@/components/DeviceLimitExceededSheet'
import { UpgradeToProSheet } from '@/components/UpgradeToProSheet'
import { PrimaryButton } from '@/components/UI/PrimaryButton'
import { StepSlider } from '@/components/UI/StepSlider'
import { ChevronLeftIcon } from '@/components/icons/ChevronLeftIcon'
import { StarIcon } from '@/components/icons/StarIcon'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { CheckmarkIcon } from '@/components/icons/CheckmarkIcon'
import { PaymentHistoryIcon } from '@/components/icons/PaymentHistoryIcon'
import { SBPLogoIcon } from '@/components/icons/SBPLogoIcon'
import { TetherLogoIcon } from '@/components/icons/TetherLogoIcon'
import {
  PAYMENT_METHODS,
  type PaymentMethod,
  type PaymentMethodId,
} from '@/data/paymentMethods'

const PERIODS = [
  { id: '1m', label: '1 месяц', price: 199, description: 'Оплата за 1 месяц' },
  {
    id: '3m',
    label: '3 месяца',
    price: 597,
    description: 'Оплата за 3 месяца',
  },
  {
    id: '6m',
    label: '6 месяцев',
    price: 1194,
    description: 'Оплата за 6 месяцев',
  },
  { id: '1y', label: '1 год', price: 2388, description: 'Оплата за 1 год' },
]

const DEVICE_OPTIONS = [3, 4, 5, 6]
const PRO_DEVICE_OPTIONS = [6, 7, 8, 9]
const PRO_MONTHLY_PRICE = 299
const BASIC_MONTHLY_PRICE = PERIODS[0].price

const PERIOD_MONTHS: Record<string, number> = {
  '1m': 1,
  '3m': 3,
  '6m': 6,
  '1y': 12,
}

const YEAR_PRICE = 2388
const SHEET_ANIMATION_MS = 300
const PRICE_PER_EXTRA_DEVICE = 60

function formatSubscriptionEndDate(months: number): string {
  const date = new Date()
  date.setMonth(date.getMonth() + months)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

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

export function BuySubscriptionPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isPro = searchParams.get('plan') === 'pro'
  const payment = useSheet()
  const paymentMethodChange = useSheet()
  const proUpgrade = useSheet()
  const deviceLimit = useSheet()
  const explanation = useSheet()
  const [basicDeviceIndex, setBasicDeviceIndex] = useState(0)
  const [proDeviceIndex, setProDeviceIndex] = useState(0)
  const [periodId, setPeriodId] = useState('3m')
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] =
    useState<PaymentMethodId>('sbp')
  const [isAutoRenewalEnabled] = useState(true)

  const deviceOptions = isPro ? PRO_DEVICE_OPTIONS : DEVICE_OPTIONS
  const deviceIndex = isPro ? proDeviceIndex : basicDeviceIndex
  const setDeviceIndex = isPro ? setProDeviceIndex : setBasicDeviceIndex

  const deviceCount = deviceOptions[deviceIndex]
  const [initialDeviceCount] = useState(deviceCount)
  const extraDeviceCount = deviceCount - initialDeviceCount
  const hasExtraDevices = extraDeviceCount > 0
  const extraDevicePrice = extraDeviceCount * PRICE_PER_EXTRA_DEVICE
  const nextPeriodMonthlyPrice =
    BASIC_MONTHLY_PRICE + extraDeviceCount * PRICE_PER_EXTRA_DEVICE
  const selectedPeriod = PERIODS.find((p) => p.id === periodId) ?? PERIODS[1]
  const selectedPaymentMethod =
    PAYMENT_METHODS.find((method) => method.id === selectedPaymentMethodId) ??
    PAYMENT_METHODS[1]

  const periodMonths = PERIOD_MONTHS[selectedPeriod.id] ?? 3
  const subscriptionEndDate = formatSubscriptionEndDate(periodMonths)

  const proBillingMultiplier = deviceCount - 3

  const actualPrice = isPro
    ? Math.ceil(selectedPeriod.price / 2) * proBillingMultiplier
    : Math.ceil(selectedPeriod.price / 2) * deviceCount
  const fullPrice = isPro
    ? Math.ceil(YEAR_PRICE / 2) * proBillingMultiplier
    : Math.ceil(YEAR_PRICE / 2) * deviceCount

  const handleDeviceChange = (index: number) => {
    setDeviceIndex(index)
  }

  const handleDeviceCommit = (index: number, previousIndex: number) => {
    if (isPro) return
    const prevCount = DEVICE_OPTIONS[previousIndex]
    const nextCount = DEVICE_OPTIONS[index]
    if (nextCount === 6 && prevCount !== 6) {
      proUpgrade.open()
    }
  }

  const handleUpgradeToPro = () => {
    proUpgrade.close()
    navigate('/main/subscription?plan=pro')
  }

  const handleOpenBuySlots = () => {
    deviceLimit.close()
    navigate('/main/devices/slots', {
      state: {
        slotCount: 1,
        currentSlots: 6,
        usedDevices: 6,
      },
    })
  }

  const handleSubscribe = () => {
    if (isPro && deviceCount === 9) {
      deviceLimit.open()
      return
    }
    payment.open()
  }

  return (
    <>
      <main className="flex flex-col flex-1 max-w-[768px] mx-auto w-full">
        <div className="flex items-center justify-between px-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Назад"
            className="w-6 h-6 flex items-center justify-center text-white cursor-pointer shrink-0"
          >
            <ChevronLeftIcon />
          </button>
          {!isPro && (
            <button
              type="button"
              onClick={proUpgrade.open}
              className="text-white font-semibols text-[16px] cursor-pointer"
            >
              Перейти на PRO
            </button>
          )}
        </div>

        <div className="flex flex-col flex-1 p-4 gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-white text-[28px] font-semibold leading-[130%]">
              {isPro ? 'Покупка подписки PRO' : 'Покупка подписки'}
            </h1>
            <p className="text-white/80 text-[16px] leading-[120%]">
              {isPro
                ? 'Больше 10 локаций, 6 устройств, обход белых списков на LTE и Youtube без рекламы'
                : 'Подключайте больше устройств и пользуйтесь сервисом вместе с друзьями и близкими'}
            </p>
          </div>

          <div className="bg-[#FFFFFF]/10 border border-[#FFFFFF]/10 rounded-[24px] p-4 flex flex-col gap-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="text-white bg-white/10 font-bold text-[18px] leading-none w-[42px] h-[42px] flex items-center justify-center rounded-full text-center shrink-0">
                  {deviceCount}
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-semibold text-[18px] leading-[130%]">
                    Устройства
                  </span>
                  <span className="text-white/50 text-[14px] leading-[120%]">
                    Одновременно в подписке
                  </span>
                </div>
              </div>
              {hasExtraDevices && (
                <button
                  type="button"
                  onClick={explanation.open}
                  className="bg-black/40 rounded-[12px] px-3 py-2 flex flex-col items-center shrink-0 cursor-pointer"
                >
                  <span className="text-white font-semibold text-[16px] leading-[130%]">
                    {extraDevicePrice} ₽
                  </span>
                  <span className="text-white/50 text-[12px] leading-[120%]">
                    {extraDeviceCount} устр.
                  </span>
                </button>
              )}
            </div>

            <StepSlider
              options={deviceOptions}
              value={deviceIndex}
              onChange={handleDeviceChange}
              onCommit={handleDeviceCommit}
              getStepAriaLabel={(count) => `${count} устройств`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {PERIODS.map((period) => {
              const isSelected = period.id === periodId
              return (
                <button
                  key={period.id}
                  type="button"
                  onClick={() => setPeriodId(period.id)}
                  className={`relative rounded-[20px] p-4 flex flex-col gap-1 text-left cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'border-primary border-2 bg-primary/30'
                      : 'bg-[#FFFFFF]/10 border-2 border-[#FFFFFF]/10'
                  }`}
                >
                  {period.id === '3m' && (
                    <div className="absolute top-3 right-3">
                      <StarIcon />
                    </div>
                  )}
                  <span className="text-white text-[16px] font-medium leading-[120%] mb-[30px]">
                    {period.label}
                  </span>
                  <span className="text-white font-bold text-[24px] leading-[110%]">
                    {period.price} ₽
                  </span>
                  <span className="text-white/50 text-[14px] leading-[120%]">
                    {period.description}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-auto">
            <PrimaryButton size="large" onClick={handleSubscribe}>
              <div className="flex items-center w-full justify-between gap-2 px-4">
                <span>Продлить подписку</span>
                <div className="flex items-center gap-2">
                  <span className="text-white">{actualPrice} Р</span>
                  <span className="text-white line-through">{fullPrice} Р</span>
                </div>
              </div>
            </PrimaryButton>
          </div>
        </div>
      </main>

      {isPro && (
        <DeviceLimitExceededSheet
          isMounted={deviceLimit.mounted}
          isVisible={deviceLimit.visible}
          onClose={deviceLimit.close}
          onIncreaseLimit={handleOpenBuySlots}
          onManageDevices={handleOpenBuySlots}
        />
      )}

      {!isPro && (
        <UpgradeToProSheet
          isMounted={proUpgrade.mounted}
          isVisible={proUpgrade.visible}
          onClose={proUpgrade.close}
          onUpgrade={handleUpgradeToPro}
          proPlanPrice={PERIODS[1].price}
          basicPlanPrice={PRO_MONTHLY_PRICE}
        />
      )}

      <PricingExplanationSheet
        isMounted={explanation.mounted}
        isVisible={explanation.visible}
        onClose={explanation.close}
        currentPeriodSurcharge={extraDevicePrice}
        nextPeriodMonthlyPrice={nextPeriodMonthlyPrice}
      />

      <BottomSheet
        isMounted={payment.mounted}
        isVisible={payment.visible}
        title="Подтверждение оплаты"
        onClose={payment.close}
      >
        <div className="bg-white/10 rounded-[16px] p-3 flex flex-col">
          <p className="text-white/90 text-[14px] leading-[120%]">
            Подписка до {subscriptionEndDate}, {selectedPeriod.label}
          </p>
          {!isPro && isAutoRenewalEnabled && (
            <p className="text-white/50 text-[12px] leading-[120%]">
              (далее {BASIC_MONTHLY_PRICE} рублей в месяц)
            </p>
          )}
          <div className="h-px bg-white/20 my-3" />
          <p className="text-white/80 text-[14px] leading-[120%]">
            Количество устройств: {deviceCount}
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

        <PrimaryButton size="large">Оплатить {actualPrice} Р</PrimaryButton>

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
