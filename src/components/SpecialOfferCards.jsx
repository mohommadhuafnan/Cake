import { Link } from 'react-router-dom'
import { useCms } from '../context/SiteContext'
import { specialOffers as fallback } from '../data/homeContent'

function mapOffer(o) {
  return {
    id: o.id,
    title: o.title,
    cta: o.cta || 'Shop Now',
    image: o.image,
    bg: o.meta?.bg || 'from-blush to-[#F5D5DA]',
    link: o.link || 'shop',
  }
}

export default function SpecialOfferCards() {
  const cmsItems = useCms('special_offer')
  const specialOffers = cmsItems.length > 0 ? cmsItems.map(mapOffer) : fallback

  return (
    <section className="py-6 md:py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="stagger-grid grid grid-cols-1 md:grid-cols-3 gap-5">
          {specialOffers.map((offer) => (
            <Link
              key={offer.id}
              to={`/${offer.link}`}
              className={`offer-card stagger-card group relative overflow-hidden rounded-2xl bg-gradient-to-br ${offer.bg} min-h-[180px] flex flex-row items-center justify-between p-5 md:p-6 gap-4 transition-all duration-500 hover:shadow-xl hover:-translate-y-1`}
            >
              <div className="relative z-10 flex-1 min-w-0">
                <h3 className="font-display text-lg md:text-xl text-charcoal mb-3 group-hover:text-gold transition-colors leading-snug">
                  {offer.title}
                </h3>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-charcoal glass-ios px-3 py-1.5 rounded-full group-hover:bg-gold/90 group-hover:text-white transition-all duration-300">
                  {offer.cta} →
                </span>
              </div>

              <div className="relative z-10 flex-shrink-0 w-[100px] h-[100px] md:w-[110px] md:h-[110px] rounded-xl overflow-hidden shadow-md ring-2 ring-white/50">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
