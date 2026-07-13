import { useContext } from 'react'
import {
  DownloadContext,
  type DownloadState,
} from '@/store/download/downloadContext'

export function useDownload(): DownloadState {
  const ctx = useContext(DownloadContext)
  if (!ctx) throw new Error('useDownload must be used within DownloadProvider')
  return ctx
}
