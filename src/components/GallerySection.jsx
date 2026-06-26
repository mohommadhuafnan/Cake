import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const FALLBACKS = {
  1: 'https://images.unsplash.com/photo-1486427949362-c0aa028e0666?w=800&q=80',
  2: 'https://images.unsplash.com/photo-1606317138400-f2899e2919ee?w=800&q=80',
  3: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80',
  4: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80',
  5: 'https://images.unsplash.com/photo-1625866448531-1b00c0251f76?w=800&q=80',
  6: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&q=80',
}

/** Masonry slot classes — tall left + staggered right (matches reference layout) */
const SLOTS = [
  'md:col-span-5 md:row-span-2 md:row-start-1 md:col-start-1 aspect-[3/4] md:aspect-auto md:min-h-[520px]',
  'md:col-span-4 md:row-span-1 md:row-start-1 md:col-start-6 aspect-[4/3] md:aspect-auto md:min-h-[248px]',
  'md:col-span-3 md:row-span-1 md:row-start-1 md:col-start-10 aspect-[4/3] md:aspect-auto md:min-h-[248px]',
  'md:col-span-3 md:row-span-1 md:row-start-2 md:col-start-10 aspect-[4/3] md:aspect-auto md:min-h-[248px]',
  'md:col-span-4 md:row-span-1 md:row-start-2 md:col-start-6 aspect-[4/3] md:aspect-auto md:min-h-[248px]',
  'md:col-span-12 md:row-start-3 aspect-[21/9] md:min-h-[200px]',
]

function GalleryTile({ item, slotClass, lang, localized, t }) {
  return (
    <Link
      to={`/${lang}/product/${item.id}`}
      className={`gallery-item stagger-card group relative overflow-hidden rounded-3xl bg-white ${slotClass} block transition-all duration-500 hover:shadow-xl hover:-translate-y-1`}
    >
      <img
        src={item.src}
        alt={localized(item.name)}
        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
        onError={(e) => { e.currentTarget.src = FALLBACKS[item.id] || FALLBACKS[1] }}
      />

      <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-colors duration-500" />

      <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
        <div className="glass-ios rounded-xl px-4 py-3 inline-block">
          <p className="font-display text-lg text-charcoal leading-tight">{localized(item.name)}</p>
          <span className="text-xs text-gold uppercase tracking-wider mt-1 inline-block">{t('common.view')} →</span>
        </div>
      </div>
    </Link>
  )
}

export default function GallerySection({ items }) {
  const { lang, localized, t } = useLanguage()
  const tiles = items.slice(0, SLOTS.length)

  return (
    <section className="py-10 md:py-16 bg-ivory" id="home-gallery">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-10 md:mb-12 fade-up">
          <h2 className="font-display text-4xl text-charcoal">{t('gallery.title')}</h2>
          <p className="text-muted mt-3 text-sm md:text-base">{t('gallery.subtitle')}</p>
        </div>

        <div className="stagger-grid grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5 md:grid-rows-[minmax(248px,1fr)_minmax(248px,1fr)]">
          {tiles.map((item, i) => (
            <GalleryTile
              key={item.id}
              item={item}
              slotClass={SLOTS[i]}
              lang={lang}
              localized={localized}
              t={t}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
