import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/currency'

export default function CartPage() {
  const { lang, t, localized } = useLanguage()
  const { items, removeItem, updateQuantity, subtotal, total, discount } = useCart()

  return (
    <Layout title={t('cart.title')}>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="font-display text-5xl mb-12 fade-up">{t('cart.title')}</h1>

        {items.length === 0 ? (
          <div className="text-center py-16 fade-up">
            <p className="text-muted mb-6">{t('cart.empty')}</p>
            <Link to={`/shop`} className="btn-primary">{t('nav.shop')}</Link>
          </div>
        ) : (
          <>
            <ul className="space-y-6 mb-12">
              {items.map((item) => (
                <li key={item.id} className="flex gap-6 p-4 border border-gray-100 fade-up">
                  <img src={item.image} alt={localized(item.name)} className="w-24 h-24 object-cover bg-ivory" />
                  <div className="flex-1">
                    <h3 className="font-display text-lg">{localized(item.name)}</h3>
                    <p className="text-gold">{formatPrice(item.price, lang)}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 border hover:border-gold transition-colors">−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 border hover:border-gold transition-colors">+</button>
                      <button onClick={() => removeItem(item.id)} className="ms-auto text-sm text-muted hover:text-red-500">{t('common.delete')}</button>
                    </div>
                  </div>
                  <p className="font-medium">{formatPrice(item.price * item.quantity, lang)}</p>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-100 pt-6 fade-up">
              <div className="flex justify-between mb-2"><span>{t('cart.subtotal')}</span><span>{formatPrice(subtotal, lang)}</span></div>
              {discount > 0 && <div className="flex justify-between mb-2 text-green-600"><span>{t('cart.discount')}</span><span>-{formatPrice(discount, lang)}</span></div>}
              <div className="flex justify-between text-xl font-medium mb-8"><span>{t('cart.total')}</span><span className="text-gold">{formatPrice(total, lang)}</span></div>
              <Link to={`/checkout`} className="btn-primary">{t('cart.checkout')}</Link>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}
