import type { PaymentMethodsResponseDto } from '@/js/types/dto'
import type { PaymentMethodId } from '@/js/types/payment'

export const PAYMENT_METHOD_LABELS: Record<PaymentMethodId, string> = {
  card: 'Оплата картой',
  sbp: 'Оплата СБП',
  usdt: 'Оплата USDT',
  wallet: 'Wallet',
}

export const PAYMENT_METHOD_ORDER: PaymentMethodId[] = [
  'card',
  'sbp',
  'usdt',
  'wallet',
]

const PAYMENT_METHOD_API_KEYS: Record<
  PaymentMethodId,
  keyof PaymentMethodsResponseDto
> = {
  card: 'card',
  sbp: 'sbp',
  usdt: 'crypto',
  wallet: 'wallet',
}

export function getPaymentMethodLabel(id: PaymentMethodId): string {
  return PAYMENT_METHOD_LABELS[id]
}

export function getAvailablePaymentMethodIds(
  methods?: PaymentMethodsResponseDto,
): PaymentMethodId[] {
  if (!methods) return []

  return PAYMENT_METHOD_ORDER.filter(
    (id) => methods[PAYMENT_METHOD_API_KEYS[id]],
  )
}

export function resolvePaymentMethodId(
  preferred: PaymentMethodId | undefined | null,
  methods?: PaymentMethodsResponseDto,
): PaymentMethodId {
  const available = getAvailablePaymentMethodIds(methods)

  if (preferred && available.includes(preferred)) {
    return preferred
  }

  return available[0] ?? 'sbp'
}

export function mapPaymentMethodIdToApi(methodId: PaymentMethodId): string {
  if (methodId === 'usdt') return 'crypto'
  return methodId
}

export function mapPaymentMethodToId(method: string | null): PaymentMethodId {
  if (method === 'card') return 'card'
  if (method === 'sbp') return 'sbp'
  if (method === 'crypto' || method === 'usdt') return 'usdt'
  if (method === 'wallet') return 'wallet'
  return 'sbp'
}
