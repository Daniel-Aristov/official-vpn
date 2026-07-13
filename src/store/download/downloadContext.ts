import { createContext } from 'react'
import type { InstallPlatform } from '@/js/constants/urls'

export interface DownloadState {
  downloadLinks: Partial<Record<InstallPlatform, string>>
  isLoading: boolean
  fetchDownloadLinks: () => Promise<void>
}

export const DownloadContext = createContext<DownloadState | null>(null)
