import type { InstallPlatform } from '@/js/constants/urls'

export const INSTALL_PLATFORMS: InstallPlatform[] = [
  'IOS',
  'Android',
  'Windows',
  'Macbook',
]

export const SETUP_PLATFORM_LABELS: Record<InstallPlatform, string> = {
  IOS: 'IOS',
  Android: 'Android',
  Windows: 'Windows',
  Macbook: 'MacOS',
}

export function detectCurrentDevice(): InstallPlatform {
  const ua = navigator.userAgent
  if (/iPhone|iPad|iPod/.test(ua)) return 'IOS'
  if (/Android/.test(ua)) return 'Android'
  if (/Win/.test(ua)) return 'Windows'
  if (/Mac/.test(ua)) return 'Macbook'
  return 'IOS'
}

export type DevicePlatformKind =
  | 'ios'
  | 'android'
  | 'windows'
  | 'mac'
  | 'unknown'

export function getDevicePlatformKind(platform: string): DevicePlatformKind {
  const normalized = platform.toLowerCase()

  if (normalized.startsWith('ios')) return 'ios'
  if (normalized.startsWith('android')) return 'android'
  if (normalized.startsWith('windows')) return 'windows'
  if (normalized.startsWith('mac')) return 'mac'

  return 'unknown'
}
