import { CopyButton } from '@/components/UI/CopyButton'
import { HeadphonesIcon } from '@/components/icons/HeadphonesIcon'
import { MailIcon } from '@/components/icons/MailIcon'
import { TelegramIcon } from '@/components/icons/TelegramIcon'
import {
  TELEGRAM_SUPPORT_HANDLE,
  TELEGRAM_SUPPORT_URL,
  SUPPORT_EMAIL,
} from '@/js/constants/urls'

interface ContactCardProps {
  icon: React.ReactNode
  title: string
  value: string
  children: React.ReactNode
}

function ContactCard({ icon, title, value, children }: ContactCardProps) {
  return (
    <div className="bg-[#FFFFFF]/10 border border-[#FFFFFF]/10 rounded-[24px] p-4 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div className="w-[46px] h-[46px] flex items-center justify-center rounded-[16px] bg-white/10 text-white shrink-0">
          {icon}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-white text-[16px] font-semibold leading-[130%]">
            {title}
          </span>
          <span className="text-white/80 text-[14px] leading-[130%] truncate mt-[4px]">
            {value}
          </span>
          <div className="mt-[14px]">{children}</div>
        </div>
      </div>
    </div>
  )
}

export function ContactSupportPage() {
  return (
    <main className="flex flex-col flex-1 px-4 pt-4 gap-4 max-w-[768px] mx-auto w-full">
      <div className="rounded-[24px] p-4 flex flex-col gap-4 bg-[#FFFFFF]/10 border border-[#FFFFFF]/10">
        <div className="w-[56px] h-[56px] flex items-center justify-center rounded-[16px] bg-white/10 text-white">
          <HeadphonesIcon className="w-6 h-6" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-white text-[24px] font-semibold">Поддержка</h1>
          <p className="text-white/80 text-[16px] leading-[130%]">
            Контакты чтобы связаться с нами
          </p>
        </div>
      </div>

      <ContactCard
        icon={<TelegramIcon />}
        title="Чат поддержки в Telegram"
        value={TELEGRAM_SUPPORT_HANDLE}
      >
        <a
          href={TELEGRAM_SUPPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit flex items-center justify-center bg-primary text-white font-semibold text-[16px] py-[10px] leading-[20px] px-[12px] rounded-[16px] cursor-pointer"
        >
          Перейти в телеграм
        </a>
      </ContactCard>

      <ContactCard
        icon={<MailIcon />}
        title="Наша почта для обращений"
        value={SUPPORT_EMAIL}
      >
        <div className="flex items-center gap-2">
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="flex-1 flex items-center justify-center bg-primary text-white font-semibold text-[16px] leading-[20px] py-[10px] px-[12px] rounded-[16px] cursor-pointer"
          >
            Написать обращение
          </a>
          <CopyButton
            text={SUPPORT_EMAIL}
            className="w-[44px] h-[44px] flex items-center justify-center rounded-full bg-primary text-white cursor-pointer shrink-0"
            aria-label="Скопировать email"
          />
        </div>
      </ContactCard>
    </main>
  )
}
