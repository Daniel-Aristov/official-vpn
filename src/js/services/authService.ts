import axios from 'axios'
import { API_BASE_URL, apiEndpoints } from '@/js/constants/api'
import { api } from '@/js/services/utils/api'
import { tokenStorage } from '@/js/services/utils/tokenStorage'
import type {
  LoginRequestDto,
  LoginResponseDto,
  OtpRequestDto,
  TokenResponseDto,
} from '@/js/types/dto'

type SessionInvalidatedListener = () => void

const sessionInvalidatedListeners = new Set<SessionInvalidatedListener>()

export function onSessionInvalidated(
  listener: SessionInvalidatedListener,
): () => void {
  sessionInvalidatedListeners.add(listener)
  return () => {
    sessionInvalidatedListeners.delete(listener)
  }
}

export function invalidateSession(): void {
  tokenStorage.clear()
  sessionInvalidatedListeners.forEach((listener) => listener())
}

export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokenStorage.getRefreshToken()
  if (!refreshToken) return null

  try {
    const { data } = await axios.post<TokenResponseDto>(
      `${API_BASE_URL}${apiEndpoints.auth.refresh}`,
      { refresh_token: refreshToken },
    )
    tokenStorage.setTokens(data.access_token, data.refresh_token)
    return data.access_token
  } catch {
    invalidateSession()
    return null
  }
}

export async function sendEmailCode(email: string): Promise<void> {
  await api.post<LoginResponseDto>(apiEndpoints.auth.login, {
    email,
  } satisfies LoginRequestDto)
}

export async function verifyEmailCode(
  email: string,
  code: string,
): Promise<{ email: string }> {
  const data = await api.post<TokenResponseDto>(apiEndpoints.auth.otp, {
    email,
    otp_code: Number(code),
  } satisfies OtpRequestDto)

  tokenStorage.setTokens(data.access_token, data.refresh_token)
  tokenStorage.setEmail(email)

  return { email }
}

export function logout(): void {
  invalidateSession()
}

export function isAuthenticated(): boolean {
  return tokenStorage.hasTokens()
}

export function getStoredEmail(): string | null {
  return tokenStorage.getEmail()
}
