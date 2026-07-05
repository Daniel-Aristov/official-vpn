export interface PaymentMethodsResponseDto {
  card: boolean
  sbp: boolean
  crypto: boolean
  wallet: boolean
}

export interface CreatePaymentRequestDto {
  order_id: string
  amount: number
  currency: string
  description: string | null
  return_url: string
  cancel_url: string | null
}

export interface CreatePaymentResponseDto {
  payment_id: string
  order_id: string
  payment_url: string
  status: string
}

export interface PaymentTransactionDto {
  id: string
  order_id: string
  amount: number
  currency: string
  status: string
  description: string
  payment_method: string
  created_at: string
}

export interface PaymentsListResponseDto {
  transactions: PaymentTransactionDto[]
  page: number
  size: number
  total_elements: number
  total_pages: number
  last: boolean
}

export interface PaymentsListQueryDto {
  page?: number
  size?: number
  sort?: string
  status?: string | null
  start_date?: string | null
  end_date?: string | null
  min_amount?: number | null
  max_amount?: number | null
}
