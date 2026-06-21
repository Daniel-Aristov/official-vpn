export interface User {
  id: string
  email: string
  isBlocked: boolean
  isTelegramLinked: boolean
  telegramId: string | null
  username: string | null
}
