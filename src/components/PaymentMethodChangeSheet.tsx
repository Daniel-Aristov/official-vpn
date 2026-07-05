import { BottomSheet } from '@/components/BottomSheet'
import { PaymentMethodIcon } from '@/components/PaymentMethodIcon'
import { CheckmarkIcon } from '@/components/icons/CheckmarkIcon'
import type { PaymentMethodId } from '@/data/paymentMethods'
import { usePayment } from '@/store/payment/usePayment'

interface PaymentMethodChangeSheetProps {
  isMounted: boolean
  isVisible: boolean
  onClose: () => void
  selectedPaymentMethodId: PaymentMethodId
  onSelectPaymentMethod: (methodId: PaymentMethodId) => void
}

export function PaymentMethodChangeSheet({
  isMounted,
  isVisible,
  onClose,
  selectedPaymentMethodId,
  onSelectPaymentMethod,
}: PaymentMethodChangeSheetProps) {
  const { availablePaymentMethods } = usePayment()

  return (
    <BottomSheet
      isMounted={isMounted}
      isVisible={isVisible}
      title="Изменить способ оплаты"
      onClose={onClose}
      zIndexClass="z-70"
    >
      <div className="flex flex-col gap-3">
        {availablePaymentMethods.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => {
              onSelectPaymentMethod(method.id)
              onClose()
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
  )
}
