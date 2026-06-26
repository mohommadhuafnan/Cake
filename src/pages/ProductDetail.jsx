import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import ProductCard from '../components/ProductCard'
import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import { products } from '../data/products'
import { formatPrice } from '../utils/currency'
import { triggerAddToCartAnimation } from '../hooks/useScrollAnimations'

export default function ProductDetail() {
  const { id } = useParams()
  const { lang, t, localized } = useLanguage()
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  const product = products.find((p) => p.id === Number(id))
  if (!product) {
    return (
      <Layout>
        <div className="text-center py-32">
          <p className="text-muted mb-4">Product not found</p>
          <Link to={`/shop`} className="btn-outline">{t('nav.shop')}</Link>
        </div>
      </Layout>
    )
  }

  const images = product.images || [product.image]
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3)

  const handleAddToCart = (e) => {
    addItem(product, quantity)
    triggerAddToCartAnimation(e.currentTarget, document.getElementById('cart-badge'))
  }

  return (
    <Layout title={localized(product.name)} description={localized(product.description)}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <img
              src={images[activeImage]}
              alt={localized(product.name)}
              className="slide-image slide-image--left w-full aspect-square object-cover bg-ivory mb-4"
            />
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 overflow-hidden border-2 transition-colors ${i === activeImage ? 'border-gold' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h1 className="font-display text-4xl md:text-5xl mb-2 fade-up">{localized(product.name)}</h1>
            <div className="flex items-center gap-3 mb-6 fade-up">
              <p className="text-gold text-2xl">{formatPrice(product.price, lang)}</p>
              <span className="text-muted text-sm">★ {product.rating} ({product.reviews} {t('product.reviews')})</span>
            </div>
            <p className="text-muted leading-relaxed mb-8 fade-up">{localized(product.description)}</p>

            <div className="flex items-center gap-4 mb-8 fade-up">
              <span className="text-sm uppercase tracking-widest">{t('product.quantity')}</span>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 border border-gray-200 hover:border-gold transition-colors">−</button>
              <span className="w-8 text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 border border-gray-200 hover:border-gold transition-colors">+</button>
            </div>

            <button onClick={handleAddToCart} disabled={product.stock === 0} className="btn-primary w-full md:w-auto fade-up">
              {t('product.addToCart')}
            </button>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="font-display text-3xl mb-8 fade-up">{t('product.related')}</h2>
            <div className="stagger-grid grid grid-cols-1 sm:grid-cols-3 gap-8">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  )
}
