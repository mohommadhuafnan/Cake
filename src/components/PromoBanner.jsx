import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const FALLBACK = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&q=80'

export default function PromoBanner({ banner }) {
  const { lang, localized } = useLanguage()

  return (
    <section className="py-10 bg-ivory">
      <div className="max-w-7xl mx-auto px-6">
        <Link
          to={`/${lang}/${banner.link}`}
          className="promo-banner group relative block overflow-hidden rounded-2xl h-[280px] md:h-[320px] fade-up"
        >
          <img
            src={banner.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={(e) => { e.currentTarget.src = FALLBACK }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/60 to-charcoal/30 group-hover:from-charcoal/95 transition-colors duration-500" />
          <div className="relative z-10 h-full flex items-center p-8 md:p-12 max-w-lg">
            <div>
              <h2 className="font-display text-3xl md:text-5xl text-white mb-2 group-hover:text-gold transition-colors duration-300">
                {localized(banner.title)}
              </h2>
              <p className="text-white/75 text-sm md:text-base mb-6 uppercase tracking-widest group-hover:text-white/90 transition-colors">
                {localized(banner.subtitle)}
              </p>
              <span className="inline-flex items-center gap-2 px-6 py-2.5 bg-gold text-charcoal text-sm font-bold uppercase tracking-wider rounded-full group-hover:scale-105 transition-transform duration-300">
                {localized(banner.cta)} →
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  )
}
