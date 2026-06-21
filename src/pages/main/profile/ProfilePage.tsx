import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCardIcon } from '@/components/icons/CreditCardIcon'
import { DocumentIcon } from '@/components/icons/DocumentIcon'
import { GiftIcon } from '@/components/icons/GiftIcon'
import { SupportIcon } from '@/components/icons/SupportIcon'
import { GearIcon } from '@/components/icons/GearIcon'
import { MonitorIcon } from '@/components/icons/MonitorIcon'
import { ShareIcon } from '@/components/icons/ShareIcon'
import { ShieldIcon } from '@/components/icons/ShieldIcon'
import { TelegramIcon } from '@/components/icons/TelegramIcon'
import { UserIcon } from '@/components/icons/UserIcon'
import { useAuth } from '@/store/auth/useAuth'
import { TELEGRAM_BOT_URL } from '@/js/constants/urls'
import { openInNewTab } from '@/js/helpers/browser'

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
  const [isTelegramLinked, setIsTelegramLinked] = useState(false)

  const handleLinkTelegram = () => {
    setIsTelegramLinked(true)
    openInNewTab(TELEGRAM_BOT_URL)
  }

  return (
    <main className="flex flex-col flex-1 px-4 pt-6 gap-4 max-w-[768px] mx-auto w-full">
      {!isTelegramLinked && (
        <div
          className="rounded-[24px] p-4 flex flex-col gap-4 border border-[#FFFFFF]/10"
          style={{
            background:
              'linear-gradient(135deg, rgba(37, 93, 224, 0.28) 0%, rgba(19, 157, 118, 0.12) 100%), rgba(0, 0, 0, 0.4)',
          }}
        >
          <div className="flex flex-col gap-2">
            <h2 className="text-white text-[18px] font-semibold leading-[120%]">
              Вам необходимо привязать Telegram
            </h2>
            <p className="text-white/80 text-[16px] leading-[120%]">
              Это позволит привязать ваш аккаунт и даёт возможность не потерять
              доступ
            </p>
          </div>
          <button
            type="button"
            onClick={handleLinkTelegram}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold text-[16px] py-[14px] leading-[20px] px-[12px] rounded-[16px] cursor-pointer"
          >
            <TelegramIcon fill="white" fillOpacity={1} />
            Привязать telegram
          </button>
        </div>
      )}

      <div className="flex items-center gap-3 bg-[#000000]/40 border border-[#FFFFFF]/10 rounded-full p-4">
        <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-white/20 text-white shrink-0">
          <UserIcon />
        </div>
        <div className="flex flex-col gap-0.5 flex-1">
          <span className="text-white text-[16px] font-semibold leading-[130%]">
            {email ?? '—'}
          </span>
          <span
            className={`text-[16px] leading-[130%] ${
              isTelegramLinked ? 'text-[#139D76]' : 'text-[#FF9696]/80'
            }`}
          >
            {isTelegramLinked ? 'Telegram привязан' : 'Не привязан telegram'}
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
            onClick={() => navigate('/main/profile/access')}
          />
          <MenuItem
            icon={<GiftIcon />}
            title="Реферальная программа"
            subtitle="Бонусы и деньги за приглашения"
            onClick={() => navigate('/main/profile/referral')}
          />
          <MenuItem
            icon={<CreditCardIcon />}
            title="Способ оплаты и история"
            subtitle="Настройка оплаты и транзакции"
            onClick={() => navigate('/main/profile/payment')}
          />
          <MenuItem
            icon={<MonitorIcon />}
            title="Устройства"
            subtitle="Управление вашими устройствами"
            onClick={() => navigate('/main/devices')}
            last
          />
        </div>
      </div>

      <div className="bg-[#FFFFFF]/10 border border-[#FFFFFF]/10 rounded-[24px] p-4 flex flex-col gap-5 overflow-hidden">
        <span className="text-white/50 text-[16px] font-medium">Поддержка</span>
        <div className="flex flex-col gap-6">
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
