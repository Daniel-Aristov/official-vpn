import { useNavigate } from 'react-router-dom'
import { PrimaryButton } from '@/components/UI/PrimaryButton'

export function HomePage() {
  const navigate = useNavigate()

  return (
    <main className="flex flex-col flex-1 px-4 py-[100px] max-w-[768px] mx-auto w-full">
      <div className="flex flex-col justify-end flex-1 gap-6 pt-4">
        <section className="flex flex-col justify-end items-center flex-1 gap-3">
          <img
            src="/logo.png"
            alt="Official VPN"
            className="w-[82px] h-[82px] rounded-[27px]"
          />
          <div className="flex flex-col items-center gap-2 w-full">
            <h1 className="text-[24px] font-bold text-white text-center leading-[130%] tracking-[-0.3px] max-w-[295px]">
              Добро пожаловать
              <br />в Official VPN!
            </h1>
            <p className="text-[16px] text-white text-center leading-[130%] tracking-[-0.3px] max-w-[295px]">
              Анонимность, скорость и уверенность
              <br />в каждом подключении.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <PrimaryButton size="large" onClick={() => navigate('/auth/email')}>
              Войти через почту
            </PrimaryButton>
            <PrimaryButton variant="secondary" size="large">
              Войти через телеграм
            </PrimaryButton>
          </div>

          <p className="text-[14px] text-white/50 text-center leading-[130%] tracking-[-0.3px]">
            Нажимая на кнопку Авторизоваться,
            <br />
            Вы соглашаетесь с{' '}
            <a href="#" className="font-bold underline">
              политикой конфиденциальности
            </a>
          </p>
        </section>
      </div>
    </main>
  )
}
