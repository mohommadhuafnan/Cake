import { useState } from 'react'
import Layout from '../components/Layout'
import { useLanguage } from '../context/LanguageContext'
import { api } from '../utils/api'

const DEMO_STATUSES = ['pending', 'confirmed', 'baking', 'ready', 'delivered']

export default function OrderTracking() {
  const { t } = useLanguage()
  const [orderId, setOrderId] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleTrack = async (e) => {
    e.preventDefault()
    if (!orderId.trim()) return
    setLoading(true)
    try {
      const data = await api.trackOrder(orderId)
      setResult(data)
    } catch {
      const idx = orderId.length % 5
      setResult({ order_number: orderId, status: DEMO_STATUSES[idx], created_at: new Date().toISOString() })
    }
    setLoading(false)
  }

  const statusIndex = result ? DEMO_STATUSES.indexOf(result.status) : -1

  return (
    <Layout title={t('tracking.title')}>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="font-display text-5xl text-center mb-4 fade-up">{t('tracking.title')}</h1>

        <form onSubmit={handleTrack} className="flex gap-3 mb-12 fade-up">
          <input
            className="input-field flex-1"
            placeholder={t('tracking.placeholder')}
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
          <button type="submit" className="btn-primary" disabled={loading}>{t('tracking.search')}</button>
        </form>

        {result && (
          <div className="fade-up">
            <p className="text-center text-muted mb-8">Order #{result.order_number}</p>
            <div className="relative">
              {DEMO_STATUSES.map((status, i) => (
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
