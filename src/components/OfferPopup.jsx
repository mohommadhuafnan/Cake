import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import { getActiveCoupons } from '../services/supabaseDb'
import { formatCouponLabel } from './CouponApply'

export default function OfferPopup() {
  const { applyCoupon } = useCart()
  const [open, setOpen] = useState(false)
  const [offer, setOffer] = useState(null)

  useEffect(() => {
    const dismissed = sessionStorage.getItem('offer-dismissed')
    if (dismissed) return undefined

    let timer
    getActiveCoupons()
      .then((coupons) => {
        if (coupons.length > 0) {
          setOffer(coupons[0])
          timer = setTimeout(() => setOpen(true), 2500)
        }
      })
      .catch(() => {})

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [])

  const dismiss = () => {
    sessionStorage.setItem('offer-dismissed', 'true')
    setOpen(false)
  }

  if (!open || !offer) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[heroFadeUp_0.3s_ease]" onClick={dismiss} />
      <div className="offer-popup glass-panel relative max-w-md w-full p-8 md:p-10 text-center shadow-2xl animate-[heroFadeUp_0.5s_ease] overflow-hidden rounded-2xl">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
        <button onClick={dismiss} className="absolute top-4 end-4 text-muted hover:text-charcoal transition-colors" aria-label="Close">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-5xl mb-4">🎁</div>
        <h2 className="font-display text-3xl text-charcoal mb-2">Special Offer!</h2>
        <p className="text-gold text-sm uppercase tracking-widest mb-2">{formatCouponLabel(offer)}</p>
        <p className="text-muted text-sm mb-6 leading-relaxed">
          Use this code at checkout{Number(offer.min_order) > 0 ? ` on orders over QAR ${offer.min_order}` : ''}.
        </p>

        <div className="inline-block px-6 py-3 border-2 border-dashed border-gold text-gold font-display text-2xl tracking-widest mb-6">
          {offer.code}
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => { applyCoupon(offer.code, 0); dismiss() }}
            className="btn-primary w-full"
          >
            Apply & Shop
          </button>
          <Link to="/shop" onClick={dismiss} className="btn-outline w-full block text-center">
            Browse Cakes
          </Link>
        </div>
      </div>
    </div>
  )
}
