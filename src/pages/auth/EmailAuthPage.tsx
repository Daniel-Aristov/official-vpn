import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PrimaryButton } from '@/components/UI/PrimaryButton'
import { AtIcon } from '@/components/icons/AtIcon'
import { ChevronLeftIcon } from '@/components/icons/ChevronLeftIcon'
import { isValidEmail } from '@/js/helpers/validation'
import { sendEmailCode } from '@/js/services/authService'

export function EmailAuthPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [isSending, setIsSending] = useState(false)

  const trimmedEmail = email.trim()
  const isEmpty = trimmedEmail === ''
  const isValid = isValidEmail(trimmedEmail)
  const showError = !isEmpty && !isValid
  const canContinue = !isEmpty && isValid

  return (
    <main className="flex flex-col flex-1 px-4 py-10 max-w-[768px] mx-auto w-full">
      <div className="py-4">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-8 h-8 flex items-center justify-center text-white cursor-pointer"
        >
          <ChevronLeftIcon />
        </button>
      </div>

      <div className="flex flex-col flex-1 gap-6">
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-2 w-full">
              <div
                className="p-4 rounded-2xl text-white"
                style={{ background: '#5389D9' }}
              >
                <AtIcon />
              </div>
              <h2 className="text-[24px] font-bold text-white text-center leading-[130%] tracking-[-0.3px]">
                Авторизация
              </h2>
              <p className="text-[16px] text-white/50 text-center leading-[130%] max-w-[295px]">
                Используйте вашу электронную почту для авторизации
              </p>
            </div>

            <div className="w-full flex flex-col gap-2">
              <input
                type="email"
                placeholder="email@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full h-14 px-4 py-2 rounded-2xl bg-white/20 border text-white text-[16px] placeholder:text-white/50 outline-none ${
                  showError ? 'border-red-400' : 'border-white/10'
                }`}
              />
              {showError && (
                <p className="text-[14px] text-red-400 leading-[130%]">
                  Введите корректный email
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-[14px] text-white/50 text-center leading-[130%]">
            Мы отправим вам для код для подтверждения
            <br />
            вашего электронной почты
          </p>
          <PrimaryButton
            size="large"
            disabled={!canContinue || isSending}
            onClick={async () => {
              setIsSending(true)
              try {
                await sendEmailCode(trimmedEmail)
                navigate('/auth/email/verify', {
                  state: { email: trimmedEmail },
                })
              } finally {
                setIsSending(false)
              }
            }}
          >
            Продолжить
          </PrimaryButton>
        </div>
      </div>
    </main>
  )
}
