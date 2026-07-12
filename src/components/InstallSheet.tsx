import { BottomSheet } from '@/components/BottomSheet'
import { PrimaryButton } from '@/components/UI/PrimaryButton'
import { CopyButton } from '@/components/UI/CopyButton'
import type { InstallPlatform } from '@/js/constants/urls'
import { resolveDownloadLink } from '@/js/services/utils/mappers'
import { openInNewTab } from '@/js/helpers/browser'

interface InstallSheetProps {
  isOpen: boolean
  platform: InstallPlatform
  currentDevice?: InstallPlatform
  downloadLinks: Partial<Record<InstallPlatform, string>>
  onClose: () => void
}

const DESCRIPTION =
  'После установки приложения Happ, обязательно вернитесь на этот экран и нажмите «Следующий шаг», чтобы добавить конфигурацию в приложение, без этого VPN работать не будет'

const PLATFORM_LABELS: Record<InstallPlatform, string> = {
  IOS: 'iOS',
  Android: 'Android',
  Windows: 'Windows',
  Macbook: 'MacOS',
}

const DEVICE_NAMES: Record<InstallPlatform, string> = {
  IOS: 'iPhone',
  Android: 'Android-устройства',
  Windows: 'Windows',
  Macbook: 'Mac',
}

const INSTALL_TARGETS: Record<InstallPlatform, string> = {
  IOS: 'iPhone',
  Android: 'Android-устройстве',
  Windows: 'компьютере',
  Macbook: 'Mac',
}

function getSecondButton(platform: InstallPlatform): string | null {
  if (platform === 'IOS') return 'Версия для зарубежного AppStore'
  return null
}

export function InstallSheet({
  isOpen,
  platform,
  currentDevice,
  downloadLinks,
  onClose,
}: InstallSheetProps) {
  const isMismatch = !!currentDevice && currentDevice !== platform
  const secondButton = getSecondButton(platform)
  const downloadLink = resolveDownloadLink(platform, downloadLinks)

  const handleProceed = () => {
    const link = isMismatch
      ? downloadLink
      : resolveDownloadLink(currentDevice ?? platform, downloadLinks)
    openInNewTab(link)
    onClose()
  }

  const handleForeignAppStore = () => {
    openInNewTab(resolveDownloadLink('IOS', downloadLinks))
    onClose()
  }

  if (isMismatch) {
    return (
      <BottomSheet
        isOpen={isOpen}
        title="Похоже, вы на другом устройстве"
        onClose={onClose}
      >
        <p className="text-white/80 text-[16px] leading-[130%]">
          Вы открыли страницу с{' '}
          <span className="font-semibold text-white">
            {DEVICE_NAMES[currentDevice]}
          </span>
          , но устанавливаемое приложение предназначено для{' '}
          <span className="font-semibold text-white">
            {PLATFORM_LABELS[platform]}
          </span>
          . Файл можно сохранить сейчас, либо скопировать ссылку и продолжить
          установку на{' '}
          <span className="font-semibold text-white">
            {INSTALL_TARGETS[platform]}
          </span>
          .
        </p>
        <div className="flex flex-col gap-2">
          <PrimaryButton size="large" onClick={handleProceed}>
            Хорошо, перейти к установке
          </PrimaryButton>
          <div className="flex items-start gap-3 bg-secondary border border-white/10 px-4 py-3 rounded-[16px]">
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-white/80 text-[14px] font-regular">
                Ссылка для скачивания
              </span>
              <span className="text-white text-[16px] leading-[120%] break-all">
                {downloadLink}
              </span>
            </div>
            <CopyButton
              text={downloadLink}
              iconClassName="w-5 h-5"
              aria-label="Скопировать ссылку"
            />
          </div>
        </div>
      </BottomSheet>
    )
  }

  return (
    <BottomSheet
      isOpen={isOpen}
      title="Важная информация"
      onClose={onClose}
    >
      <p className="text-white/80 text-[16px] leading-[130%]">{DESCRIPTION}</p>
      <div className="flex flex-col gap-2">
        <PrimaryButton size="large" onClick={handleProceed}>
          Хорошо, перейти к установке
        </PrimaryButton>
        {secondButton && (
          <PrimaryButton size="large" variant="secondary" onClick={handleForeignAppStore}>
            {secondButton}
          </PrimaryButton>
        )}
      </div>
    </BottomSheet>
  )
}
