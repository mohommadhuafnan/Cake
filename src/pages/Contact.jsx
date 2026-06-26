import { useState } from 'react'
import Layout from '../components/Layout'
import { useLanguage } from '../context/LanguageContext'
import { useSite } from '../context/SiteContext'
import { api } from '../utils/api'
import { isSupabaseConfigured } from '../lib/supabase'
import { submitContactMessage } from '../services/supabaseDb'

export default function Contact() {
  const { t } = useLanguage()
  const { settings } = useSite()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (isSupabaseConfigured()) {
        await submitContactMessage(form)
      } else {
        await api.submitContact(form)
      }
    } catch {
      /* saved locally in demo */
    }
    setSent(true)
  }

  return (
    <Layout title={t('contact.title')} description={t('contact.subtitle')}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="font-display text-5xl fade-up">{t('contact.title')}</h1>
          <p className="text-muted mt-3 fade-up">{t('contact.subtitle')}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            {sent ? (
              <div className="glass-card p-12 text-center fade-up">
                <div className="text-4xl mb-4">✉️</div>
                <p className="font-display text-2xl text-gold">{t('contact.success')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 fade-up">
                <input className="input-field" placeholder={t('contact.name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <input type="email" className="input-field" placeholder={t('contact.email')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                <textarea className="input-field h-40" placeholder={t('contact.message')} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                <button type="submit" className="btn-primary">{t('contact.send')}</button>
              </form>
            )}
          </div>

          <div className="fade-up">
            <div className="glass-card p-8 mb-8">
              <h3 className="font-display text-xl mb-4">{settings.brand_name || 'Maison Douceur'}</h3>
              <p className="text-muted text-sm leading-relaxed mb-2">{settings.address}</p>
              <p className="text-muted text-sm">{settings.phone}</p>
              <p className="text-muted text-sm">{settings.email}</p>
            </div>
            <div className="aspect-video bg-ivory flex items-center justify-center text-muted">
              <iframe
                title="Map"
                src={settings.map_embed || 'https://maps.google.com/maps?q=Doha+Qatar&output=embed'}
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
