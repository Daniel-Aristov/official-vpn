import { BottomSheet } from '@/components/BottomSheet'
import { PaymentMethodIcon } from '@/components/PaymentMethodIcon'
import { PrimaryButton } from '@/components/UI/PrimaryButton'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import type { PaymentMethod } from '@/data/paymentMethods'

interface PaymentConfirmationSheetProps {
  isMounted: boolean
  isVisible: boolean
  onClose: () => void
  onChangePaymentMethod: () => void
  subscriptionEndDate: string
  periodLabel: string
  isPro: boolean
  isAutoRenewalEnabled: boolean
  basicMonthlyPrice: number
  deviceCount: number
  selectedPaymentMethod: PaymentMethod
  actualPrice: number
}

export function PaymentConfirmationSheet({
  isMounted,
  isVisible,
  onClose,
  onChangePaymentMethod,
  subscriptionEndDate,
  periodLabel,
  isPro,
  isAutoRenewalEnabled,
  basicMonthlyPrice,
  deviceCount,
  selectedPaymentMethod,
  actualPrice,
}: PaymentConfirmationSheetProps) {
  return (
    <BottomSheet
      isMounted={isMounted}
      isVisible={isVisible}
      title="Подтверждение оплаты"
      onClose={onClose}
    >
      <div className="bg-white/10 rounded-[16px] p-3 flex flex-col">
        <p className="text-white/90 text-[14px] leading-[120%]">
          Подписка до {subscriptionEndDate}, {periodLabel}
        </p>
        {!isPro && isAutoRenewalEnabled && (
          <p className="text-white/50 text-[12px] leading-[120%]">
            (далее {basicMonthlyPrice} рублей в месяц)
          </p>
        )}
        <div className="h-px bg-white/20 my-3" />
        <p className="text-white/80 text-[14px] leading-[120%]">
          Количество устройств: {deviceCount}
        </p>
      </div>

      <div
        onClick={onChangePaymentMethod}
        className="bg-white/10 border border-white/10 rounded-[16px] p-4 flex items-center gap-3 w-full cursor-pointer"
      >
        <PaymentMethodIcon method={selectedPaymentMethod} variant="checkout" />
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
  )
}
