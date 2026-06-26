import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useSite } from '../context/SiteContext'
import { useTypewriter } from '../hooks/useTypewriter'

const NAV_OFFSET = '6.75rem'

const DEFAULT_HERO_IMAGES = [
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1920&q=80',
  'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=1920&q=80',
  'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=1920&q=80',
  'https://images.unsplash.com/photo-1606890737304-57a1aa8aef7e?w=1920&q=80',
]

export default function HeroSection() {
  const { t } = useLanguage()
  const { settings, heroImages } = useSite()
  const images = heroImages.length > 0 ? heroImages : DEFAULT_HERO_IMAGES
  const [current, setCurrent] = useState(0)
  const title = settings.hero_title || t('hero.title')
  const subtitle = settings.hero_subtitle || t('hero.subtitle')
  const tagline = settings.tagline || t('tagline')
  const { display, done } = useTypewriter(title, 50, 600)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [images.length])

  const scrollToContent = () => {
    document.getElementById('home-collections')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      className="hero-fullscreen relative flex flex-col items-center justify-center overflow-hidden -mt-[6.75rem] pt-[6.75rem]"
      style={{ minHeight: `calc(100dvh + ${NAV_OFFSET})` }}
    >
      {/* Background image loop — fills entire section */}
      {images.map((src, i) => (
        <div
          key={src}
          className={`hero-bg-slide absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === current ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden={i !== current}
        >
          <img
            src={src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/55 to-white/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/30" />

      {/* Content — vertically centered in visible viewport */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-6 py-8 text-center w-full">
        <div className="glass-ios inline-block px-5 py-2 rounded-full mb-6 hero-subtext">
          <p className="text-gold uppercase tracking-[0.25em] text-[10px] md:text-xs font-medium">
            {tagline}
          </p>
        </div>

        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-charcoal leading-[1.1] mb-5 min-h-[2.4em] md:min-h-[2.2em]">
          <span>{display}</span>
          <span className={`typewriter-cursor ${done ? 'typewriter-cursor--done' : ''}`}>|</span>
        </h1>

        <p
          className={`text-muted text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed transition-all duration-700 ${
            done ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {subtitle}
        </p>

        <div
          className={`flex flex-col sm:flex-row gap-3 justify-center transition-all duration-700 delay-200 ${
            done ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Link to={`/shop`} className="btn-primary btn-shimmer px-10">
            {t('hero.cta')}
          </Link>
          <Link to={`/custom`} className="btn-glass px-10">
            {t('hero.ctaSecondary')}
          </Link>
        </div>
      </div>

      {/* Bottom bar: slide dots + scroll down */}
      <div className="relative z-10 w-full pb-8 md:pb-10 flex flex-col items-center gap-5">
        <div className="flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1 rounded-full transition-all duration-500 ${i === current ? 'w-8 bg-gold' : 'w-3 bg-charcoal/20 hover:bg-charcoal/40'}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={scrollToContent}
          className="scroll-down-btn flex flex-col items-center gap-2 text-charcoal/60 hover:text-gold transition-colors group"
          aria-label={t('hero.scrollDown')}
        >
          <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-medium">
            {t('hero.scrollDown')}
          </span>
          <span className="scroll-down-arrow flex flex-col items-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </span>
        </button>
      </div>
    </section>
  )
}
