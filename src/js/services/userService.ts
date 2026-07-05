import { apiEndpoints } from '@/js/constants/api'
import { api } from '@/js/services/utils/api'
import { mapUserDtoToDomain } from '@/js/services/utils/mappers'
import type {
  UserMeResponseDto,
  UserSettingsPatchRequestDto,
  UserSettingsPatchResponseDto,
} from '@/js/types/dto'
import type { User } from '@/js/types/user'

let userMeRequest: Promise<UserMeResponseDto> | null = null

export async function fetchUserMeDto(): Promise<UserMeResponseDto> {
  userMeRequest ??= api
    .get<UserMeResponseDto>(apiEndpoints.users.me)
    .finally(() => {
      userMeRequest = null
    })

  return userMeRequest
}

export async function fetchUser(): Promise<User> {
  const raw = await fetchUserMeDto()
  return mapUserDtoToDomain(raw)
}

export async function updateAutoRenew(
  autoRenew: boolean,
): Promise<UserSettingsPatchResponseDto> {
  return api.patch<UserSettingsPatchResponseDto>(
    apiEndpoints.users.settings,
    { auto_renew: autoRenew } satisfies UserSettingsPatchRequestDto,
  )
}

export async function linkTelegram(): Promise<User> {
  return fetchUser()
}
