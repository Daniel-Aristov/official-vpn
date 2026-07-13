import { useCallback, useState } from 'react'
import type { ReactNode } from 'react'
import type { InstallPlatform } from '@/js/constants/urls'
import { fetchDownloadLinks } from '@/js/services/downloadService'
import { mapDownloadLinksToPlatforms } from '@/js/services/utils/mappers'
import { DownloadContext } from '@/store/download/downloadContext'

export function DownloadProvider({ children }: { children: ReactNode }) {
  const [downloadLinks, setDownloadLinks] = useState<
    Partial<Record<InstallPlatform, string>>
  >({})
  const [isLoading, setIsLoading] = useState(false)

  const fetchDownloadLinksAction = useCallback(async () => {
    setIsLoading(true)
    try {
      const links = await fetchDownloadLinks()
      setDownloadLinks(mapDownloadLinksToPlatforms(links))
    } catch {
      // fallback links from constants are used in InstallSheet
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <DownloadContext.Provider
      value={{
        downloadLinks,
        isLoading,
        fetchDownloadLinks: fetchDownloadLinksAction,
      }}
    >
      {children}
    </DownloadContext.Provider>
  )
}
