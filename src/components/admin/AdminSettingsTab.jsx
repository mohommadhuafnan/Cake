import { useState, useEffect, useCallback } from 'react'
import { getSiteSettings, updateSiteSettings, parseJsonSetting } from '../../services/contentDb'
import AdminImagePicker from './AdminImagePicker'

const SECTIONS = [
  {
    id: 'brand',
    title: 'Brand & Contact',
    fields: [
      { key: 'brand_name', label: 'Brand Name' },
      { key: 'tagline', label: 'Tagline' },
      { key: 'phone', label: 'Phone' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'address', label: 'Address', textarea: true },
      { key: 'whatsapp', label: 'WhatsApp Number (digits only)' },
      { key: 'whatsapp_message', label: 'WhatsApp Default Message', textarea: true },
      { key: 'map_embed', label: 'Google Maps Embed URL', textarea: true },
    ],
  },
  {
    id: 'social',
    title: 'Social Media',
    fields: [
      { key: 'instagram_url', label: 'Instagram URL' },
      { key: 'facebook_url', label: 'Facebook URL' },
      { key: 'twitter_url', label: 'Twitter / X URL' },
    ],
  },
  {
    id: 'stats',
    title: 'Homepage Stats',
    fields: [
      { key: 'stat_orders', label: 'Orders Delivered' },
      { key: 'stat_customers', label: 'Happy Customers' },
      { key: 'stat_years', label: 'Years of Excellence' },
    ],
  },
  {
    id: 'hero',
    title: 'Main Hero',
    fields: [
      { key: 'hero_title', label: 'Hero Title' },
      { key: 'hero_subtitle', label: 'Hero Subtitle', textarea: true },
      { key: 'hero_images', label: 'Hero Background Images (one URL per line)', textarea: true, lines: true },
    ],
  },
  {
    id: 'sections',
    title: 'Home Section Titles',
    fields: [
      { key: 'section_signature_title', label: 'Signature Cakes Title' },
      { key: 'section_signature_subtitle', label: 'Signature Cakes Subtitle', textarea: true },
      { key: 'section_top_selling_title', label: 'Top Selling Title' },
      { key: 'section_top_selling_subtitle', label: 'Top Selling Subtitle', textarea: true },
      { key: 'section_delight_title', label: 'Cakes of Delight Title' },
      { key: 'section_delight_subtitle', label: 'Cakes of Delight Subtitle', textarea: true },
      { key: 'home_about_image', label: 'About Snippet Image URL' },
    ],
  },
  {
    id: 'about',
    title: 'About Page',
    fields: [
      { key: 'about_title', label: 'Title' },
      { key: 'about_subtitle', label: 'Subtitle' },
      { key: 'about_text', label: 'Main Text', textarea: true },
      { key: 'about_extra', label: 'Extra Paragraph', textarea: true },
      { key: 'about_image', label: 'About Page Image URL' },
      { key: 'about_values', label: 'Values (JSON array)', textarea: true, hint: '[{"title":"Quality","desc":"..."}]' },
    ],
  },
]

export default function AdminSettingsTab() {
  const [settings, setSettings] = useState({})
  const [section, setSection] = useState('brand')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const s = await getSiteSettings()
      setSettings(s)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const current = SECTIONS.find((s) => s.id === section)

  const getFieldValue = (key, lines) => {
    const val = settings[key] ?? ''
    if (lines && key === 'hero_images') {
      return parseJsonSetting(val, []).join('\n')
    }
    return val
  }

  const setFieldValue = (key, value, lines) => {
    if (lines && key === 'hero_images') {
      const urls = value.split('\n').map((s) => s.trim()).filter(Boolean)
      setSettings({ ...settings, [key]: JSON.stringify(urls) })
      return
    }
    setSettings({ ...settings, [key]: value })
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const keys = current.fields.map((f) => f.key)
      const updates = {}
      keys.forEach((k) => { updates[k] = settings[k] ?? '' })
      await updateSiteSettings(updates)
      setMessage('Settings saved! Changes appear on the website immediately.')
      setTimeout(() => setMessage(''), 4000)
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-3xl">Site Settings</h2>
        <p className="text-muted text-sm mt-1">Control brand, contact info, social links, and page content — no developer needed.</p>
      </div>

      {error && <p className="text-red-500 text-sm mb-4 bg-red-50 px-4 py-2 rounded">{error}</p>}
      {message && <p className="text-green-700 text-sm mb-4 bg-green-50 px-4 py-2 rounded">{message}</p>}

      <div className="flex flex-wrap gap-2 mb-6">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className={`text-xs px-4 py-2 rounded border transition-colors ${
              section === s.id ? 'bg-gold text-charcoal border-gold' : 'border-gray-200 text-muted hover:border-gold/50'
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 shadow-sm max-w-2xl">
        <h3 className="font-display text-xl mb-4">{current.title}</h3>
        <div className="space-y-4">
          {current.fields.map((field) => (
            <div key={field.key}>
              <label className="block text-xs uppercase tracking-wider text-muted mb-1">{field.label}</label>
              {field.textarea ? (
                <textarea
                  value={getFieldValue(field.key, field.lines)}
                  onChange={(e) => setFieldValue(field.key, e.target.value, field.lines)}
                  rows={field.lines ? 4 : 3}
                  className="w-full border border-gray-200 px-3 py-2 text-sm rounded focus:border-gold outline-none"
                  placeholder={field.hint}
                />
              ) : (
                <input
                  type={field.type || 'text'}
                  value={getFieldValue(field.key)}
                  onChange={(e) => setFieldValue(field.key, e.target.value)}
                  className="w-full border border-gray-200 px-3 py-2 text-sm rounded focus:border-gold outline-none"
                />
              )}
              {field.hint && !field.textarea && <p className="text-xs text-muted mt-1">{field.hint}</p>}
            </div>
          ))}

          {section === 'sections' && (
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted mb-1">About Snippet Image</label>
              <AdminImagePicker
                value={settings.home_about_image || ''}
                onChange={(url) => setSettings({ ...settings, home_about_image: url })}
              />
            </div>
          )}

          {section === 'about' && (
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted mb-1">About Page Image</label>
              <AdminImagePicker
                value={settings.about_image || ''}
                onChange={(url) => setSettings({ ...settings, about_image: url })}
              />
            </div>
          )}
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary text-xs mt-6">
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
