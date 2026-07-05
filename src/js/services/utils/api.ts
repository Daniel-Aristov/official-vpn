import axios, { isAxiosError, type InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL } from '@/js/constants/api'
import {
  invalidateSession,
  refreshAccessToken,
} from '@/js/services/authService'
import { tokenStorage } from '@/js/services/utils/tokenStorage'
import type { ApiErrorDetailDto } from '@/js/types/dto'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

let refreshPromise: Promise<string | null> | null = null

function isAuthRequest(url: string | undefined): boolean {
  return !!url?.includes('/auth/')
}

function hasSessionTokens(): boolean {
  return !!(tokenStorage.getAccessToken() && tokenStorage.getRefreshToken())
}

http.interceptors.request.use((config) => {
  if (!isAuthRequest(config.url) && !hasSessionTokens()) {
    invalidateSession()
    return Promise.reject(new ApiError(401, 'Unauthorized'))
  }

  const token = tokenStorage.getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!isAxiosError<ApiErrorDetailDto>(error)) {
      throw error
    }

    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthRequest(originalRequest.url)
    ) {
      originalRequest._retry = true

      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null
        })
      }

      const newToken = await refreshPromise
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return http(originalRequest)
      }

      invalidateSession()
    }

    const status = error.response?.status ?? 0
    const detail = error.response?.data?.detail
    const message =
      typeof detail === 'string'
        ? detail
        : (error.response?.statusText ?? error.message ?? 'Network error')

    throw new ApiError(status, message)
  },
)

export const api = {
  get: <T>(path: string) => http.get<T>(path).then((res) => res.data),
  post: <T>(path: string, body?: unknown) =>
    http.post<T>(path, body).then((res) => res.data),
  patch: <T>(path: string, body: unknown) =>
    http.patch<T>(path, body).then((res) => res.data),
  delete: (path: string) => http.delete<void>(path).then(() => undefined),
}
