import { useState } from 'react'
import { motion } from 'motion/react'
import { DisableAutoRenewalSheet } from '@/components/DisableAutoRenewalSheet'
import { PaymentMethodIcon } from '@/components/PaymentMethodIcon'
import { SegmentedTabs } from '@/components/UI/SegmentedTabs'
import { CheckmarkIcon } from '@/components/icons/CheckmarkIcon'
import { PaymentHistoryIcon } from '@/components/icons/PaymentHistoryIcon'
import { getPaymentMethodLabel } from '@/js/constants/paymentMethods'
import type { PaymentMethodId } from '@/js/types/payment'
import type { PaymentTransaction } from '@/js/types/payment'
import { useSheet } from '@/js/helpers/useSheet'
import { TAB_PRESS_TRANSITION } from '@/js/constants/motion'
import { usePayment } from '@/store/payment/usePayment'

type PaymentTab = 'methods' | 'transactions'

interface EmptyStateBlockProps {
  message: string
  minHeight?: number
  onClick?: () => void
}

function EmptyStateBlock({
  message,
  minHeight,
  onClick,
}: EmptyStateBlockProps) {
  const className =
    'bg-[#FFFFFF]/10 border border-[#FFFFFF]/10 rounded-[24px] p-4 w-full flex items-center justify-center text-white/80 text-[16px] leading-[130%] text-center'

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        style={{ minHeight }}
        className={`${className} cursor-pointer`}
      >
        <span className="max-w-[250px] mx-auto">{message}</span>
      </button>
    )
  }

  return (
    <div style={{ minHeight }} className={className}>
      <span className="max-w-[250px] mx-auto">{message}</span>
    </div>
  )
}

interface PaymentMethodItemProps {
  methodId: PaymentMethodId
  isActive: boolean
  onSelect: () => void
}

function PaymentMethodItem({
  methodId,
  isActive,
  onSelect,
}: PaymentMethodItemProps) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileTap={{ scale: 0.95 }}
      transition={TAB_PRESS_TRANSITION}
      className="bg-[#FFFFFF]/10 border border-[#FFFFFF]/10 rounded-[24px] p-4 flex items-center gap-3 w-full cursor-pointer"
    >
      <PaymentMethodIcon methodId={methodId} variant="picker" />
      <div className="flex flex-col flex-1 min-w-0 text-left">
        <span className="text-white text-[16px] font-semibold leading-[130%]">
          {getPaymentMethodLabel(methodId)}
        </span>
      </div>
      {isActive && (
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#139D76] shrink-0">
          <CheckmarkIcon fill="white" className="w-4 h-4" />
        </div>
      )}
    </motion.button>
  )
}

interface PaymentMethodsTabContentProps {
  availablePaymentMethodIds: PaymentMethodId[]
  activePaymentMethodId: PaymentMethodId
  isAutoRenewalEnabled: boolean
  onDisableClick: () => void
  onEnableClick: () => void
  onEnablePaymentMethods: () => void
  onSelectPaymentMethod: (id: PaymentMethodId) => void
}

function PaymentMethodsTabContent({
  availablePaymentMethodIds,
  activePaymentMethodId,
  isAutoRenewalEnabled,
  onDisableClick,
  onEnableClick,
  onEnablePaymentMethods,
  onSelectPaymentMethod,
}: PaymentMethodsTabContentProps) {
  return (
    <>
      {availablePaymentMethodIds.length > 0 ? (
        <div className="flex flex-col gap-3">
          {availablePaymentMethodIds.map((methodId) => (
            <PaymentMethodItem
              key={methodId}
              methodId={methodId}
              isActive={activePaymentMethodId === methodId}
              onSelect={() => onSelectPaymentMethod(methodId)}
            />
          ))}
        </div>
      ) : (
        <EmptyStateBlock
          message="У вас ещё нет добавленных способов оплаты"
          minHeight={193}
          onClick={onEnablePaymentMethods}
        />
      )}
      <motion.button
        type="button"
        onClick={isAutoRenewalEnabled ? onDisableClick : onEnableClick}
        whileTap={{ scale: 0.97 }}
        transition={TAB_PRESS_TRANSITION}
        className={`rounded-[16px] p-4 flex items-center justify-center text-white text-[16px] font-semibold leading-[130%] cursor-pointer w-full mt-4 ${
          isAutoRenewalEnabled ? 'bg-secondary' : 'bg-primary'
        }`}
      >
        {isAutoRenewalEnabled
          ? 'Отключить автопродление'
          : 'Включить автопродление'}
      </motion.button>
    </>
  )
}

const TRANSACTION_STATUS_LABELS: Record<string, string> = {
  completed: 'Завершена',
  pending: 'В обработке',
  failed: 'Ошибка',
  cancelled: 'Отменена',
}

