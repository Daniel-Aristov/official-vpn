export interface LoginRequestDto {
  email: string
}

export interface LoginResponseDto {
  'email-otp': number
}

export interface OtpRequestDto {
  email: string
  otp_code: number
}

export interface RefreshTokenRequestDto {
  refresh_token: string
}

export interface TokenResponseDto {
  access_token: string
  refresh_token: string
  token_type: string
}
