import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { formatPrice } from '../../utils/currency'
import { useWishlist } from '../../hooks/useWishlist'

export default function ShopProductCard({ product }) {
  const { t } = useLanguage()
  const { isFavorite, toggle } = useWishlist(product.id)
  const images = product.images?.length ? product.images : [product.image]

  return (
    <article className="group">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-ivory mb-3">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          <button
            type="button"
            onClick={toggle}
            className="absolute top-3 end-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform z-10"
            aria-label={isFavorite ? 'Remove from wishlist' : t('product.addToWishlist')}
          >
            <svg className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'fill-none text-charcoal'}`} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {images.length > 1 && (
            <div className="absolute bottom-3 start-3 flex gap-1">
              {images.slice(0, 4).map((_, i) => (
                <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/50'}`} />
              ))}
            </div>
          )}

          <span className="absolute bottom-3 end-3 px-4 py-1.5 bg-white text-charcoal text-xs font-medium rounded-full border border-gray-200 shadow-sm group-hover:opacity-100 transition-opacity">
            {t('shop.viewProduct')}
          </span>
        </div>

        <h3 className="text-sm font-medium text-charcoal leading-snug mb-1 line-clamp-2 group-hover:text-gold transition-colors">
          {product.name}
        </h3>
        <p className="text-sm font-semibold text-charcoal">{formatPrice(product.price)}</p>
      </Link>
    </article>
  )
}
