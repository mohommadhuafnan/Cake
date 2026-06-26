import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/currency'

export default function CouponApply({ compact = false }) {
  const { t } = useLanguage()
  const { coupon, applyCoupon, removeCoupon, couponError, subtotal } = useCart()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  const handleApply = async (e) => {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    await applyCoupon(code.trim(), subtotal)
    setLoading(false)
  }

  if (coupon) {
    return (
      <div className={`flex items-center justify-between gap-3 ${compact ? 'text-sm' : ''}`}>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-mono rounded">{coupon.code}</span>
          <span className="text-green-600 text-xs">Applied</span>
        </div>
        <button type="button" onClick={removeCoupon} className="text-xs text-muted hover:text-red-500">
          Remove
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleApply} className={compact ? 'space-y-2' : 'space-y-3'}>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder={t('cart.coupon')}
          className={`input-field flex-1 ${compact ? 'text-sm py-2' : ''}`}
        />
        <button type="submit" disabled={loading} className={`btn-outline shrink-0 ${compact ? 'text-xs px-4 py-2' : ''}`}>
          {loading ? '…' : t('cart.apply')}
        </button>
      </div>
      {couponError && <p className="text-red-500 text-xs">{couponError}</p>}
    </form>
  )
}

export function formatCouponLabel(coupon) {
  if (coupon.type === 'percentage') return `${coupon.value}% off`
  return `${formatPrice(Number(coupon.value))} off`
}
