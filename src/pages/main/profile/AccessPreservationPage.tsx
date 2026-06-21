import { CheckmarkIcon } from '@/components/icons/CheckmarkIcon'
import { CopyIcon } from '@/components/icons/CopyIcon'
import { DocumentCheckIcon } from '@/components/icons/DocumentCheckIcon'
import { InfoCircleIcon } from '@/components/icons/InfoCircleIcon'
import { TelegramIcon } from '@/components/icons/TelegramIcon'
import {
  TELEGRAM_BOT_URL,
  TELEGRAM_CHANNEL_URL,
  PERSONAL_CABINET_URL,
} from '@/js/constants/urls'
import { openInNewTab } from '@/js/helpers/browser'
import { copyToClipboard } from '@/js/helpers/clipboard'
import { useUser } from '@/store/user/useUser'

interface ActionCardProps {
  icon: React.ReactNode
  completedIcon?: React.ReactNode
  title: string
  subtitle: string
  completed?: boolean
  children?: React.ReactNode
}

function ActionCard({
  icon,
  completedIcon,
  title,
  subtitle,
  completed = false,
  children,
}: ActionCardProps) {
  return (
    <div className="bg-[#FFFFFF]/10 border border-[#FFFFFF]/10 rounded-[24px] p-4 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div
          className={`w-[46px] h-[46px] flex items-center justify-center rounded-[16px] shrink-0 ${
            completed ? 'bg-[#139D76]' : 'bg-white/10 text-white'
          }`}
        >
          {completed ? completedIcon : icon}
        </div>
        <div className="flex flex-col min-w-0">
          <span
            className={`text-white text-[18px] font-semibold leading-[120%] ${
              completed ? 'line-through' : ''
            }`}
          >
            {title}
          </span>
          <span className="text-white/80 text-[16px] leading-[120%] mt-[2px]">
            {subtitle}
          </span>
          {!completed && children && (
            <div className="mt-[14px]">{children}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export function AccessPreservationPage() {
  const { user, linkTelegram } = useUser()
  const isTelegramLinked = user?.isTelegramLinked ?? false

  const handleCopyLink = () => copyToClipboard(PERSONAL_CABINET_URL)

  const handleLinkTelegram = () => {
    void linkTelegram()
    openInNewTab(TELEGRAM_BOT_URL)
  }

  return (
    <main className="flex flex-col flex-1 px-4 pt-4 gap-4 max-w-[768px] mx-auto w-full">
      <div className="rounded-[24px] p-4 flex flex-col gap-4 bg-[#FFFFFF]/10 border border-[#FFFFFF]/10">
        <div className="w-[56px] h-[56px] flex items-center justify-center rounded-[16px] bg-white/10 text-white">
          <DocumentCheckIcon className="w-6 h-6" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-white text-[24px] font-semibold">
            Сохранение доступа
          </h1>
          <p className="text-white/80 text-[16px] leading-[130%]">
            Для сохранения доступа к сервису рекомендуем выполнить несколько
            простых шагов
          </p>
        </div>
      </div>

      <ActionCard
        icon={<TelegramIcon />}
        completedIcon={<CheckmarkIcon fill="white" className="w-5 h-5" />}
        completed={isTelegramLinked}
        title="Привязать к Telegram-аккаунту"
        subtitle="Будем всегда на связи"
      >
        <button
          type="button"
          onClick={handleLinkTelegram}
          className="w-fit flex items-center justify-center bg-primary text-white font-semibold text-[16px] py-[10px] leading-[20px] px-[12px] rounded-[16px] cursor-pointer"
        >
          Привязать telegram
        </button>
      </ActionCard>

      <ActionCard
        icon={<InfoCircleIcon className="w-5 h-5 text-white/50" />}
        title="Подпишитесь на Telegram-канал"
        subtitle="Для получения важной информации"
      >
        <a
          href={TELEGRAM_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit flex items-center justify-center bg-primary text-white font-semibold text-[16px] py-[10px] leading-[20px] px-[12px] rounded-[16px] cursor-pointer"
        >
          Подписаться на канал
        </a>
      </ActionCard>

      <div className="bg-[#FFFFFF]/10 border border-[#FFFFFF]/10 rounded-[24px] p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-white text-[16px] font-semibold leading-[130%]">
            Сохраните ссылку на личный кабинет
          </span>
          <span className="text-white/80 text-[14px] leading-[130%]">
            С помощью этой ссылки вы можете получить доступ к личному кабинету
            через браузер
          </span>
        </div>
        <div className="flex items-center gap-3 bg-white border border-white/10 rounded-[16px] px-4 py-[6px]">
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-black text-[16px] font-semibold leading-[130%] truncate">
              {PERSONAL_CABINET_URL}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyLink}
            aria-label="Скопировать ссылку"
            className="w-[46px] h-[46px] flex items-center justify-center rounded-full bg-primary text-white cursor-pointer shrink-0"
          >
            <CopyIcon />
          </button>
        </div>
      </div>
    </main>
  )
}
