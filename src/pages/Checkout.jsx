import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import CouponApply from '../components/CouponApply'
import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useSite } from '../context/SiteContext'
import { formatPrice } from '../utils/currency'
import { api } from '../utils/api'
import { isSupabaseConfigured } from '../lib/supabase'
import { createOrder, upsertCustomerProfile } from '../services/supabaseDb'
import { createStripeCheckoutSession, isStripeConfigured } from '../services/payment'

const STEPS = ['step1', 'step2', 'step3', 'step4']

function Field({ label, children, error }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-muted mb-2">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

function OrderSummary({ items, subtotal, discount, total, coupon, t }) {
  return (
    <div className="bg-ivory/60 border border-gray-100 rounded-2xl p-6 sticky top-28">
      <h2 className="font-display text-xl mb-4">{t('checkout.orderSummary')}</h2>
      <ul className="space-y-3 mb-4 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3 text-sm">
            <div className="w-14 h-14 rounded-lg overflow-hidden bg-white shrink-0">
              {item.image && (
                <img src={item.image} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{typeof item.name === 'object' ? item.name.en : item.name}</p>
              <p className="text-muted text-xs">× {item.quantity}</p>
            </div>
            <p className="font-medium shrink-0">{formatPrice(item.price * item.quantity)}</p>
          </li>
        ))}
      </ul>
      <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted">{t('cart.subtotal')}</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>{t('cart.discount')} ({coupon?.code})</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-display pt-2 border-t border-gray-200">
          <span>{t('cart.total')}</span>
          <span className="text-gold">{formatPrice(total)}</span>
        </div>
      </div>
      <div className="mt-4">
        <CouponApply compact />
      </div>
    </div>
  )
}

function PaymentOption({ id, name, checked, onChange, title, description, badge, disabled }) {
  return (
    <label
      htmlFor={id}
      className={`flex items-start gap-4 p-4 border-2 rounded-xl transition-colors ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${checked && !disabled ? 'border-gold bg-gold/5' : 'border-gray-200 hover:border-gold/40'}`}
    >
      <input
        id={id}
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="mt-1 accent-gold"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium">{title}</span>
          {badge && (
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-charcoal text-white rounded-full">
              {badge}
            </span>
          )}
        </div>
        {description && <p className="text-sm text-muted mt-1">{description}</p>}
      </div>
    </label>
  )
}

