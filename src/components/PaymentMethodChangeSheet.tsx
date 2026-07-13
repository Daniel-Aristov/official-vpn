import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { BottomSheet } from '@/components/BottomSheet'
import { PaymentMethodIcon } from '@/components/PaymentMethodIcon'
import { CheckmarkIcon } from '@/components/icons/CheckmarkIcon'
import { getPaymentMethodLabel } from '@/js/constants/paymentMethods'
import { TAB_PRESS_TRANSITION } from '@/js/constants/motion'
import type { PaymentMethodId } from '@/js/types/payment'
import { usePayment } from '@/store/payment/usePayment'

const CLOSE_DELAY_MS = 250

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
  const [activeId, setActiveId] = useState(selectedPaymentMethodId)
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen)
    if (isOpen) {
      setActiveId(selectedPaymentMethodId)
    }
  }

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
      }
    }
  }, [])

  const handleSelect = (methodId: PaymentMethodId) => {
    setActiveId(methodId)

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
    }

    closeTimerRef.current = setTimeout(() => {
      onSelectPaymentMethod(methodId)
      onClose()
      closeTimerRef.current = null
    }, CLOSE_DELAY_MS)
  }

  return (
    <BottomSheet
      isOpen={isOpen}
      title="Изменить способ оплаты"
      onClose={onClose}
      zIndexClass="z-70"
    >
      <div className="flex flex-col gap-3">
        {availablePaymentMethodIds.map((methodId) => (
          <motion.button
            key={methodId}
            type="button"
            onClick={() => handleSelect(methodId)}
            whileTap={{ scale: 0.95 }}
            transition={TAB_PRESS_TRANSITION}
            className="bg-[#FFFFFF]/10 border border-[#FFFFFF]/10 rounded-[24px] p-4 flex items-center gap-3 w-full cursor-pointer"
          >
            <PaymentMethodIcon methodId={methodId} variant="picker" />
            <span className="text-white text-[16px] font-semibold leading-[130%] flex-1 text-left">
              {getPaymentMethodLabel(methodId)}
            </span>
            {activeId === methodId && (
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#139D76] shrink-0">
                <CheckmarkIcon fill="white" className="w-4 h-4" />
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </BottomSheet>
  )
}
