import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { PrimaryButton } from '@/components/UI/PrimaryButton'
import { FADE_TRANSITION, TAB_PRESS_TRANSITION } from '@/js/constants/motion'
import { AtIcon } from '@/components/icons/AtIcon'
import { ChevronLeftIcon } from '@/components/icons/ChevronLeftIcon'
import { isValidEmail } from '@/js/helpers/validation'
import { useAuth } from '@/store/auth/useAuth'

export function EmailAuthPage() {
  const navigate = useNavigate()
  const { sendEmailCode, isLoading } = useAuth()
  const [email, setEmail] = useState('')

  const trimmedEmail = email.trim()
  const isEmpty = trimmedEmail === ''
  const isValid = isValidEmail(trimmedEmail)
  const showError = !isEmpty && !isValid
  const canContinue = !isEmpty && isValid

  return (
    <main className="flex flex-col flex-1 px-4 pb-10 pt-4 max-w-[768px] mx-auto w-full">
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
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={FADE_TRANSITION}
                className="p-4 rounded-2xl text-white"
                style={{ background: '#5389D9' }}
              >
                <AtIcon />
              </motion.div>
              <h2 className="text-[24px] font-bold text-white text-center leading-[130%] tracking-[-0.3px]">
                Авторизация
              </h2>
              <p className="text-[16px] text-white/50 text-center leading-[130%] max-w-[295px]">
                Используйте вашу электронную почту для авторизации
              </p>
            </div>

            <div className="w-full flex flex-col gap-2">
              <motion.input
                type="email"
                placeholder="email@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                whileTap={{ scale: 0.95 }}
                transition={TAB_PRESS_TRANSITION}
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
            disabled={!canContinue || isLoading}
            onClick={async () => {
              await sendEmailCode(trimmedEmail)
              navigate('/auth/email/verify', {
                state: { email: trimmedEmail },
              })
            }}
          >
            Продолжить
          </PrimaryButton>
        </div>
      </div>
    </main>
  )
}
