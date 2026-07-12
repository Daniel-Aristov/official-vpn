import { apiEndpoints } from '@/js/constants/api'
import { api } from '@/js/services/utils/api'
import { fetchSubscriptionMe } from '@/js/services/subscriptionService'
import {
  mapPaymentMethodsToSettings,
  mapPaymentTransactionDtoToDomain,
} from '@/js/services/utils/mappers'
import type {
  CreatePaymentRequestDto,
  CreatePaymentResponseDto,
  PaymentMethodsResponseDto,
  PaymentTransactionDto,
  PaymentsListQueryDto,
  PaymentsListResponseDto,
  UserSettingsPatchRequestDto,
  UserSettingsPatchResponseDto,
} from '@/js/types/dto'
import type { PaymentSettings, PaymentTransaction } from '@/js/types/payment'
import type { PaymentMethodId } from '@/js/types/payment'

const PAYMENT_POLL_INTERVAL_MS = 10_000
const PAYMENT_POLL_DURATION_MS = 120_000
const NON_FINAL_PAYMENT_STATUSES = new Set(['pending'])

let activeMethodOverride: PaymentMethodId | undefined

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export function isPaymentStatusFinal(status: string): boolean {
  return !NON_FINAL_PAYMENT_STATUSES.has(status)
}

export async function fetchPaymentSettings(): Promise<PaymentSettings> {
  const [methods, subscription] = await Promise.all([
    api.get<PaymentMethodsResponseDto>(apiEndpoints.payments.methods),
    fetchSubscriptionMe(),
  ])

  return mapPaymentMethodsToSettings(
    methods,
    subscription,
    activeMethodOverride,
  )
}

export async function fetchTransactions(
  query: PaymentsListQueryDto = {},
): Promise<PaymentTransaction[]> {
  const params = new URLSearchParams()

  if (query.page !== undefined) params.set('page', String(query.page))
  if (query.size !== undefined) params.set('size', String(query.size))
  if (query.sort) params.set('sort', query.sort)
  if (query.status) params.set('status', query.status)
  if (query.start_date) params.set('start_date', query.start_date)
  if (query.end_date) params.set('end_date', query.end_date)
  if (query.min_amount !== undefined && query.min_amount !== null) {
    params.set('min_amount', String(query.min_amount))
  }
  if (query.max_amount !== undefined && query.max_amount !== null) {
    params.set('max_amount', String(query.max_amount))
  }

  const queryString = params.toString()
  const path = queryString
    ? `${apiEndpoints.payments.me}?${queryString}`
    : apiEndpoints.payments.me

  const data = await api.get<PaymentsListResponseDto>(path)
  return data.transactions.map(mapPaymentTransactionDtoToDomain)
}

export async function fetchTransactionById(
  paymentId: string,
): Promise<PaymentTransaction> {
  const tx = await api.get<PaymentTransactionDto>(
    apiEndpoints.payments.byId(paymentId),
  )
  return mapPaymentTransactionDtoToDomain(tx)
}

export async function pollPaymentStatus(
  paymentId: string,
  onUpdate?: (transaction: PaymentTransaction) => void,
): Promise<PaymentTransaction | null> {
  const startedAt = Date.now()
  let lastResult: PaymentTransaction | null = null

  while (Date.now() - startedAt < PAYMENT_POLL_DURATION_MS) {
    try {
      const transaction = await fetchTransactionById(paymentId)
      lastResult = transaction
      onUpdate?.(transaction)

      if (isPaymentStatusFinal(transaction.status)) {
        return transaction
      }
    } catch {
      // Продолжаем polling при временных ошибках сети/API.
    }

    const elapsed = Date.now() - startedAt
    const remaining = PAYMENT_POLL_DURATION_MS - elapsed
    if (remaining <= 0) break

    await sleep(Math.min(PAYMENT_POLL_INTERVAL_MS, remaining))
  }

  return lastResult
}

export async function createPayment(
  payload: CreatePaymentRequestDto,
): Promise<CreatePaymentResponseDto> {
  return api.post<CreatePaymentResponseDto>(
    apiEndpoints.payments.create,
    payload,
  )
}

export async function setAutoRenewal(
  enabled: boolean,
  current: PaymentSettings,
): Promise<PaymentSettings> {
  const response = await api.patch<UserSettingsPatchResponseDto>(
    apiEndpoints.users.settings,
    { auto_renew: enabled } satisfies UserSettingsPatchRequestDto,
  )

  return {
    ...current,
    isAutoRenewalEnabled: response.auto_renew,
  }
}

export function applyActivePaymentMethod(
  methodId: PaymentMethodId,
  current: PaymentSettings,
): PaymentSettings {
  activeMethodOverride = methodId

  return {
    ...current,
    activePaymentMethodId: methodId,
  }
}

export async function enablePaymentMethods(): Promise<PaymentSettings> {
  return fetchPaymentSettings()
}
