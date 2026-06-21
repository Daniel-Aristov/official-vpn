import axios, { isAxiosError } from 'axios'
import { API_BASE_URL } from '@/js/constants/api'

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

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (isAxiosError(error)) {
      const status = error.response?.status ?? 0
      const message =
        error.response?.statusText ?? error.message ?? 'Network error'
      throw new ApiError(status, message)
    }
    throw error
  },
)

export const api = {
  get: <T>(path: string) => http.get<T>(path).then((res) => res.data),
  post: <T>(path: string, body: unknown) =>
    http.post<T>(path, body).then((res) => res.data),
  patch: <T>(path: string, body: unknown) =>
    http.patch<T>(path, body).then((res) => res.data),
  delete: (path: string) => http.delete<void>(path).then(() => undefined),
}
