import { useState } from 'react'
import { BottomSheet } from '@/components/BottomSheet'
import { PrimaryButton } from '@/components/UI/PrimaryButton'
import { CopyIcon } from '@/components/icons/CopyIcon'
import { CheckmarkIcon } from '@/components/icons/CheckmarkIcon'
import {
  DOWNLOAD_LINKS,
  type InstallPlatform,
} from '@/js/constants/urls'
import { openInNewTab } from '@/js/helpers/browser'

interface InstallSheetProps {
  isMounted: boolean
  isVisible: boolean
  platform: InstallPlatform
  currentDevice?: InstallPlatform
  onClose: () => void
}

const DESCRIPTION =
  'После установки приложения Happ, обязательно вернитесь на этот экран и нажмите «Следующий шаг», чтобы добавить конфигурацию в приложение, без этого VPN работать не будет'

const PLATFORM_LABELS: Record<InstallPlatform, string> = {
  IOS: 'iOS',
  Android: 'Android',
  Windows: 'Windows',
  Macbook: 'MacOS',
  'Android TV': 'Android TV',
}

const DEVICE_NAMES: Record<InstallPlatform, string> = {
  IOS: 'iPhone',
  Android: 'Android-устройства',
  Windows: 'Windows',
  Macbook: 'Mac',
  'Android TV': 'Android TV',
}

const INSTALL_TARGETS: Record<InstallPlatform, string> = {
  IOS: 'iPhone',
  Android: 'Android-устройстве',
  Windows: 'компьютере',
  Macbook: 'Mac',
  'Android TV': 'Android TV',
}

function getSecondButton(platform: InstallPlatform): string | null {
  if (platform === 'IOS') return 'Версия для зарубежного AppStore'
  if (platform === 'Android TV') return 'Скачать APK'
  return null
}

export function InstallSheet({
  isMounted,
  isVisible,
  platform,
  currentDevice,
  onClose,
}: InstallSheetProps) {
  const [copied, setCopied] = useState(false)
  const isMismatch = !!currentDevice && currentDevice !== platform
  const secondButton = getSecondButton(platform)
  const downloadLink = DOWNLOAD_LINKS[platform]

  const handleProceed = () => {
    const link = isMismatch
      ? downloadLink
      : DOWNLOAD_LINKS[currentDevice ?? platform]
    openInNewTab(link)
    onClose()
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(downloadLink)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  if (isMismatch) {
    return (
      <BottomSheet
        isMounted={isMounted}
        isVisible={isVisible}
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
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Скопировать ссылку"
              className="bg-primary text-white rounded-full cursor-pointer shrink-0 w-[46px] h-[46px] flex items-center justify-center"
            >
              {copied ? (
                <CheckmarkIcon className="w-5 h-5" fill="white" />
              ) : (
                <CopyIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </BottomSheet>
    )
  }

  return (
    <BottomSheet
      isMounted={isMounted}
      isVisible={isVisible}
      title="Важная информация"
      onClose={onClose}
    >
      <p className="text-white/80 text-[16px] leading-[130%]">{DESCRIPTION}</p>
      <div className="flex flex-col gap-2">
        <PrimaryButton size="large" onClick={handleProceed}>
          Хорошо, перейти к установке
        </PrimaryButton>
        {secondButton && (
          <PrimaryButton size="large" variant="secondary">
            {secondButton}
          </PrimaryButton>
        )}
      </div>
    </BottomSheet>
  )
}
