export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const apiEndpoints = {
  user: (id = 1) => `/users/${id}`,
  posts: '/posts',
  post: (id: number | string) => `/posts/${id}`,
  todo: (id = 1) => `/todos/${id}`,
} as const
