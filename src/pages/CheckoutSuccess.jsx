import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import { verifyStripeCheckoutSession } from '../services/payment'

export default function CheckoutSuccess() {
  const { t } = useLanguage()
  const { clearCart } = useCart()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('loading')
  const [orderNumber, setOrderNumber] = useState('')
  const [error, setError] = useState('')

  const sessionId = searchParams.get('session_id')
  const directOrder = searchParams.get('order')
  const method = searchParams.get('method')

  useEffect(() => {
    let cancelled = false

    async function confirm() {
      if (directOrder) {
        setOrderNumber(directOrder)
        clearCart()
        setStatus('success')
        return
      }

      if (!sessionId) {
        navigate('/checkout', { replace: true })
        return
      }

      try {
        const result = await verifyStripeCheckoutSession(sessionId)
        if (cancelled) return
        setOrderNumber(result.orderNumber || '')
        clearCart()
        setStatus('success')
      } catch (err) {
        if (cancelled) return
        setError(err.message || t('checkout.verifyFailed'))
        setStatus('error')
      }
    }

    confirm()
    return () => { cancelled = true }
  }, [sessionId, directOrder, clearCart, navigate, t])

  if (status === 'loading') {
    return (
      <Layout title={t('checkout.success')}>
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-muted">{t('checkout.verifying')}</p>
        </div>
      </Layout>
    )
  }

  if (status === 'error') {
    return (
      <Layout title={t('checkout.title')}>
        <div className="max-w-lg mx-auto px-6 py-32 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link to="/checkout" className="btn-primary">{t('checkout.tryAgain')}</Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title={t('checkout.success')}>
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center text-3xl">✓</div>
        <h1 className="font-display text-4xl mb-4">{t('checkout.success')}</h1>
        <p className="text-muted mb-2">{t('checkout.successMsg')}</p>
        {method === 'cash' && (
          <p className="text-sm text-muted mb-4">{t('checkout.cashSuccessNote')}</p>
        )}
        {method === 'whatsapp' && (
          <p className="text-sm text-muted mb-4">{t('checkout.whatsappSuccessNote')}</p>
        )}
        {orderNumber && (
          <p className="text-gold font-medium mb-8">
            {t('tracking.title')}: <span className="font-mono">{orderNumber}</span>
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/tracking" className="btn-outline">{t('tracking.title')}</Link>
          <Link to="/shop" className="btn-primary">{t('nav.shop')}</Link>
        </div>
      </div>
    </Layout>
  )
}
