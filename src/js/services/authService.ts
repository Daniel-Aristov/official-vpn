import { apiEndpoints } from '@/js/constants/api'
import { api } from '@/js/services/api'
import type { PlaceholderPost } from '@/js/types/placeholder'

export async function sendEmailCode(email: string): Promise<{ success: boolean }> {
  await api.post<PlaceholderPost>(apiEndpoints.posts, {
    title: 'send_email_code',
    body: email,
    userId: 1,
  })
  return { success: true }
}

export async function verifyEmailCode(
  email: string,
  code: string,
): Promise<{ success: boolean; email: string }> {
  await api.post<PlaceholderPost>(apiEndpoints.posts, {
    title: 'verify_email_code',
    body: JSON.stringify({ email, code }),
    userId: 1,
  })
  return { success: true, email }
}
