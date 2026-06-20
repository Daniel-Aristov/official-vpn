import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronLeftIcon } from '@/components/icons/ChevronLeftIcon'
import { PasswordIcon } from '@/components/icons/PasswordIcon'
import { useAuth } from '@/store/useAuth'

const CODE_LENGTH = 6
const RESEND_SECONDS = 42

export function EmailVerifyPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setEmail } = useAuth()
  const email =
    (location.state as { email?: string } | null)?.email ??
    'something12@gmail.com'

  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''))
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (secondsLeft <= 0) return

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => prev - 1)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [secondsLeft])

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...code]
    next[index] = digit
    setCode(next)

    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, key: string) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, CODE_LENGTH).split('')
    if (!digits.length) return

    const next = [...code]
    digits.forEach((digit, i) => {
      next[i] = digit
    })
    setCode(next)
    inputRefs.current[Math.min(digits.length, CODE_LENGTH - 1)]?.focus()
  }

  const handleResend = () => {
    setSecondsLeft(RESEND_SECONDS)
  }

  return (
    <main className="flex flex-col flex-1 px-4 py-10 max-w-[768px] mx-auto w-full">
      <div className="py-4">
        <button
          type="button"
          onClick={() => navigate('/auth/email')}
          className="w-8 h-8 flex items-center justify-center text-white cursor-pointer"
        >
          <ChevronLeftIcon />
        </button>
      </div>

      <div className="flex flex-col flex-1 gap-6">
        <div className="flex flex-col items-center gap-4 flex-1">
          <div className="flex flex-col items-center gap-2 w-full">
            <div
              className="p-4 rounded-2xl text-white"
              style={{ background: '#5389D9' }}
            >
              <PasswordIcon />
            </div>
            <h2 className="text-[24px] font-bold text-white text-center leading-[130%] tracking-[-0.3px]">
              Код подтверждения
            </h2>
            <p className="text-[16px] text-white/50 text-center leading-[130%] max-w-[295px]">
              Мы вам отправили код
              <br />
              на почту{' '}
              <span className="text-white font-semibold">{email}</span>
            </p>
          </div>

          <div className="flex gap-[10px]">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e.key)}
                onPaste={(e) => {
                  e.preventDefault()
                  handlePaste(e.clipboardData.getData('text'))
                }}
                className="w-11 h-14 px-4 py-2 rounded-2xl bg-white/20 border border-white/10 text-white text-[16px] text-center outline-none"
              />
            ))}
          </div>

          {secondsLeft > 0 ? (
            <p className="text-[16px] text-white/50 text-center leading-[130%]">
              Отправить код ещё раз через{' '}
              <span className="text-white">{secondsLeft}с</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-[16px] text-white text-center leading-[130%] cursor-pointer bg-transparent border-0 p-0"
            >
              Отправить код ещё раз
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            setEmail(email)
            navigate('/main')
          }}
          className="w-full py-[16px] rounded-2xl bg-primary text-white font-semibold text-[16px] leading-[20px] cursor-pointer"
        >
          Авторизоваться
        </button>
      </div>
    </main>
  )
}