export default function Checkout() {
  const { t } = useLanguage()
  const { items, subtotal, discount, total, clearCart, coupon } = useCart()
  const { user } = useAuth()
  const { settings } = useSite()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const stripeReady = isStripeConfigured()
  const cancelled = searchParams.get('cancelled') === '1'

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: 'Doha',
    payment: stripeReady ? 'card' : 'cash',
  })

  useEffect(() => {
    if (user?.name || user?.email) {
      setForm((f) => ({
        ...f,
        name: f.name || user.name || '',
        email: f.email || user.email || '',
      }))
    }
  }, [user])

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: '' }))
  }

  const validateStep = (s) => {
    const next = {}
    if (s === 0) {
      if (!form.name.trim()) next.name = t('checkout.required')
      if (!form.email.trim()) next.email = t('checkout.required')
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = t('checkout.invalidEmail')
      if (!form.phone.trim()) next.phone = t('checkout.required')
    }
    if (s === 1) {
      if (!form.address.trim()) next.address = t('checkout.required')
      if (!form.city.trim()) next.city = t('checkout.required')
    }
    if (s === 2 && !form.payment) {
      next.payment = t('checkout.required')
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const goNext = () => {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  const goBack = () => setStep((s) => Math.max(s - 1, 0))

  const saveProfile = async () => {
    if (isSupabaseConfigured() && user?.id && user?.email) {
      await upsertCustomerProfile({
        id: user.id,
        name: form.name || user.name,
        email: form.email || user.email,
        phone: form.phone,
        city: form.city,
      })
    }
  }

  const placeOrder = async (paymentMethod) => {
    const payload = { ...form, payment: paymentMethod }
    if (isSupabaseConfigured()) {
      return createOrder({
        form: payload,
        items,
        subtotal,
        discount,
        total,
        couponCode: coupon?.code || null,
        userId: user?.id || null,
      })
    }
    await api.createOrder({ ...payload, items, total })
    return { order_number: `MD${Date.now().toString(36).toUpperCase()}` }
  }

  const openWhatsAppOrder = (orderNumber) => {
    const phone = settings.whatsapp || '97412345678'
    const lines = [
      settings.whatsapp_message || 'Hello! I would like to confirm my cake order.',
      '',
      `Order: ${orderNumber}`,
      `Name: ${form.name}`,
      `Total: ${formatPrice(total)}`,
      `Payment: WhatsApp / Bank transfer`,
    ]
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank')
  }

  const handlePlaceOrder = async () => {
    if (!validateStep(2)) {
      setStep(2)
      return
    }
    setSubmitting(true)
    setSubmitError('')

    try {
      await saveProfile()

      if (form.payment === 'card') {
        if (!stripeReady) {
          throw new Error(t('checkout.stripeNotConfigured'))
        }
        if (!isSupabaseConfigured()) {
          throw new Error(t('checkout.stripeNeedsDb'))
        }

        const order = await placeOrder('card')
        const { url } = await createStripeCheckoutSession({
          orderId: order.id,
          orderNumber: order.order_number,
          items,
          subtotal,
          discount,
          total,
          form,
        })
        window.location.href = url
        return
      }

      const order = await placeOrder(form.payment)
      clearCart()

      if (form.payment === 'whatsapp') {
        openWhatsAppOrder(order.order_number)
      }

      navigate(`/checkout/success?order=${encodeURIComponent(order.order_number)}&method=${form.payment}`)
    } catch (err) {
      setSubmitError(err.message || t('checkout.error'))
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <Layout title={t('checkout.title')}>
        <div className="max-w-lg mx-auto px-6 py-32 text-center">
          <p className="text-muted mb-6">{t('cart.empty')}</p>
          <Link to="/shop" className="btn-primary">{t('nav.shop')}</Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title={t('checkout.title')}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <h1 className="font-display text-4xl md:text-5xl mb-2">{t('checkout.title')}</h1>
        <p className="text-muted mb-8">{t('checkout.subtitle')}</p>

        {cancelled && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-900">
            {t('checkout.paymentCancelled')}
          </div>
        )}

        {/* Step indicator */}
        <div className="flex mb-10 gap-2">
          {STEPS.map((s, i) => (
            <button
              key={s}
              type="button"
              onClick={() => i < step && setStep(i)}
              className={`flex-1 text-center pb-3 border-b-2 transition-colors ${
                i === step ? 'border-gold' : i < step ? 'border-gold/40 cursor-pointer' : 'border-gray-200'
              }`}
            >
              <span className={`text-xs uppercase tracking-widest ${i <= step ? 'text-charcoal' : 'text-muted'}`}>
                {t(`checkout.${s}`)}
              </span>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3">
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="font-display text-2xl mb-2">{t('checkout.contactInfo')}</h2>
                <Field label={t('checkout.name')} error={errors.name}>
                  <input className="input-field" value={form.name} onChange={(e) => update('name', e.target.value)} />
                </Field>
                <Field label={t('checkout.email')} error={errors.email}>
                  <input type="email" className="input-field" value={form.email} onChange={(e) => update('email', e.target.value)} />
                </Field>
                <Field label={t('checkout.phone')} error={errors.phone}>
                  <input type="tel" className="input-field" placeholder="+974 …" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
                </Field>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <h2 className="font-display text-2xl mb-2">{t('checkout.deliveryInfo')}</h2>
                <Field label={t('checkout.address')} error={errors.address}>
                  <textarea className="input-field h-28 resize-none" value={form.address} onChange={(e) => update('address', e.target.value)} />
                </Field>
                <Field label={t('checkout.city')} error={errors.city}>
                  <input className="input-field" value={form.city} onChange={(e) => update('city', e.target.value)} />
                </Field>
                <p className="text-sm text-muted">{t('checkout.deliveryNote')}</p>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-display text-2xl mb-2">{t('checkout.payment')}</h2>
                <PaymentOption
                  id="pay-card"
                  name="payment"
                  checked={form.payment === 'card'}
                  onChange={() => update('payment', 'card')}
                  title={t('checkout.card')}
                  description={t('checkout.cardDesc')}
                  badge={stripeReady ? 'Stripe' : undefined}
                  disabled={!stripeReady}
                />
                {!stripeReady && (
                  <p className="text-xs text-muted px-4">{t('checkout.stripeSetupHint')}</p>
                )}
                <PaymentOption
                  id="pay-cash"
                  name="payment"
                  checked={form.payment === 'cash'}
                  onChange={() => update('payment', 'cash')}
                  title={t('checkout.cash')}
                  description={t('checkout.cashDesc')}
                />
                <PaymentOption
                  id="pay-whatsapp"
                  name="payment"
                  checked={form.payment === 'whatsapp'}
                  onChange={() => update('payment', 'whatsapp')}
                  title={t('checkout.whatsapp')}
                  description={t('checkout.whatsappDesc')}
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl">{t('checkout.review')}</h2>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="p-4 bg-ivory/60 rounded-xl">
                    <p className="text-xs uppercase tracking-widest text-muted mb-2">{t('checkout.contactInfo')}</p>
                    <p className="font-medium">{form.name}</p>
                    <p className="text-muted">{form.email}</p>
                    <p className="text-muted">{form.phone}</p>
                  </div>
                  <div className="p-4 bg-ivory/60 rounded-xl">
                    <p className="text-xs uppercase tracking-widest text-muted mb-2">{t('checkout.deliveryInfo')}</p>
                    <p className="text-muted">{form.address}</p>
                    <p className="text-muted">{form.city}</p>
                  </div>
                </div>
                <div className="p-4 border border-gold/30 rounded-xl">
                  <p className="text-xs uppercase tracking-widest text-muted mb-1">{t('checkout.payment')}</p>
                  <p className="font-medium">
                    {form.payment === 'card' && t('checkout.card')}
                    {form.payment === 'cash' && t('checkout.cash')}
                    {form.payment === 'whatsapp' && t('checkout.whatsapp')}
                  </p>
                  <p className="text-2xl font-display text-gold mt-2">{formatPrice(total)}</p>
                </div>
                {submitError && (
                  <p className="text-red-500 text-sm p-3 bg-red-50 rounded-lg">{submitError}</p>
                )}
              </div>
            )}

            <div className="flex justify-between mt-10 gap-4">
              {step > 0 ? (
                <button type="button" onClick={goBack} className="btn-outline">{t('common.previous')}</button>
              ) : (
                <Link to="/cart" className="btn-outline">{t('cart.title')}</Link>
              )}
              {step < STEPS.length - 1 ? (
                <button type="button" onClick={goNext} className="btn-primary">{t('common.next')}</button>
              ) : (
                <button type="button" onClick={handlePlaceOrder} disabled={submitting} className="btn-primary min-w-[160px]">
                  {submitting ? t('checkout.processing') : form.payment === 'card' ? t('checkout.payNow') : t('checkout.placeOrder')}
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <OrderSummary items={items} subtotal={subtotal} discount={discount} total={total} coupon={coupon} t={t} />
          </div>
        </div>
      </div>
    </Layout>
  )
}
