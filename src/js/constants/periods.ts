import type { SubscriptionPeriodDto } from '@/js/types/dto'

export const UI_PERIOD_TO_API: Record<string, SubscriptionPeriodDto> = {
  '1m': '1_month',
  '3m': '3_months',
  '6m': '6_months',
  '1y': '1_year',
}

export const PERIOD_LABELS: Record<string, { label: string; description: string }> =
  {
    '1m': { label: '1 месяц', description: 'Оплата за 1 месяц' },
    '3m': { label: '3 месяца', description: 'Оплата за 3 месяца' },
    '6m': { label: '6 месяцев', description: 'Оплата за 6 месяцев' },
    '1y': { label: '1 год', description: 'Оплата за 1 год' },
  }

export const UI_PERIOD_ORDER = ['1m', '3m', '6m', '1y'] as const

export const PRICING_PERIOD_TO_UI: Record<
  keyof import('@/js/types/dto').TariffPeriodsDto,
  (typeof UI_PERIOD_ORDER)[number]
> = {
  one_month: '1m',
  three_months: '3m',
  six_months: '6m',
  one_year: '1y',
}
