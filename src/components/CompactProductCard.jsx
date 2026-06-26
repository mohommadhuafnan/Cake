import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/currency'
import { triggerAddToCartAnimation } from '../hooks/useScrollAnimations'
import { useWishlist } from '../hooks/useWishlist'

// Unique fallback per product so duplicates never appear side by side
const FALLBACKS = {
  1: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80',
  2: 'https://images.unsplash.com/photo-1541781286675-b07360f8671b?w=600&q=80',
  3: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80',
  4: 'https://images.unsplash.com/photo-1571115764595-644a1f54a55?w=600&q=80',
  5: 'https://images.unsplash.com/photo-1599785209796-786432fb7aa7?w=600&q=80',
  6: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600&q=80',
}
const DEFAULT_FALLBACK = FALLBACKS[1]

function truncate(text, max = 72) {
  if (!text || text.length <= max) return text
  return `${text.slice(0, max).trim()}…`
}

export default function CompactProductCard({ product }) {
  const { lang, localized, t } = useLanguage()
  const { addItem } = useCart()
  const { isFavorite, toggle } = useWishlist(product.id)
  const [imgSrc, setImgSrc] = useState(product.image)

  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    triggerAddToCartAnimation(e.currentTarget, document.getElementById('cart-badge'))
  }

  const fullStars = Math.round(product.rating)
  const description = truncate(localized(product.description))

  return (
    <article className="carousel-card-slot compact-product-card flex-shrink-0 w-[252px] md:w-[280px] h-[440px] bg-white rounded-2xl overflow-hidden border border-gray-100/80 shadow-sm group transition-all duration-500 hover:shadow-xl hover:-translate-y-2 flex flex-col">
      <Link to={`/${lang}/product/${product.id}`} className="flex flex-col flex-1 min-h-0">
        <div className="relative h-[190px] md:h-[200px] flex-shrink-0 overflow-hidden bg-ivory">
          <img
            src={imgSrc}
            alt={localized(product.name)}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            onError={() => setImgSrc(FALLBACKS[product.id] || DEFAULT_FALLBACK)}
          />
          <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/10 transition-colors duration-500" />
          <button
            type="button"
            onClick={toggle}
            className={`absolute top-3 end-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
              isFavorite
                ? 'bg-red-50 text-red-500 scale-110'
                : 'bg-white/95 text-muted hover:text-red-400 hover:scale-110'
            }`}
            aria-label={t('product.addToWishlist')}
          >
            {isFavorite ? '♥' : '♡'}
          </button>
        </div>

        <div className="flex flex-col flex-1 p-4 md:p-5 min-h-0">
          <div className="flex items-center gap-0.5 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`text-[11px] leading-none ${i < fullStars ? 'text-gold' : 'text-gray-200'}`}>★</span>
            ))}
            <span className="text-[11px] text-muted ms-1.5">({product.rating})</span>
          </div>

          <h3 className="font-display text-[15px] md:text-base text-charcoal leading-snug line-clamp-1 mb-1.5 group-hover:text-gold transition-colors duration-300">
            {localized(product.name)}
          </h3>

          <p className="text-muted text-[11px] md:text-xs leading-relaxed line-clamp-2 mb-3 flex-1">
            {description}
          </p>

          <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100 mt-auto">
            <span className="font-semibold text-charcoal text-sm whitespace-nowrap">
              {formatPrice(product.price, lang)}
            </span>
            <button
              type="button"
              onClick={handleAdd}
              disabled={product.stock === 0}
              className="flex items-center justify-center gap-1.5 min-w-[72px] px-3 py-2 bg-gold/10 text-gold text-xs font-semibold rounded-lg hover:bg-gold hover:text-white transition-all duration-300 disabled:opacity-40 shrink-0 group-hover:bg-gold group-hover:text-white"
            >
              {t('shop.addToCart').split(' ')[0]}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </button>
          </div>
        </div>
      </Link>
    </article>
  )
}
