/** Ответы JSONPlaceholder — используются только для маппинга в доменные типы. */

export interface PlaceholderUser {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
}

export interface PlaceholderPost {
  userId: number
  id: number
  title: string
  body: string
}

export interface PlaceholderTodo {
  userId: number
  id: number
  title: string
  completed: boolean
}
