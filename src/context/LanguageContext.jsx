import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import en from '../locales/en.json'
import ar from '../locales/ar.json'

const translations = { en, ar }
const LanguageContext = createContext()

function detectLanguage() {
  const stored = localStorage.getItem('lang')
  if (stored && translations[stored]) return stored
  const browserLang = navigator.language?.split('-')[0]
  return browserLang === 'ar' ? 'ar' : 'en'
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectLanguage)

  const setLang = useCallback((newLang) => {
    setLangState(newLang)
    localStorage.setItem('lang', newLang)
    document.documentElement.lang = newLang
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr'
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  const t = useCallback(
    (key) => {
      const keys = key.split('.')
      let value = translations[lang]
      for (const k of keys) {
        value = value?.[k]
      }
      return value ?? key
    },
    [lang]
  )

  const localized = useCallback(
    (obj) => (typeof obj === 'object' && obj !== null ? obj[lang] || obj.en : obj),
    [lang]
  )

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, localized }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
