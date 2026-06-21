import { apiEndpoints } from '@/js/constants/api'
import { api } from '@/js/services/api'
import { mapPlaceholderTodoToPayment } from '@/js/services/mappers'
import type { PlaceholderPost, PlaceholderTodo } from '@/js/types/placeholder'
import type { PaymentSettings, PaymentTransaction } from '@/js/types/payment'
import type { PaymentMethodId } from '@/data/paymentMethods'

let paymentCache: Partial<PaymentSettings> = {}

export async function fetchPaymentSettings(): Promise<PaymentSettings> {
  const todo = await api.get<PlaceholderTodo>(apiEndpoints.todo())
  const settings = { ...mapPlaceholderTodoToPayment(todo), ...paymentCache }
  paymentCache = settings
  return settings
}

export async function fetchTransactions(): Promise<PaymentTransaction[]> {
  await api.get<PlaceholderPost[]>(`${apiEndpoints.posts}?_limit=1`)
  return []
}

export async function setAutoRenewal(enabled: boolean): Promise<PaymentSettings> {
  await api.patch<PlaceholderTodo>(apiEndpoints.todo(), { completed: enabled })

  const current = { ...mapPlaceholderTodoToPayment({ id: 1, userId: 1, title: '', completed: enabled }), ...paymentCache }
  paymentCache = { ...current, isAutoRenewalEnabled: enabled }
  return paymentCache as PaymentSettings
}

export async function setActivePaymentMethod(
  methodId: PaymentMethodId,
): Promise<PaymentSettings> {
  await api.post(apiEndpoints.posts, {
    title: 'set_payment_method',
    body: methodId,
    userId: 1,
  })

  paymentCache = {
    ...paymentCache,
    activePaymentMethodId: methodId,
    hasPaymentMethods: true,
  }

  return paymentCache as PaymentSettings
}

export async function enablePaymentMethods(): Promise<PaymentSettings> {
  await api.post(apiEndpoints.posts, {
    title: 'enable_payment_methods',
    body: 'true',
    userId: 1,
  })

  paymentCache = { ...paymentCache, hasPaymentMethods: true }
  return paymentCache as PaymentSettings
}
