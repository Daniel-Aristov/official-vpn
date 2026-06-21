export const PERIODS = [
  { id: '1m', label: '1 месяц', price: 199, description: 'Оплата за 1 месяц' },
  {
    id: '3m',
    label: '3 месяца',
    price: 597,
    description: 'Оплата за 3 месяца',
  },
  {
    id: '6m',
    label: '6 месяцев',
    price: 1194,
    description: 'Оплата за 6 месяцев',
  },
  { id: '1y', label: '1 год', price: 2388, description: 'Оплата за 1 год' },
]

export const PERIOD_MONTHS: Record<string, number> = {
  '1m': 1,
  '3m': 3,
  '6m': 6,
  '1y': 12,
}

export const BASIC_MONTHLY_PRICE = PERIODS[0].price
export const PRO_MONTHLY_PRICE = 299
export const YEAR_PRICE = 2388

export const DEVICE_OPTIONS = [3, 4, 5, 6]
export const PRO_DEVICE_OPTIONS = [6, 7, 8, 9]

export const PRICE_PER_EXTRA_DEVICE = 60
export const PRICE_PER_SLOT_PERIOD = 60
export const PRICE_PER_SLOT_MONTHLY = 80
export const BASE_MONTHLY_SLOTS = 259
