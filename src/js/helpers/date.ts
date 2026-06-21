export function formatSubscriptionEndDate(months: number): string {
  const date = new Date()
  date.setMonth(date.getMonth() + months)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
