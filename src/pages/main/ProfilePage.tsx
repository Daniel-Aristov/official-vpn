import { useNavigate } from 'react-router-dom'
import { CreditCardIcon } from '@/components/icons/CreditCardIcon'
import { DocumentIcon } from '@/components/icons/DocumentIcon'
import { GiftIcon } from '@/components/icons/GiftIcon'
import { SupportIcon } from '@/components/icons/SupportIcon'
import { MonitorIcon } from '@/components/icons/MonitorIcon'
import { ShareIcon } from '@/components/icons/ShareIcon'
import { ShieldIcon } from '@/components/icons/ShieldIcon'
import { UserIcon } from '@/components/icons/UserIcon'
import { useAuth } from '@/store/useAuth'

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

export function ProfilePage() {
  const navigate = useNavigate()
  const { email } = useAuth()

  return (
    <main className="flex flex-col flex-1 px-4 pt-6 gap-4 max-w-[768px] mx-auto w-full">
      <div className="flex items-center gap-3 bg-[#000000]/40 border border-[#FFFFFF]/10 rounded-full p-4">
        <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-white/20 text-white shrink-0">
          <UserIcon />
        </div>
        <div className="flex flex-col gap-0.5 flex-1">
          <span className="text-white text-[16px] font-semibold leading-[130%]">
            {email ?? '—'}
          </span>
          <span className="text-[#FF9696]/80 text-[16px] leading-[130%]">
            Не привязан telegram
          </span>
        </div>
        <button
          type="button"
          className="w-[46px] h-[46px] flex items-center justify-center rounded-full bg-primary text-white cursor-pointer shrink-0"
        >
          <ShareIcon />
        </button>
      </div>

      <div className="bg-[#FFFFFF]/10 border border-[#FFFFFF]/10 rounded-[24px] p-4 flex flex-col gap-5 overflow-hidden">
        <span className="text-white/50 text-[16px] font-medium">
          Настройки профиля
        </span>
        <div className="flex flex-col gap-6">
          <MenuItem
            icon={<ShieldIcon />}
            title="Сохранение доступа"
            subtitle="Доступ к VPN без перебоев"
          />
          <MenuItem
            icon={<GiftIcon />}
            title="Реферальная программа"
            subtitle="Бонусы и деньги за приглашения"
          />
          <MenuItem
            icon={<CreditCardIcon />}
            title="Способ оплаты и история"
            subtitle="Настройка оплаты и транзакции"
            last
          />
        </div>
      </div>

      <div className="bg-[#FFFFFF]/10 border border-[#FFFFFF]/10 rounded-[24px] p-4 flex flex-col gap-5 overflow-hidden">
        <span className="text-white/50 text-[16px] font-medium">Поддержка</span>
        <div className="flex flex-col gap-6">
          <MenuItem
            icon={<MonitorIcon />}
            title="Установка на другом устройстве"
            subtitle="Подробная инструкция для установки"
          />
          <MenuItem
            icon={<SupportIcon />}
            title="Связаться с поддержкой"
            subtitle="Бонусы и деньги за приглашения"
            onClick={() => navigate('/main/support')}
          />
          <MenuItem
            icon={<DocumentIcon />}
            title="Пользовательское соглашение"
            subtitle="Оферта и пользовательское соглашение"
            last
          />
        </div>
      </div>
    </main>
  )
}
