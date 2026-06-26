import { useState } from 'react'
import Layout from '../components/Layout'
import { useLanguage } from '../context/LanguageContext'
import { formatPrice } from '../utils/currency'
import { api } from '../utils/api'
import { isSupabaseConfigured } from '../lib/supabase'
import { trackOrder } from '../services/supabaseDb'

const STATUSES = ['pending', 'confirmed', 'baking', 'ready', 'delivered']

export default function OrderTracking() {
  const { t } = useLanguage()
  const [orderId, setOrderId] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = async (e) => {
    e.preventDefault()
    if (!orderId.trim()) return
    setLoading(true)
    setError('')
    try {
      if (isSupabaseConfigured()) {
        const data = await trackOrder(orderId.trim())
        setResult(data)
      } else {
        const data = await api.trackOrder(orderId)
        setResult(data)
      }
    } catch {
      setError('Order not found. Check your order number and try again.')
      setResult(null)
    }
    setLoading(false)
  }

  const statusIndex = result ? STATUSES.indexOf(result.status) : -1

  return (
    <Layout title={t('tracking.title')}>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="font-display text-5xl text-center mb-4 fade-up">{t('tracking.title')}</h1>

        <form onSubmit={handleTrack} className="flex gap-3 mb-6 fade-up">
          <input
            className="input-field flex-1"
            placeholder={t('tracking.placeholder')}
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
          <button type="submit" className="btn-primary" disabled={loading}>{t('tracking.search')}</button>
        </form>

        {error && <p className="text-red-500 text-sm text-center mb-8">{error}</p>}

        {result && (
          <div className="fade-up">
            <p className="text-center text-muted mb-2">Order #{result.order_number}</p>
            {result.total && (
              <p className="text-center text-gold mb-8">{formatPrice(Number(result.total))}</p>
            )}
            <div className="relative">
              {STATUSES.map((status, i) => (
                <div key={status} className="flex gap-4 mb-8 last:mb-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${i <= statusIndex ? 'bg-gold text-white' : 'bg-ivory text-muted'}`}>
                    {i <= statusIndex ? '✓' : i + 1}
                  </div>
                  <div>
                    <p className={`font-medium ${i <= statusIndex ? 'text-charcoal' : 'text-muted'}`}>
                      {t(`tracking.status.${status}`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
