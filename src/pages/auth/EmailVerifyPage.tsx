import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ChevronLeftIcon } from '@/components/icons/ChevronLeftIcon'
import { PasswordIcon } from '@/components/icons/PasswordIcon'
import { PrimaryButton } from '@/components/UI/PrimaryButton'
import { FADE_TRANSITION, TAB_PRESS_TRANSITION } from '@/js/constants/motion'
import { useAuth } from '@/store/auth/useAuth'

const CODE_LENGTH = 6
const RESEND_SECONDS = 42

export function EmailVerifyPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { verifyEmailCode, resendEmailCode, isLoading } = useAuth()
  const email =
    (location.state as { email?: string } | null)?.email ??
    'something12@gmail.com'

  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''))
  const [codeError, setCodeError] = useState<string | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [pressedIndex, setPressedIndex] = useState<number | null>(null)

  useEffect(() => {
    if (secondsLeft <= 0) return

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => prev - 1)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [secondsLeft])

  const handleChange = (index: number, value: string) => {
    setCodeError(null)
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
    setCodeError(null)
    const digits = text.replace(/\D/g, '').slice(0, CODE_LENGTH).split('')
    if (!digits.length) return

    const next = [...code]
    digits.forEach((digit, i) => {
      next[i] = digit
    })
    setCode(next)
    inputRefs.current[Math.min(digits.length, CODE_LENGTH - 1)]?.focus()
  }

  const enteredCode = code.join('')
  const canSubmit = enteredCode.length === CODE_LENGTH

  const handleResend = async () => {
    setSecondsLeft(RESEND_SECONDS)
    setCode(Array(CODE_LENGTH).fill(''))
    setCodeError(null)
    await resendEmailCode(email)
  }

  const handleLogin = async () => {
    setCodeError(null)
    const success = await verifyEmailCode(email, enteredCode)
    if (success) {
      navigate('/main')
    } else {
      setCodeError('Код некорректный')
    }
  }

  return (
    <main className="flex flex-col flex-1 px-4 pb-10 pt-4 max-w-[768px] mx-auto w-full">
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
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 28 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ ...FADE_TRANSITION, delay: 0.1 }}
              className="p-4 rounded-[16px] bg-accent-blue"
            >
              <PasswordIcon />
            </motion.div>
            <motion.div
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...FADE_TRANSITION, delay: 0.18 }}
            >
              <h2 className="text-[24px] font-bold text-white text-center leading-[130%] tracking-[-0.3px]">
                Код подтверждения
              </h2>
              <p className="text-[16px] text-white-50 text-center leading-[130%] max-w-[295px]">
                Мы вам отправили код
                <br />
                на почту <span className="text-white font-semibold">{email}</span>
              </p>
            </motion.div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-[10px]">
              {code.map((digit, index) => (
                <motion.div
                  key={index}
                  className="w-11 h-14"
                  whileTap={{ scale: 0.95 }}
                  transition={TAB_PRESS_TRANSITION}
                  onTapStart={() => setPressedIndex(index)}
                  onTap={() => setPressedIndex(null)}
                  onTapCancel={() => setPressedIndex(null)}
                >
                  <input
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
                    style={{
                      caretColor: pressedIndex === index ? 'transparent' : 'auto',
                    }}
                    className={`w-full h-full p-0 rounded-2xl bg-white-20 border text-white text-[20px] leading-14 font-semibold text-center outline-none tabular-nums appearance-none ${
                      codeError ? 'border-red-400' : 'border-white-10'
                    }`}
                  />
                </motion.div>
              ))}
            </div>
            {codeError && (
              <p className="text-[14px] text-red-400 leading-[130%]">
                {codeError}
              </p>
            )}
          </div>

          {secondsLeft > 0 ? (
            <p className="text-[16px] text-white-50 text-center leading-[130%]">
              Отправить код ещё раз через{' '}
              <span className="text-white">{secondsLeft}с</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={() => void handleResend()}
              className="text-[16px] text-white text-center leading-[130%] cursor-pointer bg-transparent border-0 p-0"
            >
              Отправить код ещё раз
            </button>
          )}
        </div>

        <PrimaryButton
          size="large"
          disabled={isLoading || !canSubmit}
          onClick={() => void handleLogin()}
        >
          Авторизоваться
        </PrimaryButton>
      </div>
    </main>
  )
}
