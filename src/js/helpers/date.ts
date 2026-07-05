export function getTrialEndDateIso(): string {
  const date = new Date()
  date.setDate(date.getDate() + 7)
  return date.toISOString().slice(0, 10)
}

export function formatSubscriptionEndDate(months: number): string {
  const date = new Date()
  date.setMonth(date.getMonth() + months)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function getDaysWord(days: number): string {
  const mod10 = days % 10
  const mod100 = days % 100

  if (mod10 === 1 && mod100 !== 11) {
    return 'день'
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return 'дня'
  }

  return 'дней'
}

/** Фраза для баннера «Подписка закончится …» при days_left от 1 до 7. */
export function formatSubscriptionExpiresIn(daysLeft: number): string {
  if (daysLeft === 1) {
    return 'завтра'
  }

  return `через ${daysLeft} ${getDaysWord(daysLeft)}`
}

export function formatDateTimeUtc(isoDate: string): string {
  return new Date(isoDate)
    .toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
    })
    .replace(',', '')
}
