import { BottomSheet } from '@/components/BottomSheet'
import { PaymentMethodIcon } from '@/components/PaymentMethodIcon'
import { CheckmarkIcon } from '@/components/icons/CheckmarkIcon'
import { getPaymentMethodLabel } from '@/js/constants/paymentMethods'
import type { PaymentMethodId } from '@/js/types/payment'
import { usePayment } from '@/store/payment/usePayment'

interface PaymentMethodChangeSheetProps {
  isOpen: boolean
  onClose: () => void
  selectedPaymentMethodId: PaymentMethodId
  onSelectPaymentMethod: (methodId: PaymentMethodId) => void
}

export function PaymentMethodChangeSheet({
  isOpen,
  onClose,
  selectedPaymentMethodId,
  onSelectPaymentMethod,
}: PaymentMethodChangeSheetProps) {
  const { availablePaymentMethodIds } = usePayment()

  return (
    <BottomSheet
      isOpen={isOpen}
      title="Изменить способ оплаты"
      onClose={onClose}
      zIndexClass="z-70"
    >
      <div className="flex flex-col gap-3">
        {availablePaymentMethodIds.map((methodId) => (
          <button
            key={methodId}
            type="button"
            onClick={() => {
              onSelectPaymentMethod(methodId)
              onClose()
            }}
            className="bg-[#FFFFFF]/10 border border-[#FFFFFF]/10 rounded-[24px] p-4 flex items-center gap-3 w-full cursor-pointer"
          >
            <PaymentMethodIcon methodId={methodId} variant="picker" />
            <span className="text-white text-[16px] font-semibold leading-[130%] flex-1 text-left">
              {getPaymentMethodLabel(methodId)}
            </span>
            {selectedPaymentMethodId === methodId && (
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
