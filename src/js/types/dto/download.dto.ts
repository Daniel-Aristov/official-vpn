export type DownloadOsDto = 'ios' | 'android' | 'windows' | 'macos'

export interface DownloadLinkDto {
  os: DownloadOsDto
  link: string
}
