import { useNavigate } from 'react-router-dom'
import { MenuItem } from '@/components/MenuItem'
import { SupportIcon } from '@/components/icons/SupportIcon'
import { HeadphonesIcon } from '@/components/icons/HeadphonesIcon'
import { GearIcon } from '@/components/icons/GearIcon'
import { QuestionIcon } from '@/components/icons/QuestionIcon'

export function SupportPage() {
  const navigate = useNavigate()

  return (
    <main className="flex flex-col flex-1 px-4 pt-6 gap-4 max-w-[768px] mx-auto w-full">
      <div className="rounded-[24px] p-4 flex flex-col gap-4 bg-white-10 border border-white-10">
        <div className="w-[56px] h-[56px] flex items-center justify-center rounded-[12px] bg-white-10 text-white">
          <HeadphonesIcon className="w-6 h-6" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-white text-[24px] font-semibold">
            Связаться с поддержкой
          </h1>
          <p className="text-white-80 text-[16px] leading-[130%]">
            Получите ответы на популярные вопросы
            <br />
            или обратитесь к нам за помощью
          </p>
        </div>
      </div>

      <div className="bg-white-10 border border-white-10 rounded-[24px] p-4 flex flex-col gap-6 overflow-hidden">
        <MenuItem
          icon={<QuestionIcon />}
          title="Часто задаваемые вопросы"
          subtitle="Ответы на часто задаваемые вопросы"
          onClick={() => navigate('/main/support/faq')}
        />
        <MenuItem
          icon={<GearIcon fillOpacity={0.5} />}
          title="Установка на другом устройстве"
          subtitle="Подробная инструкция для установки"
          onClick={() =>
            navigate('/main/setup', { state: { openPlatformSelect: true } })
          }
        />
        <MenuItem
          icon={<SupportIcon />}
          title="Поддержка"
          subtitle="Связаться с поддержкой"
          onClick={() => navigate('/main/support/contact')}
          last
        />
      </div>
    </main>
  )
}
