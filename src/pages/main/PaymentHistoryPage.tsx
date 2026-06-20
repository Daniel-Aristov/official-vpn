import { useRef, useState } from 'react'
import { DisableAutoRenewalSheet } from '@/components/DisableAutoRenewalSheet'
import { CheckmarkIcon } from '@/components/icons/CheckmarkIcon'
import { PaymentHistoryIcon } from '@/components/icons/PaymentHistoryIcon'
import { SBPLogoIcon } from '@/components/icons/SBPLogoIcon'

type PaymentTab = 'methods' | 'transactions'
type PaymentMethodId = 'card' | 'sbp'

interface PaymentMethod {
  id: PaymentMethodId
  cardNumber: string
  subtitle: string
}

const FAKE_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'card',
    cardNumber: '4276123456788324',
    subtitle: 'Оплата картой',
  },
  {
    id: 'sbp',
    cardNumber: '2202201234568324',
    subtitle: 'Сбербанк',
  },
]

function formatMaskedCardNumber(cardNumber: string) {
  const digits = cardNumber.replace(/\D/g, '')
  return `**** ${digits.slice(-4)}`
}

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
  method: PaymentMethod
  isActive: boolean
  onSelect: () => void
}

function PaymentMethodItem({
  method,
  isActive,
  onSelect,
}: PaymentMethodItemProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="bg-[#FFFFFF]/10 border border-[#FFFFFF]/10 rounded-[24px] p-4 flex items-center gap-3 w-full cursor-pointer"
    >
      <div className="w-[72px] h-[50px] flex items-center justify-center rounded-[8px] bg-white/10 shrink-0 text-white">
        {method.id === 'card' ? (
          <PaymentHistoryIcon className="w-6 h-6" />
        ) : (
          <SBPLogoIcon className="h-[28px] w-auto" />
        )}
      </div>
      <div className="flex flex-col flex-1 min-w-0 text-left">
        <span className="text-white text-[16px] font-semibold leading-[130%]">
          {formatMaskedCardNumber(method.cardNumber)}
        </span>
        <span className="text-[#A5A6A7] text-[14px] leading-[110%]">
          {method.subtitle}
        </span>
      </div>
      {isActive && (
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#139D76] shrink-0">
          <CheckmarkIcon fill="white" className="w-4 h-4" />
        </div>
      )}
    </button>
  )
}

interface PaymentMethodsTabContentProps {
  isAutoRenewalEnabled: boolean
  onDisableClick: () => void
  onEnableClick: () => void
}

function PaymentMethodsTabContent({
  isAutoRenewalEnabled,
  onDisableClick,
  onEnableClick,
}: PaymentMethodsTabContentProps) {
  const [hasPaymentMethods, setHasPaymentMethods] = useState(false)
  const [activePaymentMethodId, setActivePaymentMethodId] =
    useState<PaymentMethodId>('card')

  return (
    <>
      {hasPaymentMethods ? (
        <div className="flex flex-col gap-3">
          {FAKE_PAYMENT_METHODS.map((method) => (
            <PaymentMethodItem
              key={method.id}
              method={method}
              isActive={activePaymentMethodId === method.id}
              onSelect={() => setActivePaymentMethodId(method.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyStateBlock
          message="У вас ещё нет добавленных способов оплаты"
          minHeight={193}
          onClick={() => setHasPaymentMethods(true)}
        />
      )}
      <button
        type="button"
        onClick={isAutoRenewalEnabled ? onDisableClick : onEnableClick}
        className={`rounded-[16px] p-4 flex items-center justify-center text-white text-[16px] font-semibold leading-[130%] cursor-pointer w-full mt-4 ${
          isAutoRenewalEnabled ? 'bg-secondary' : 'bg-primary'
        }`}
      >
        {isAutoRenewalEnabled
          ? 'Отключить автопродление'
          : 'Включить автопродление'}
      </button>
    </>
  )
}

function TransactionsTabContent() {
  return <EmptyStateBlock message="У вас ещё нет транзакций" minHeight={261} />
}

const paymentTabs = [
  { id: 'methods' as const, label: 'Способы оплаты' },
  { id: 'transactions' as const, label: 'Транзакции' },
] as const

const SHEET_ANIMATION_MS = 300

export function PaymentHistoryPage() {
  const [activeTab, setActiveTab] = useState<PaymentTab>('methods')
  const [isAutoRenewalEnabled, setIsAutoRenewalEnabled] = useState(true)
  const [isSheetMounted, setIsSheetMounted] = useState(false)
  const [isSheetVisible, setIsSheetVisible] = useState(false)
  const sheetCloseTimerRef = useRef<number | null>(null)
  const activeIndex = paymentTabs.findIndex((tab) => tab.id === activeTab)

  const openDisableSheet = () => {
    if (sheetCloseTimerRef.current !== null) {
      window.clearTimeout(sheetCloseTimerRef.current)
      sheetCloseTimerRef.current = null
    }

    setIsSheetMounted(true)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsSheetVisible(true))
    })
  }

  const closeDisableSheet = () => {
    setIsSheetVisible(false)
    sheetCloseTimerRef.current = window.setTimeout(() => {
      setIsSheetMounted(false)
      sheetCloseTimerRef.current = null
    }, SHEET_ANIMATION_MS)
  }

  return (
    <>
      <main className="flex flex-col flex-1 p-4 gap-4 max-w-[768px] mx-auto w-full">
        <div
          className="rounded-[24px] p-4 flex flex-col gap-4 border border-[#FFFFFF]/10"
          style={{
            background:
              'linear-gradient(135deg, rgba(37, 93, 224, 0.28) 0%, rgba(19, 157, 118, 0.12) 100%), rgba(0, 0, 0, 0.4)',
          }}
        >
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

        <div className="relative flex w-full rounded-full p-1 bg-[#FFFFFF]/10 border border-[#FFFFFF]/10 overflow-hidden">
          <span
            className="absolute top-1 bottom-1 left-1 rounded-full bg-white/10"
            style={{
              width: `calc((100% - 8px) / ${paymentTabs.length})`,
              transform: `translateX(calc(${activeIndex} * 100%))`,
              transition:
                'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          />
          {paymentTabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`relative flex-1 min-w-0 py-3 rounded-full text-[16px] font-semibold cursor-pointer transition-colors duration-300 ${
                activeTab === id ? 'text-white' : 'text-white/40'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'methods' ? (
          <PaymentMethodsTabContent
            isAutoRenewalEnabled={isAutoRenewalEnabled}
            onDisableClick={openDisableSheet}
            onEnableClick={() => setIsAutoRenewalEnabled(true)}
          />
        ) : (
          <TransactionsTabContent />
        )}
      </main>

      <DisableAutoRenewalSheet
        isMounted={isSheetMounted}
        isVisible={isSheetVisible}
        onClose={closeDisableSheet}
        onConfirm={() => setIsAutoRenewalEnabled(false)}
      />
    </>
  )
}
