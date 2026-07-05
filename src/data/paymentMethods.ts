import type { PaymentMethodsResponseDto } from '@/js/types/dto'

export type PaymentMethodId = 'card' | 'sbp' | 'usdt'

export interface PaymentMethod {
  id: PaymentMethodId
  cardNumber: string
  subtitle: string
  checkoutLabel: string
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'card',
    cardNumber: '4276123456788324',
    subtitle: 'Оплата картой',
    checkoutLabel: 'Оплата картой',
  },
  {
    id: 'sbp',
    cardNumber: '2202201234568324',
    subtitle: 'Сбербанк',
    checkoutLabel: 'Оплата СБП',
  },
  {
    id: 'usdt',
    cardNumber: '',
    subtitle: 'Оплата USDT',
    checkoutLabel: 'Оплата USDT',
  },
]

const PAYMENT_METHOD_API_KEYS: Record<
  PaymentMethodId,
  keyof PaymentMethodsResponseDto
> = {
  card: 'card',
  sbp: 'sbp',
  usdt: 'crypto',
}

export function getAvailablePaymentMethods(
  methods?: PaymentMethodsResponseDto,
): PaymentMethod[] {
  if (!methods) return []

  return PAYMENT_METHODS.filter(
    (method) => methods[PAYMENT_METHOD_API_KEYS[method.id]],
  )
}

export function resolvePaymentMethodId(
  preferred: PaymentMethodId | undefined | null,
  methods?: PaymentMethodsResponseDto,
): PaymentMethodId {
  const available = getAvailablePaymentMethods(methods)

  if (preferred && available.some((method) => method.id === preferred)) {
    return preferred
  }

  return available[0]?.id ?? 'sbp'
}

export function formatMaskedCardNumber(cardNumber: string) {
  const digits = cardNumber.replace(/\D/g, '')
  return `**** ${digits.slice(-4)}`
}
