export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export const apiEndpoints = {
  health: '/health',
  auth: {
    login: '/auth/login',
    otp: '/auth/otp',
    refresh: '/auth/refresh',
  },
  users: {
    me: '/users/me',
    settings: '/users/me/settings',
  },
  subscriptions: {
    pricing: '/subscriptions/pricing',
    me: '/subscriptions/me',
    create: '/subscriptions/create',
    devices: '/subscriptions/me/devices',
    device: (hwid: string) => `/subscriptions/me/devices/${hwid}`,
    addSlots: '/subscriptions/me/add-slots',
  },
  download: {
    links: '/download/link',
    installer: (os: string) => `/download/installer?os=${os}`,
  },
  payments: {
    methods: '/payments/methods',
    create: '/payments/create',
    me: '/payments/me',
    byId: (paymentId: string) => `/payments/me/${paymentId}`,
  },
} as const
