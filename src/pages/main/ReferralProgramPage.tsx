import { useState } from 'react'
import { CopyIcon } from '@/components/icons/CopyIcon'
import { InfoCircleIcon } from '@/components/icons/InfoCircleIcon'
import { LinkIcon } from '@/components/icons/LinkIcon'
import { ReferralGiftIcon } from '@/components/icons/ReferralGiftIcon'
import { UsefulLinkArrowIcon } from '@/components/icons/UsefulLinkArrowIcon'

const REFERRAL_LINK = 'https://oflvpn.com?start=234674624'
const MONEY_REFERRAL_LINK = 'https://oflvpn.com?start=rp-234674624'
const TELEGRAM_SUPPORT_URL = 'https://t.me/vpnbot_support'
const TELEGRAM_PARTNERS_URL = 'https://t.me/official_vpnbot_partners'

type ReferralTab = 'bonuses' | 'money'

function formatReferralLink(link: string) {
  const queryIndex = link.indexOf('?')
  if (queryIndex === -1) return link

  return (
    <>
      {link.slice(0, queryIndex + 1)}
      <br />
      {link.slice(queryIndex + 1)}
    </>
  )
}

interface StatCardProps {
  value: string
  label: string
}

function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="bg-[#FFFFFF]/10 border border-[#FFFFFF]/10 rounded-[24px] p-4 flex flex-col gap-4 min-w-0">
      <span className="text-white text-[28px] font-semibold leading-[120%]">
        {value}
      </span>
      <span className="text-white/80 text-[16px] leading-[130%]">{label}</span>
    </div>
  )
}

interface InfoBlockProps {
  children: React.ReactNode
}

function InfoBlock({ children }: InfoBlockProps) {
  return (
    <div className="bg-[#FFFFFF]/10 border border-[#FFFFFF]/10 rounded-[24px] p-4 flex gap-4">
      <InfoCircleIcon className="w-6 h-6 shrink-0 text-white/80" />
      <div className="flex flex-col gap-3 text-white/80 text-[16px] leading-[130%]">
        {children}
      </div>
    </div>
  )
}

interface UsefulLinkProps {
  title: string
  value: string
  href: string
}

function UsefulLink({ title, value, href }: UsefulLinkProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <span className="text-white text-[18px] font-semibold leading-[120%]">
          {title}
        </span>
        <span className="text-white/80 text-[16px] leading-[120%] truncate">
          {value}
        </span>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={title}
        className="w-[46px] h-[46px] flex items-center justify-center rounded-full bg-primary text-white shrink-0"
      >
        <UsefulLinkArrowIcon />
      </a>
    </div>
  )
}

function EmptyRecordsBlock() {
  return (
    <div className="bg-[#FFFFFF]/10 border border-[#FFFFFF]/10 rounded-[24px] p-4 min-h-[120px] flex items-center justify-center text-white/80 text-[16px] leading-[130%]">
      Ещё нет записей
    </div>
  )
}

interface ReferralLinkCardProps {
  link: string
}

function ReferralLinkCard({ link }: ReferralLinkCardProps) {
  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(link)
  }

  return (
    <div className="flex items-start gap-3 bg-white border border-white/10 rounded-[16px] px-4 py-[6px]">
      <LinkIcon className="w-6 h-6 shrink-0 text-black/60" />
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-black/60 text-[16px] font-semibold leading-[130%] truncate">
          Ваша уникальная ссылка
        </span>
        <span className="text-black text-[16px] font-semibold leading-[130%]">
          {formatReferralLink(link)}
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
  )
}

function BonusesTabContent() {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <StatCard value="344" label="Приглашено" />
        <StatCard value="12" label="Получено дней" />
      </div>

      <InfoBlock>
        <p>
          За каждого приведённого друга, который воспользовался нашим VPN, вы
          получите +7 дней (на следующий день в 10:00 по МСК)
        </p>
        <p>
          За каждого, кто оплатил подписку, вы получите дополнительные +15 дней
          к выбранному ключу. Все бонусы суммируются!
        </p>
      </InfoBlock>

      <EmptyRecordsBlock />
      <ReferralLinkCard link={REFERRAL_LINK} />
    </>
  )
}

function MoneyTabContent() {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <StatCard value="344" label="Приглашено" />
        <StatCard value="0 ₽" label="Баланс" />
        <StatCard value="12.412 ₽" label="Заработано" />
        <StatCard value="12.412 ₽" label="Выведено" />
      </div>

      <InfoBlock>
        <p>
          Вы будете получать 40% за привлечённых клиентов, которые покупают и
          продлевают VPN. 40% вы получаете не разово, а на постоянной основе:
          сработало автопродление VPN — вы заработали свой процент.
        </p>
        <p>
          В нашей партнёрской программе есть БЕСПЛАТНОЕ обучение, благодаря
          которому можно найти своих первых клиентов.
        </p>
        <p>
          Все выводы производятся исключительно на криптокошелёк от 3000 рублей
        </p>
      </InfoBlock>
      <div className="bg-[#FFFFFF]/10 border border-[#FFFFFF]/10 rounded-[24px] p-4 flex flex-col gap-5">
        <span className="text-white/50 text-[16px] font-semibold leading-[130%]">
          Полезные ссылки
        </span>
        <UsefulLink
          title="По всем вопросам"
          value="@vpnbot_support"
          href={TELEGRAM_SUPPORT_URL}
        />
        <UsefulLink
          title="Обучение"
          value="@official_vpnbot_partners"
          href={TELEGRAM_PARTNERS_URL}
        />
      </div>
      <EmptyRecordsBlock />
      <div className="bg-secondary rounded-[16px] p-4 flex items-center justify-center text-white text-[16px] font-semibold leading-[130%]">
        Запросы на вывод
      </div>
      <ReferralLinkCard link={MONEY_REFERRAL_LINK} />
    </>
  )
}

const referralTabs = [
  { id: 'bonuses' as const, label: 'Бонусы' },
  { id: 'money' as const, label: 'Деньги' },
] as const

export function ReferralProgramPage() {
  const [activeTab, setActiveTab] = useState<ReferralTab>('bonuses')
  const activeIndex = referralTabs.findIndex((tab) => tab.id === activeTab)

  return (
    <main className="flex flex-col flex-1 p-4 gap-4 max-w-[768px] mx-auto w-full">
      <div className="rounded-[24px] p-4 flex flex-col gap-4 bg-white/10 border border-[#FFFFFF]/10">
        <div className="w-[56px] h-[56px] flex items-center justify-center rounded-[16px] bg-white/10 text-white">
          <ReferralGiftIcon className="w-6 h-6" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-white text-[24px] font-semibold">
            Реферальная программа
          </h1>
          <p className="text-white/80 text-[16px] leading-[130%]">
            Реф. программы которые позволяют получать бонусные дни, а также
            зарабатывать деньги
          </p>
        </div>
      </div>

      <div className="relative flex w-full rounded-full p-1 bg-[#FFFFFF]/10 border border-[#FFFFFF]/10 overflow-hidden">
        <span
          className="absolute top-1 bottom-1 left-1 rounded-full bg-white/10"
          style={{
            width: `calc((100% - 8px) / ${referralTabs.length})`,
            transform: `translateX(calc(${activeIndex} * 100%))`,
            transition: 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />
        {referralTabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`relative flex-1 min-w-0 py-3 rounded-full text-[16px] font-semibold cursor-pointer transition-colors duration-300 ${
              activeTab === id ? 'text-white' : 'text-white/40'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'bonuses' ? <BonusesTabContent /> : <MoneyTabContent />}
    </main>
  )
}
