import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { heroSlides } from '../data/homeContent'

const FALLBACK = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1920&q=80'
const BANNER_HEIGHT = 'h-[460px] md:h-[520px]'

export default function HeroBannerCarousel() {
  const { lang, localized } = useLanguage()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative overflow-hidden bg-charcoal">
      <div className={`relative w-full ${BANNER_HEIGHT}`}>
        {heroSlides.map((slide, i) => (
          <div
            key={slide.id}
            className={`hero-banner-slide absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            aria-hidden={i !== current}
          >
            {/* Full-size background — same dimensions every slide */}
            <img
              src={slide.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-center"
              loading={i === 0 ? 'eager' : 'lazy'}
              onError={(e) => { e.currentTarget.src = FALLBACK }}
            />

            {/* Dark gradient — text on top */}
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/55 to-charcoal/25" />

            {/* Content */}
            <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-8 flex items-center">
              <div className="max-w-xl text-white">
                <span className="inline-block px-3 py-1 glass-ios text-xs uppercase tracking-widest mb-4 rounded-full text-gold">
                  {localized(slide.tag)}
                </span>
                <h2 className="font-display text-3xl md:text-5xl lg:text-6xl mb-4 leading-tight">
                  {localized(slide.title)}
                </h2>
                <p className="text-white/80 text-sm md:text-base mb-8 max-w-md leading-relaxed">
                  {localized(slide.description)}
                </p>
                <Link
                  to={`/${lang}/product/${slide.productId}`}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold text-charcoal font-semibold uppercase tracking-wider text-sm hover:bg-white transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  {localized(slide.cta)}
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? 'w-8 bg-gold' : 'w-3 bg-white/40 hover:bg-white/70'}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Arrows */}
        <button
          type="button"
          onClick={() => setCurrent((c) => (c - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass-ios text-charcoal hover:text-gold transition-colors hidden md:flex items-center justify-center"
          aria-label="Previous slide"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => setCurrent((c) => (c + 1) % heroSlides.length)}
          className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass-ios text-charcoal hover:text-gold transition-colors hidden md:flex items-center justify-center"
          aria-label="Next slide"
        >
          ›
        </button>
      </div>
    </section>
  )
}
