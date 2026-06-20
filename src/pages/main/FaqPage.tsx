import type { ReactNode } from 'react'
import { QuestionIcon } from '../../components/icons/QuestionIcon'

interface FaqItemData {
  title: string
  content: ReactNode
}

const faqItems: FaqItemData[] = [
  {
    title: 'Какие протоколы используются?',
    content: (
      <>
        Мы используем технологию{' '}
        <strong className="text-white">VLESS + XTLS-Reality!</strong>
      </>
    ),
  },
  {
    title: 'Есть ли ограничение по трафику и скорости?',
    content: 'Ограничения по трафику и скорости отсутствуют!',
  },
  {
    title: 'Безопасен ли наш VPN?',
    content:
      'Мы используем шифрование для защиты передаваемых данных. Мы не храним пользовательские данные и не передаем их третьим лицам.',
  },
  {
    title: 'Оферта и политика конфиденциальности',
    content: (
      <>
        Ознакомиться можно перейдя в{' '}
        <strong className="text-white">@official_vpnbot</strong> и введите
        символ <strong className="text-white">/</strong> и в появившемся списке
        выберите <strong className="text-white">/privacy</strong> (Оферта и
        политика конф.)
      </>
    ),
  },
  {
    title: 'Виды и стоимость подписки, количество устройств',
    content: (
      <div className="flex flex-col gap-2">
        <p>
          <strong className="text-white">Basic</strong> – 199 рублей в месяц
        </p>
        <p>
          <strong className="text-white">PRO</strong> – 299 рублей в месяц
        </p>
        <p>
          <strong className="text-white">Basic</strong> подписка стоит{' '}
          <strong className="text-white">199</strong> рублей в месяц и включает
          до 3-х подключаемых устройств с локациями: Германия, Нидерланды,
          Латвия, Умная маршрутизация, без ограничения по скорости и трафику.
        </p>
        <p>
          <strong className="text-white">Подписка PRO</strong> стоит{' '}
          <strong className="text-white">299</strong> рублей в месяц и включает
          до 6-ти подключаемых устройств со следующими доступными локациями:
          США, ОАЭ, Финляндия, Германия, Япония, Болгария, Казахстан, Турция,
          Аргентина, Польша, Россия, Локация для обхода белых списков, + локации
          из тарифа Basic.
        </p>
        <p>
          На всех подписках при подключении к &laquo;Умной маршрутизации&raquo;
          Youtube без рекламы
        </p>
        <p className="italic text-white/60">
          Локации постоянно изменяются и добавляются по мере появления новых
          ограничений и блокировок
        </p>
      </div>
    ),
  },
  {
    title: 'Можно ли добавить дополнительные устройства?',
    content: (
      <>
        Да, можно приобрести дополнительные слоты, стоимость одного слота{' '}
        <strong className="text-white">60 руб.</strong> в месяц. Для этого
        необходимо зайти в{' '}
        <strong className="text-white">@official_vpnbot</strong>, нажать{' '}
        <strong className="text-white">&laquo;Личный кабинет&raquo;</strong> и
        выбрать дополнительные устройства.
      </>
    ),
  },
  {
    title: 'Какие устройства поддерживаются?',
    content:
      'Android, IOS, Windows 10 (и выше), MacOS (процессоры M1), Linux, Android TV, Apple TV',
  },
  {
    title: 'Как подключиться к VPN',
    content: (
      <div className="flex flex-col gap-2">
        <p>
          Откройте Telegram и перейдите в{' '}
          <strong className="text-white">@official_vpnbot</strong>. В меню
          выберите пункт{' '}
          <strong className="text-white">
            /menu -&gt; &laquo;Установить VPN&raquo;
          </strong>
          . Здесь вы сможете выбрать нужное устройство и загрузить приложение.
        </p>
        <p>
          Для работы VPN необходим ключ. Его можно взять там же в меню{' '}
          <strong className="text-white">&laquo;Установить VPN&raquo;</strong>,
          нажав на соответствующую кнопку, или ключ можно получить в личном
          кабинете, перейдя по ссылке{' '}
          <strong className="text-white">@official_vpnbot</strong>, затем нажав
          кнопку{' '}
          <strong className="text-white">&laquo;Личный кабинет&raquo;</strong> и
          выбрав{' '}
          <strong className="text-white">
            &laquo;Показать мои ключи VPN&raquo;
          </strong>
          . После этого кликните на ссылку{' '}
          <strong className="text-white">
            &laquo;Нажмите, чтобы установить ключ&raquo;
          </strong>
          , и вы будете перенаправлены в приложение.
        </p>
        <p>
          В случае, если после этого действия открывается белая страница и ключ
          не добавляется, то следует импортировать ключ вручную, для этого:
        </p>
        <ol className="list-decimal pl-4 flex flex-col gap-1">
          <li>Скопируйте ключ-ссылку из личного кабинета</li>
          <li>
            Далее в приложении{' '}
            <strong className="text-white">Happ / V2RayTun</strong> нажмите
            кнопку &laquo;+&raquo; -&gt; &laquo;Из буфера&raquo; (если
            приложение Happ) или &laquo;Импорт из буфера обмена&raquo; (если
            приложение V2rayTUN).
          </li>
        </ol>
        <p>
          Теперь в приложении просто нажмите на центральную кнопку для включения
          VPN.
        </p>
      </div>
    ),
  },
  {
    title: 'Как продлить подписку?',
    content: (
      <div className="flex flex-col gap-2">
        <p>
          Перейдите в нашего бота{' '}
          <strong className="text-white">@official_vpnbot</strong>
        </p>
        <p>
          Отправьте ему сообщение с текстом{' '}
          <strong className="text-white">/menu</strong> или нажмите на кнопку{' '}
          <strong className="text-white">&laquo;Личный кабинет&raquo;</strong>{' '}
          снизу экрана
        </p>
        <p>
          В ответ он пришлет сообщение с кнопками, нажмите на{' '}
          <strong className="text-white">
            &laquo;Личный кабинет&raquo; -&gt; &laquo;Продлить VPN&raquo;
          </strong>{' '}
          если хотите продлить
        </p>
      </div>
    ),
  },
  {
    title: 'Способы оплаты',
    content: (
      <div className="flex flex-col gap-2">
        <p>
          Оплата происходит через <strong className="text-white">Юкассу</strong>{' '}
          по банковской карте или через{' '}
          <strong className="text-white">СБП</strong>
        </p>
        <p className="italic text-white/60">
          Позже появится возможность оплаты криптой и TG Stars
        </p>
      </div>
    ),
  },
  {
    title: 'Отключение автоплатежей',
    content: (
      <div className="flex flex-col gap-2">
        <p>
          Сразу после оплаты включается опция{' '}
          <strong className="text-white">&laquo;автоплатежи&raquo;</strong>,
          которая автоматически списывает деньги за подписку каждый месяц (но не
          больше одного месяца за раз!).
        </p>
        <p>
          Если у вас была пробная подписка на{' '}
          <strong className="text-white">7 дней</strong>, то она отключится
          самостоятельно без списания средств! Если продлевали подписку, то
          автосписания можно выключить в телеграм боте{' '}
          <strong className="text-white">@official_vpnbot</strong> в Главном
          меню -&gt;{' '}
          <strong className="text-white">&laquo;Личный кабинет&raquo;</strong>{' '}
          -&gt;{' '}
          <strong className="text-white">
            &laquo;Показать мои ключи VPN&raquo;
          </strong>{' '}
          -&gt;{' '}
          <strong className="text-white">
            &laquo;Отключить автоплатежи&raquo;
          </strong>
          .
        </p>
        <p>
          Если кнопка &laquo;Отключить автоплатежи&raquo; НЕ отображается,
          значит автоплатежи у вас отключены!
        </p>
      </div>
    ),
  },
  {
    title: 'Обходит ли наш ВПН «Белые списки»?',
    content: (
      <p>
        &laquo;🏳️ Белые списки (LTE)&raquo; - новая локация для &laquo;⚡️PRO
        подписки&raquo;, специально оптимизированная для стабильной работы в
        условиях &laquo;белых списков&raquo; в России. Как понять что у вас
        активны &laquo;белые списки&raquo;? Все очень просто! Если без{' '}
        <strong className="text-white">VPN</strong> на{' '}
        <strong className="text-white">LTE</strong> у Вас открываются только
        пару российских сайтов (<em>яндекс, вк, госуслуги и тд</em>), а весь
        остальной интернет не работает, то в вашем регионе активны &laquo;белые
        списки&raquo;!
      </p>
    ),
  },
  {
    title: 'Где посмотреть список устройств, где добавлен ключ?',
    content: (
      <div className="flex flex-col gap-2">
        <p>
          Проверить подключенные устройства Вы можете в личном кабинете
          телеграмм-бота. Перейдите в{' '}
          <strong className="text-white">@official_vpnbot</strong>, там нажмите
          на{' '}
          <strong className="text-white">
            &laquo;Главное меню&raquo; &gt; &laquo;Показать мои ключи VPN&raquo;
            &gt; &laquo;Подключенные устройства&raquo;
          </strong>{' '}
          🤗
        </p>
        <p>Здесь же Вы можете их отвязать от подписки🙌</p>
      </div>
    ),
  },
]

