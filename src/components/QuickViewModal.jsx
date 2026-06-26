import { useLanguage } from '../context/LanguageContext'
import { formatPrice } from '../utils/currency'

export default function QuickViewModal({ product, onClose, onAddToCart }) {
  const { lang, localized, t } = useLanguage()
  if (!product) return null

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white max-w-2xl w-full grid md:grid-cols-2 shadow-2xl animate-[heroFadeUp_0.4s_ease]">
        <img src={product.image} alt={localized(product.name)} className="w-full h-64 md:h-full object-cover" />
        <div className="p-8">
          <button onClick={onClose} className="absolute top-4 end-4 text-charcoal hover:text-gold" aria-label={t('common.close')}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="font-display text-2xl mb-2">{localized(product.name)}</h2>
          <p className="text-gold text-lg mb-4">{formatPrice(product.price, lang)}</p>
          <p className="text-muted text-sm mb-6 leading-relaxed">{localized(product.description)}</p>
          <button
            onClick={() => { onAddToCart(product); onClose() }}
            className="btn-primary w-full"
          >
            {t('shop.addToCart')}
          </button>
        </div>
      </div>
    </div>
  )
}