function formatTransactionAmount(amount: number, currency: string): string {
  return `${amount.toLocaleString('ru-RU')} ${currency}`
}

function formatTransactionDate(isoDate: string): string {
  return new Date(isoDate).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatTransactionStatus(status: string): string {
  return TRANSACTION_STATUS_LABELS[status] ?? status
}

function getTransactionPaymentMethodLabel(tx: PaymentTransaction): string {
  return getPaymentMethodLabel(tx.paymentMethodId) || tx.paymentMethod
}

function TransactionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-white/50 text-[14px] leading-[130%] shrink-0">
        {label}
      </span>
      <span className="text-white text-[14px] leading-[130%] font-medium text-right break-all">
        {value}
      </span>
    </div>
  )
}

function TransactionItem({ transaction }: { transaction: PaymentTransaction }) {
  return (
    <div className="bg-[#FFFFFF]/10 border border-[#FFFFFF]/10 rounded-[24px] p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <span className="text-white font-semibold text-[16px] leading-[130%]">
          {transaction.description}
        </span>
        <span className="text-white font-bold text-[18px] leading-[130%] shrink-0">
          {formatTransactionAmount(transaction.amount, transaction.currency)}
        </span>
      </div>
      <div className="h-px bg-white/10" />
      <TransactionRow label="ID транзакции" value={transaction.id} />
      <TransactionRow label="ID заказа" value={transaction.orderId} />
      <TransactionRow
        label="Статус"
        value={formatTransactionStatus(transaction.status)}
      />
      <TransactionRow
        label="Способ оплаты"
        value={getTransactionPaymentMethodLabel(transaction)}
      />
      <TransactionRow
        label="Дата"
        value={formatTransactionDate(transaction.createdAt)}
      />
    </div>
  )
}

function TransactionsTabContent({
  transactions,
}: {
  transactions: PaymentTransaction[]
}) {
  if (transactions.length === 0) {
    return (
      <EmptyStateBlock message="У вас ещё нет транзакций" minHeight={261} />
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {transactions.map((transaction) => (
        <TransactionItem key={transaction.id} transaction={transaction} />
      ))}
    </div>
  )
}

const paymentTabs = [
  { id: 'methods' as const, label: 'Способы оплаты' },
  { id: 'transactions' as const, label: 'Транзакции' },
] as const

export function PaymentHistoryPage() {
  const [activeTab, setActiveTab] = useState<PaymentTab>('methods')
  const {
    settings,
    transactions,
    availablePaymentMethodIds,
    setAutoRenewal,
    setActivePaymentMethod,
    enablePaymentMethods,
  } = usePayment()
  const disableSheet = useSheet()

  const isAutoRenewalEnabled = settings?.isAutoRenewalEnabled ?? true
  const activePaymentMethodId = settings?.activePaymentMethodId ?? 'card'

  const handleDisableAutoRenewal = () => {
    void setAutoRenewal(false)
    disableSheet.close()
  }

  const handleEnableAutoRenewal = () => {
    void setAutoRenewal(true)
  }

  return (
    <>
      <main className="flex flex-col flex-1 p-4 gap-4 max-w-[768px] mx-auto w-full">
        <div className="rounded-[24px] p-4 flex flex-col gap-4 border border-[#FFFFFF]/10 bg-[#FFFFFF]/10">
          <div className="w-[56px] h-[56px] flex items-center justify-center rounded-[16px] bg-white/10 text-white">
            <PaymentHistoryIcon className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-white text-[24px] font-semibold">
              Способы оплаты и история
            </h1>
            <p className="text-white/80 text-[16px] leading-[130%]">
              Настройка способов оплаты для продления подписки и отслеживания
              всех транзакций
            </p>
          </div>
        </div>

        <SegmentedTabs
          tabs={paymentTabs}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as PaymentTab)}
        />

        {activeTab === 'methods' ? (
          <PaymentMethodsTabContent
            availablePaymentMethodIds={availablePaymentMethodIds}
            activePaymentMethodId={activePaymentMethodId}
            isAutoRenewalEnabled={isAutoRenewalEnabled}
            onDisableClick={disableSheet.open}
            onEnableClick={handleEnableAutoRenewal}
            onEnablePaymentMethods={() => void enablePaymentMethods()}
            onSelectPaymentMethod={(id) => void setActivePaymentMethod(id)}
          />
        ) : (
          <TransactionsTabContent transactions={transactions} />
        )}
      </main>

      <DisableAutoRenewalSheet
        isOpen={disableSheet.isOpen}
        onClose={disableSheet.close}
        onConfirm={handleDisableAutoRenewal}
      />
    </>
  )
}
