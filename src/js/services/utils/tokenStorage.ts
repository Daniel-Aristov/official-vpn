const ACCESS_TOKEN_KEY = 'vpn_access_token'
const REFRESH_TOKEN_KEY = 'vpn_refresh_token'
const EMAIL_KEY = 'vpn_email'

export const tokenStorage = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  getEmail(): string | null {
    return localStorage.getItem(EMAIL_KEY)
  },

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  },

  setEmail(email: string): void {
    localStorage.setItem(EMAIL_KEY, email)
  },

  clear(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(EMAIL_KEY)
  },

  hasTokens(): boolean {
    return !!(
      localStorage.getItem(ACCESS_TOKEN_KEY) &&
      localStorage.getItem(REFRESH_TOKEN_KEY)
    )
  },
}
