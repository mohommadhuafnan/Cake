import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { welcomeOffer } from '../data/homeContent'

export default function OfferPopup() {
  const { lang, localized } = useLanguage()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem('offer-dismissed')
    if (!dismissed) {
      const timer = setTimeout(() => setOpen(true), 2500)
      return () => clearTimeout(timer)
    }
  }, [])

  const dismiss = () => {
    sessionStorage.setItem('offer-dismissed', 'true')
    setOpen(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[heroFadeUp_0.3s_ease]" onClick={dismiss} />
      <div className="offer-popup glass-panel relative max-w-md w-full p-8 md:p-10 text-center shadow-2xl animate-[heroFadeUp_0.5s_ease] overflow-hidden rounded-2xl">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
        <button onClick={dismiss} className="absolute top-4 end-4 text-muted hover:text-charcoal transition-colors" aria-label="Close">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-5xl mb-4">🎁</div>
        <h2 className="font-display text-3xl text-charcoal mb-2">{localized(welcomeOffer.title)}</h2>
        <p className="text-muted text-sm mb-6 leading-relaxed">{localized(welcomeOffer.description)}</p>

        <div className="inline-block px-6 py-3 border-2 border-dashed border-gold text-gold font-display text-2xl tracking-widest mb-6">
          {welcomeOffer.code}
        </div>

        <Link
          to={`/shop`}
          onClick={dismiss}
          className="btn-primary w-full block"
        >
          {localized(welcomeOffer.cta)}
        </Link>
      </div>
    </div>
  )
}
