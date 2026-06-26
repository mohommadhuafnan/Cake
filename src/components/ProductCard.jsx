import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/currency'
import { triggerAddToCartAnimation } from '../hooks/useScrollAnimations'
import { Link } from 'react-router-dom'

export default function ProductCard({ product, onQuickView }) {
  const { t } = useLanguage()
  const { addItem } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    const btn = e.currentTarget
    const badge = document.getElementById('cart-badge')
    triggerAddToCartAnimation(btn, badge)
  }

  return (
    <div className="product-card stagger-card bg-white group">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden aspect-[4/5] bg-ivory">
          <img
            src={product.image}
            alt={product.name}
            className="product-card__image w-full h-full object-cover"
            loading="lazy"
          />
          {product.stock <= 3 && product.stock > 0 && (
            <span className="absolute top-3 start-3 bg-gold text-white text-xs px-2 py-1 uppercase tracking-wider">
              Low Stock
            </span>
          )}
          <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              onClick={(e) => { e.preventDefault(); onQuickView?.(product) }}
              className="px-4 py-2 bg-white text-charcoal text-xs uppercase tracking-widest font-medium"
            >
              {t('shop.quickView')}
            </button>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-display text-lg mb-1">{product.name}</h3>
          <div className="flex items-center justify-between">
            <p className="text-gold font-medium">{formatPrice(product.price)}</p>
            <div className="flex items-center gap-1 text-xs text-muted">
              <span className="text-gold">★</span> {product.rating}
            </div>
          </div>
        </div>
      </Link>
      <div className="px-5 pb-5">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full py-2.5 border border-charcoal text-charcoal text-xs uppercase tracking-widest font-medium hover:bg-charcoal hover:text-white transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {product.stock === 0 ? t('shop.outOfStock') : t('shop.addToCart')}
        </button>
      </div>
    </div>
  )
}