function FaqItem({ number, title, content }: FaqItemData & { number: number }) {
  return (
    <article className="flex gap-3">
      <div className="w-[46px] h-[46px] flex items-center justify-center rounded-[16px] bg-white/10 text-white text-[16px] font-semibold shrink-0">
        {number}
      </div>
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <h2 className="text-white text-[16px] font-semibold leading-[130%]">
          {title}
        </h2>
        <div className="text-white/80 text-[14px] leading-[130%]">
          {content}
        </div>
      </div>
    </article>
  )
}

export function FaqPage() {
  return (
    <main className="flex flex-col flex-1 px-4 pt-4 gap-4">
      <div className="rounded-[24px] p-4 flex flex-col gap-4 bg-[#FFFFFF]/10 border border-[#FFFFFF]/10">
        <div className="w-[56px] h-[56px] flex items-center justify-center rounded-[16px] bg-white/10 text-white">
          <QuestionIcon className="w-6 h-6" solid />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-white text-[24px] font-semibold">
            Часто задаваемые вопросы
          </h1>
          <p className="text-white/80 text-[16px] leading-[130%]">
            Ответы на часто задаваемые вопросы
          </p>
        </div>
      </div>

      <div className="bg-[#FFFFFF]/10 border border-[#FFFFFF]/10 rounded-[24px] p-4 flex flex-col gap-6 overflow-hidden">
        {faqItems.map((item, index) => (
          <FaqItem key={item.title} number={index + 1} {...item} />
        ))}
      </div>
    </main>
  )
}
