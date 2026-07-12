import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PricingExplanationSheet } from '@/components/PricingExplanationSheet'
import { DeviceLimitExceededSheet } from '@/components/DeviceLimitExceededSheet'
import { PaymentConfirmationSheet } from '@/components/PaymentConfirmationSheet'
import { PaymentMethodChangeSheet } from '@/components/PaymentMethodChangeSheet'
import { UpgradeToProSheet } from '@/components/UpgradeToProSheet'
import { PrimaryButton } from '@/components/UI/PrimaryButton'
import { StepSlider } from '@/components/UI/StepSlider'
import { ChevronLeftIcon } from '@/components/icons/ChevronLeftIcon'
import { StarIcon } from '@/components/icons/StarIcon'
import {
  resolvePaymentMethodId,
} from '@/js/constants/paymentMethods'
import type { PaymentMethodId } from '@/js/types/payment'
import {
  PERIODS,
  PERIOD_MONTHS,
  DEVICE_OPTIONS,
  PRO_DEVICE_OPTIONS,
  PRO_MONTHLY_PRICE,
  BASIC_MONTHLY_PRICE,
  YEAR_PRICE,
  PRICE_PER_EXTRA_DEVICE,
} from '@/js/constants/subscription'
import { formatSubscriptionEndDate } from '@/js/helpers/date'
import { useSheet } from '@/js/helpers/useSheet'
import { useSubscription } from '@/store/subscription/useSubscription'
import { usePayment } from '@/store/payment/usePayment'

export function BuySubscriptionPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { getPeriodsForPlan, purchaseSubscription } = useSubscription()
  const { settings, availablePaymentMethodIds } = usePayment()
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
  const isAutoRenewalEnabled = settings?.isAutoRenewalEnabled ?? true

  const resolvedPaymentMethodId = useMemo(
    () =>
      resolvePaymentMethodId(
        selectedPaymentMethodId,
        settings?.availableMethods,
      ),
    [selectedPaymentMethodId, settings?.availableMethods],
  )

  const apiPeriods = getPeriodsForPlan(isPro ? 'pro' : 'basic')
  const periods = apiPeriods.length > 0 ? apiPeriods : PERIODS

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
  const selectedPeriod = periods.find((p) => p.id === periodId) ?? periods[1]
  const hasPaymentMethods = availablePaymentMethodIds.length > 0

  const periodMonths = PERIOD_MONTHS[selectedPeriod.id] ?? 3
  const subscriptionEndDate = formatSubscriptionEndDate(periodMonths)

  const proBillingMultiplier = deviceCount - 3

  const actualPrice = isPro
    ? Math.ceil(selectedPeriod.price / 2) * proBillingMultiplier
    : Math.ceil(selectedPeriod.price / 2) * deviceCount
  const fullPrice = isPro
    ? Math.ceil(YEAR_PRICE / 2) * proBillingMultiplier
    : Math.ceil(YEAR_PRICE / 2) * deviceCount

  const lastDeviceIndex = deviceOptions.length - 1

  const handleDeviceChange = (index: number) => {
    setDeviceIndex(index)
    if (!isPro && index === lastDeviceIndex) {
      window.setTimeout(() => proUpgrade.open(), 0)
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

  const handleConfirmPayment = () => {
    void purchaseSubscription({
      planType: isPro ? 'pro' : 'basic',
      periodId,
      deviceCount,
      paymentMethodId: resolvedPaymentMethodId,
    }).then(() => {
      payment.close()
      navigate('/main')
    })
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

        <div className="flex flex-col flex-1 px-4 pt-4 gap-4">
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
              getStepAriaLabel={(count) => `${count} устройств`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {periods.map((period) => {
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

          <div className="shrink-0 h-[72px]" />
        </div>
      </main>

      <div className="fixed bottom-[90px] left-0 right-0 px-4 z-40 max-w-[768px] mx-auto">
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

      {isPro && (
        <DeviceLimitExceededSheet
          isOpen={deviceLimit.isOpen}
          onClose={deviceLimit.close}
          onIncreaseLimit={handleOpenBuySlots}
          onManageDevices={handleOpenBuySlots}
        />
      )}

      {!isPro && (
        <UpgradeToProSheet
          isOpen={proUpgrade.isOpen}
          onClose={proUpgrade.close}
          onUpgrade={handleUpgradeToPro}
          proPlanPrice={PERIODS[1].price}
          basicPlanPrice={PRO_MONTHLY_PRICE}
        />
      )}

      <PricingExplanationSheet
        isOpen={explanation.isOpen}
        onClose={explanation.close}
        currentPeriodSurcharge={extraDevicePrice}
        nextPeriodMonthlyPrice={nextPeriodMonthlyPrice}
      />

      {hasPaymentMethods && (
        <PaymentConfirmationSheet
          isOpen={payment.isOpen}
          onClose={payment.close}
          onConfirm={handleConfirmPayment}
          onChangePaymentMethod={paymentMethodChange.open}
          subscriptionEndDate={subscriptionEndDate}
          periodLabel={selectedPeriod.label}
          isPro={isPro}
          isAutoRenewalEnabled={isAutoRenewalEnabled}
          basicMonthlyPrice={BASIC_MONTHLY_PRICE}
          deviceCount={deviceCount}
          selectedPaymentMethodId={resolvedPaymentMethodId}
          actualPrice={actualPrice}
        />
      )}

      <PaymentMethodChangeSheet
        isOpen={paymentMethodChange.isOpen}
        onClose={paymentMethodChange.close}
        selectedPaymentMethodId={resolvedPaymentMethodId}
        onSelectPaymentMethod={setSelectedPaymentMethodId}
      />
    </>
  )
}
