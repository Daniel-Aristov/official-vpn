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

export function formatMaskedCardNumber(cardNumber: string) {
  const digits = cardNumber.replace(/\D/g, '')
  return `**** ${digits.slice(-4)}`
}
