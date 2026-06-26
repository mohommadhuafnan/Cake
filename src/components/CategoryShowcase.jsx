import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { showcaseCategories } from '../data/homeContent'

export default function CategoryShowcase() {
  const { lang, localized, t } = useLanguage()

  return (
    <section className="py-10 md:py-14 bg-white" id="home-collections">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="stagger-grid grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {showcaseCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/${lang}/${cat.link}`}
              className="showcase-card stagger-card group relative overflow-hidden rounded-2xl min-h-[320px] md:min-h-[400px] flex flex-col transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
            >
              {/* Full-size background image */}
              <img
                src={cat.image}
                alt={localized(cat.title)}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                loading="lazy"
              />

              {/* Gradient overlay — text readable on top */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/45 to-charcoal/25 transition-all duration-500 group-hover:from-charcoal/95 group-hover:via-charcoal/55" />

              {/* Shine on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-gold/20 via-transparent to-transparent pointer-events-none" />

              {/* Text on top */}
              <div className="relative z-10 flex flex-col h-full p-6 md:p-8">
                <div className="mt-auto">
                  <h3 className="font-display text-2xl md:text-3xl text-white mb-2 group-hover:text-gold transition-colors duration-300 leading-tight">
                    {localized(cat.title)}
                  </h3>
                  <p className="text-white/75 text-sm md:text-base mb-5 leading-relaxed max-w-[90%] group-hover:text-white/90 transition-colors duration-300">
                    {localized(cat.subtitle)}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-gold uppercase tracking-wider group-hover:gap-3 transition-all duration-300">
                    {t('common.view')}
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
