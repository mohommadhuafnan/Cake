import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../utils/currency'
import { api } from '../utils/api'
import { isSupabaseConfigured } from '../lib/supabase'
import { createOrder, upsertCustomerProfile } from '../services/supabaseDb'

const STEPS = ['step1', 'step2', 'step3', 'step4']

export default function Checkout() {
  const { lang, t } = useLanguage()
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: 'Doha',
    payment: 'card',
  })

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const handlePlaceOrder = async () => {
    try {
      if (isSupabaseConfigured()) {
        if (user?.id && user?.email) {
          await upsertCustomerProfile({
            id: user.id,
            name: form.name || user.name,
            email: form.email || user.email,
            phone: form.phone,
            city: form.city,
          })
        }
        const order = await createOrder({ form, items, total, userId: user?.id || null })
        setOrderNumber(order.order_number)
      } else {
        await api.createOrder({ ...form, items, total })
        setOrderNumber(`MD${Date.now().toString(36).toUpperCase()}`)
      }
    } catch {
      setOrderNumber(`MD${Date.now().toString(36).toUpperCase()}`)
    }
    clearCart()
    setDone(true)
  }

  if (done) {
    return (
      <Layout title={t('checkout.success')}>
        <div className="max-w-lg mx-auto px-6 py-32 text-center">
          <div className="text-6xl mb-6 animate-[heroFadeUp_0.8s_ease]">🎉</div>
          <h1 className="font-display text-4xl mb-4 fade-up">{t('checkout.success')}</h1>
          <p className="text-muted mb-2 fade-up">{t('checkout.successMsg')}</p>
          {orderNumber && (
            <p className="text-gold font-medium mb-8 fade-up">
              {t('tracking.title')}: <span className="font-mono">{orderNumber}</span>
            </p>
          )}
          <button onClick={() => navigate(`/tracking`)} className="btn-outline me-3">{t('tracking.title')}</button>
          <button onClick={() => navigate(`/`)} className="btn-primary">{t('nav.home')}</button>
        </div>
      </Layout>
    )
  }

  if (items.length === 0) {
    navigate(`/shop`)
    return null
  }

  return (
    <Layout title={t('checkout.title')}>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="font-display text-5xl mb-8 fade-up">{t('checkout.title')}</h1>

        <div className="flex mb-12 fade-up">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 text-center">
              <div className={`h-1 mb-2 ${i <= step ? 'bg-gold' : 'bg-ivory'}`} />
              <span className="text-xs uppercase tracking-widest text-muted">{t(`checkout.${s}`)}</span>
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-4 fade-up">
            <input className="input-field" placeholder={t('checkout.name')} value={form.name} onChange={(e) => update('name', e.target.value)} required />
            <input type="email" className="input-field" placeholder={t('checkout.email')} value={form.email} onChange={(e) => update('email', e.target.value)} required />
            <input type="tel" className="input-field" placeholder={t('checkout.phone')} value={form.phone} onChange={(e) => update('phone', e.target.value)} required />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4 fade-up">
            <textarea className="input-field h-24" placeholder={t('checkout.address')} value={form.address} onChange={(e) => update('address', e.target.value)} required />
            <input className="input-field" placeholder={t('checkout.city')} value={form.city} onChange={(e) => update('city', e.target.value)} required />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 fade-up">
            <label className="flex items-center gap-3 p-4 border cursor-pointer hover:border-gold transition-colors">
              <input type="radio" name="payment" value="card" checked={form.payment === 'card'} onChange={() => update('payment', 'card')} />
              <span>{t('checkout.card')}</span>
            </label>
            <label className="flex items-center gap-3 p-4 border cursor-pointer hover:border-gold transition-colors">
              <input type="radio" name="payment" value="whatsapp" checked={form.payment === 'whatsapp'} onChange={() => update('payment', 'whatsapp')} />
              <span>{t('checkout.whatsapp')}</span>
            </label>
            <p className="text-gold text-xl font-medium mt-4">{t('cart.total')}: {formatPrice(total, lang)}</p>
          </div>
        )}

        {step === 3 && (
          <div className="fade-up text-center py-8">
            <p className="text-muted mb-4">Review your order and confirm.</p>
            <p className="text-2xl font-display text-gold">{formatPrice(total, lang)}</p>
          </div>
        )}

        <div className="flex justify-between mt-10">
          {step > 0 ? <button onClick={() => setStep(step - 1)} className="btn-outline">{t('common.previous')}</button> : <div />}
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(step + 1)} className="btn-primary">{t('common.next')}</button>
          ) : (
            <button onClick={handlePlaceOrder} className="btn-primary">{t('checkout.placeOrder')}</button>
          )}
        </div>
      </div>
    </Layout>
  )
}
