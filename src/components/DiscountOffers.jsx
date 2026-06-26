import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import { getActiveCoupons } from '../services/supabaseDb'
import { formatCouponLabel } from './CouponApply'

export default function DiscountOffers() {
  const { t } = useLanguage()
  const { applyCoupon, subtotal } = useCart()
  const [coupons, setCoupons] = useState([])
  const [copied, setCopied] = useState('')

  useEffect(() => {
    getActiveCoupons().then(setCoupons).catch(() => setCoupons([]))
  }, [])

  if (coupons.length === 0) return null

  const copyCode = async (code) => {
    await navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <section className="py-10 md:py-12 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl md:text-3xl text-charcoal">{t('offers.title')}</h2>
          <p className="text-muted text-sm mt-2">{t('offers.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {coupons.map((c) => (
            <div
              key={c.id || c.code}
              className="relative border border-gold/30 bg-gradient-to-br from-ivory to-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="absolute top-0 end-0 w-16 h-16 bg-gold/10 rounded-bl-full" />
              <p className="text-gold text-xs uppercase tracking-widest mb-1">{formatCouponLabel(c)}</p>
              <p className="font-display text-2xl font-mono text-charcoal mb-2">{c.code}</p>
              {Number(c.min_order) > 0 && (
                <p className="text-muted text-xs mb-4">Min. order {Number(c.min_order).toLocaleString('en-QA')} QAR</p>
              )}
              <div className="flex gap-2">
                <button type="button" onClick={() => copyCode(c.code)} className="btn-outline text-xs flex-1 py-2">
                  {copied === c.code ? 'Copied!' : 'Copy code'}
                </button>
                <button type="button" onClick={() => applyCoupon(c.code, subtotal)} className="btn-primary text-xs flex-1 py-2">
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
