'use client'

import { useStore } from '@/store/useStore'
import { translations, type TranslationKey } from '@/i18n/translations'

// Hook សម្រាប់ប្រើប្រាស់ភាសាពីរ
export function useTranslation() {
  const locale = useStore((state) => state.locale)
  const setLocale = useStore((state) => state.setLocale)

  const t = (key: TranslationKey): string => {
    return translations[locale][key] || translations.km[key] || key
  }

  return { t, locale, setLocale }
}
