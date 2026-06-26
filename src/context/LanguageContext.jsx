import { createContext, useContext, useEffect, useCallback } from 'react'
import en from '../locales/en.json'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  useEffect(() => {
    document.documentElement.lang = 'en'
    document.documentElement.dir = 'ltr'
  }, [])

  const t = useCallback((key) => {
    const keys = key.split('.')
    let value = en
    for (const k of keys) {
      value = value?.[k]
    }
    return value ?? key
  }, [])

  return (
    <LanguageContext.Provider value={{ t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
