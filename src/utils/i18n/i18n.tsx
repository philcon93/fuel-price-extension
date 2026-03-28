import { createContext, useContext, type ParentComponent } from 'solid-js'
import en from './locales/en.json'

export type Translations = Record<string, string>

const locales: Record<string, Translations> = { en }

export function getBrowserLocale(): string {
  return (typeof navigator !== 'undefined' ? navigator.language : 'en').split('-')[0]
}

function getTranslations(): Translations {
  const lang = getBrowserLocale()
  return locales[lang] ?? locales.en ?? en
}

const I18nContext = createContext<Translations>(en as Translations)

export const I18nProvider: ParentComponent = (props) => {
  const translations = getTranslations()
  return <I18nContext.Provider value={translations}>{props.children}</I18nContext.Provider>
}

export function useI18n(): Translations {
  return useContext(I18nContext)
}

export function substitute(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? `{{${key}}}`)
}
