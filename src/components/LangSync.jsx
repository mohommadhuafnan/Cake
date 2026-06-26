import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export default function LangSync({ children }) {
  const { lang } = useParams()
  const { setLang } = useLanguage()

  useEffect(() => {
    if (lang === 'en' || lang === 'ar') {
      setLang(lang)
    }
  }, [lang, setLang])

  return children
}
