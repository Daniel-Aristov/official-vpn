import { useNavigate } from 'react-router-dom'
import { SupportIcon } from '../../components/icons/SupportIcon'
import { HeadphonesIcon } from '../../components/icons/HeadphonesIcon'
import { MonitorIcon } from '../../components/icons/MonitorIcon'
import { QuestionIcon } from '../../components/icons/QuestionIcon'

interface MenuItemProps {
  icon: React.ReactNode
  title: string
  subtitle: string
  last?: boolean
  onClick?: () => void
}

function MenuItem({ icon, title, subtitle, onClick }: MenuItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 w-full text-left cursor-pointer"
    >
      <div className="w-[46px] h-[46px] flex items-center justify-center rounded-[16px] bg-white/10 text-white/50! shrink-0">
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-white text-[16px] font-semibold leading-[130%]">
          {title}
        </span>
        <span className="text-white/80 text-[14px] leading-[130%]">
          {subtitle}
        </span>
      </div>
    </button>
  )
}

export function SupportPage() {
  const navigate = useNavigate()

  return (
    <main className="flex flex-col flex-1 px-4 pt-6 gap-4">
      <div className="rounded-[24px] p-4 flex flex-col gap-4 bg-[#FFFFFF]/10 border border-[#FFFFFF]/10">
        <div className="w-[56px] h-[56px] flex items-center justify-center rounded-[12px] bg-white/10 text-white">
          <HeadphonesIcon className="w-6 h-6" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-white text-[24px] font-semibold">
            Связаться с поддержкой
          </h1>
          <p className="text-white/80 text-[16px] leading-[130%]">
            Получите ответы на популярные вопросы
            <br />
            или обратитесь к нам за помощью
          </p>
        </div>
      </div>

      <div className="bg-[#FFFFFF]/10 border border-[#FFFFFF]/10 rounded-[24px] p-4 flex flex-col gap-6 overflow-hidden">
        <MenuItem
          icon={<QuestionIcon />}
          title="Часто задаваемые вопросы"
          subtitle="Ответы на часто задаваемые вопросы"
          onClick={() => navigate('/main/support/faq')}
        />
        <MenuItem
          icon={<MonitorIcon />}
          title="Установка на другом устройстве"
          subtitle="Подробная инструкция для установки"
        />
        <MenuItem
          icon={<SupportIcon />}
          title="Поддержка"
          subtitle="Связаться с поддержкой"
          last
        />
      </div>
    </main>
  )
}
