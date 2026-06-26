import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { announcements } from '../data/homeContent'

export default function AnnouncementBar() {
  const { localized } = useLanguage()
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % announcements.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  if (!visible) return null

  return (
    <div className="announcement-bar fixed top-0 left-0 right-0 z-[60] bg-charcoal text-white h-9 flex items-center justify-center text-xs tracking-wide overflow-hidden">
      <div className="announcement-slide flex items-center gap-2 px-4" key={index}>
        <span className="animate-[heroFadeUp_0.5s_ease]">{localized(announcements[index].text)}</span>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute end-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-1"
        aria-label="Close announcement"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
