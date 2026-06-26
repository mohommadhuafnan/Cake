import { useState } from 'react'
import Layout from '../components/Layout'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'
import { isSupabaseConfigured } from '../lib/supabase'
import { submitCustomCakeOrder } from '../services/supabaseDb'

const STEPS = ['step1', 'step2', 'step3', 'step4']

export default function CustomCake() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    size: '', flavor: '', design: '', date: '', notes: '',
    name: user?.name || '', email: user?.email || '', phone: '',
  })

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (isSupabaseConfigured()) {
        await submitCustomCakeOrder(form, user?.id || null)
      } else {
        await api.submitCustomOrder(form)
      }
    } catch {
      /* demo fallback */
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <Layout title={t('custom.title')}>
        <div className="max-w-lg mx-auto px-6 py-32 text-center">
          <div className="text-6xl mb-6">✨</div>
          <h1 className="font-display text-4xl mb-4 fade-up">{t('checkout.success')}</h1>
          <p className="text-muted fade-up">We&apos;ll contact you shortly to discuss your custom cake.</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title={t('custom.title')} description={t('custom.subtitle')}>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="font-display text-5xl fade-up">{t('custom.title')}</h1>
          <p className="text-muted mt-3 fade-up">{t('custom.subtitle')}</p>
        </div>

        <div className="flex items-center justify-between mb-12 fade-up">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${i <= step ? 'bg-gold text-white' : 'bg-ivory text-muted'}`}>
                {i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-gold' : 'bg-ivory'}`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {step === 0 && (
            <div className="space-y-6 fade-up">
              <div>
                <label className="block text-sm uppercase tracking-widest mb-2">{t('custom.size')}</label>
                <select className="input-field" value={form.size} onChange={(e) => update('size', e.target.value)} required>
                  <option value="">Select size</option>
                  <option value="small">Small (6-8 servings)</option>
                  <option value="medium">Medium (12-16 servings)</option>
                  <option value="large">Large (20-30 servings)</option>
                  <option value="xlarge">Extra Large (40+ servings)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm uppercase tracking-widest mb-2">{t('custom.flavor')}</label>
                <select className="input-field" value={form.flavor} onChange={(e) => update('flavor', e.target.value)} required>
                  <option value="">Select flavor</option>
                  <option value="vanilla">Vanilla</option>
                  <option value="chocolate">Chocolate</option>
                  <option value="red-velvet">Red Velvet</option>
                  <option value="pistachio">Pistachio Rose</option>
                </select>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6 fade-up">
              <div>
                <label className="block text-sm uppercase tracking-widest mb-2">{t('custom.design')}</label>
                <textarea className="input-field h-32" value={form.design} onChange={(e) => update('design', e.target.value)} required placeholder="Describe your dream cake design..." />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 fade-up">
              <div>
                <label className="block text-sm uppercase tracking-widest mb-2">{t('custom.date')}</label>
                <input type="date" className="input-field" value={form.date} onChange={(e) => update('date', e.target.value)} required min={new Date().toISOString().split('T')[0]} />
              </div>
              <div>
                <label className="block text-sm uppercase tracking-widest mb-2">{t('custom.notes')}</label>
                <textarea className="input-field h-24" value={form.notes} onChange={(e) => update('notes', e.target.value)} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 fade-up">
              <div>
                <label className="block text-sm uppercase tracking-widest mb-2">{t('checkout.name')}</label>
                <input className="input-field" value={form.name} onChange={(e) => update('name', e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm uppercase tracking-widest mb-2">{t('checkout.email')}</label>
                <input type="email" className="input-field" value={form.email} onChange={(e) => update('email', e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm uppercase tracking-widest mb-2">{t('checkout.phone')}</label>
                <input type="tel" className="input-field" value={form.phone} onChange={(e) => update('phone', e.target.value)} required />
              </div>
            </div>
          )}

          <div className="flex justify-between mt-10">
            {step > 0 ? (
              <button type="button" onClick={() => setStep(step - 1)} className="btn-outline">{t('common.previous')}</button>
            ) : <div />}
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={() => setStep(step + 1)} className="btn-primary">{t('common.next')}</button>
            ) : (
              <button type="submit" className="btn-primary">{t('custom.submit')}</button>
            )}
          </div>
        </form>
      </div>
    </Layout>
  )
}
