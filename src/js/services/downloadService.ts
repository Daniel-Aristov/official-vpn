import { apiEndpoints } from '@/js/constants/api'
import { api } from '@/js/services/utils/api'
import type { DownloadLinkDto, DownloadOsDto } from '@/js/types/dto'

let downloadLinksRequest: Promise<DownloadLinkDto[]> | null = null

export async function fetchDownloadLinks(): Promise<DownloadLinkDto[]> {
  downloadLinksRequest ??= api
    .get<DownloadLinkDto[]>(apiEndpoints.download.links)
    .finally(() => {
      downloadLinksRequest = null
    })

  return downloadLinksRequest
}

export async function fetchInstallerLink(os: DownloadOsDto): Promise<DownloadLinkDto> {
  return api.get<DownloadLinkDto>(apiEndpoints.download.installer(os))
}

export async function checkHealth(): Promise<boolean> {
  try {
    const data = await api.get<{ status: string }>(apiEndpoints.health)
    return data.status === 'ok'
  } catch {
    return false
  }
}
