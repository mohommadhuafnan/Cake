import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/currency'
import { Link } from 'react-router-dom'

export default function CartDrawer() {
  const { lang, t, localized } = useLanguage()
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, subtotal, total } = useCart()

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[70]" onClick={() => setIsOpen(false)} />
      )}
      <div className={`cart-drawer glass-panel fixed top-0 end-0 h-full w-full max-w-md z-[80] shadow-2xl flex flex-col ${isOpen ? 'open' : ''}`}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="font-display text-2xl">{t('cart.title')}</h2>
            <button onClick={() => setIsOpen(false)} className="text-charcoal hover:text-gold" aria-label={t('common.close')}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <p className="text-muted text-center py-12">{t('cart.empty')}</p>
            ) : (
              <ul className="space-y-6">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4">
                    <img src={item.image} alt={localized(item.name)} className="w-20 h-20 object-cover bg-ivory" />
                    <div className="flex-1">
                      <h3 className="font-display text-sm">{localized(item.name)}</h3>
                      <p className="text-gold text-sm">{formatPrice(item.price, lang)}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 border border-gray-200 flex items-center justify-center hover:border-gold transition-colors"
                        >
                          −
                        </button>
                        <span className="text-sm w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 border border-gray-200 flex items-center justify-center hover:border-gold transition-colors"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ms-auto text-xs text-muted hover:text-red-500 transition-colors"
                        >
                          {t('common.delete')}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-6 border-t border-gray-100">
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-muted">{t('cart.subtotal')}</span>
                <span>{formatPrice(subtotal, lang)}</span>
              </div>
              <div className="flex justify-between mb-6 font-medium">
                <span>{t('cart.total')}</span>
                <span className="text-gold">{formatPrice(total, lang)}</span>
              </div>
              <Link
                to={`/${lang}/checkout`}
                onClick={() => setIsOpen(false)}
                className="btn-primary w-full text-center"
              >
                {t('cart.checkout')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
