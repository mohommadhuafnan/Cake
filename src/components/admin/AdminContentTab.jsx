import { useState, useEffect, useCallback } from 'react'
import {
  getAdminCmsBlocks,
  createCmsBlock,
  updateCmsBlock,
  deleteCmsBlock,
} from '../../services/contentDb'
import AdminImagePicker from './AdminImagePicker'

const CONTENT_TYPES = [
  { id: 'announcement', label: 'Top Bar Announcements', preview: (b) => b.body },
  { id: 'hero_slide', label: 'Promo Carousel Slides', preview: (b) => b.title },
  { id: 'showcase', label: 'Category Showcase Cards', preview: (b) => b.title },
  { id: 'split_section', label: 'Split Category Sections', preview: (b) => b.title },
  { id: 'special_offer', label: 'Special Offer Cards', preview: (b) => b.title },
  { id: 'promo_banner', label: 'Promo Banners', preview: (b) => b.title },
  { id: 'testimonial', label: 'Customer Testimonials', preview: (b) => b.title },
]

const EMPTY = {
  title: '',
  subtitle: '',
  body: '',
  image: '',
  link: '',
  cta: '',
  tag: '',
  sort_order: 0,
  is_active: true,
  meta: {},
}

export default function AdminContentTab() {
  const [type, setType] = useState('announcement')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setItems(await getAdminCmsBlocks(type))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [type])

  useEffect(() => { load() }, [load])

  const typeConfig = CONTENT_TYPES.find((t) => t.id === type)

  const openAdd = () => {
    setForm({ ...EMPTY, type, sort_order: items.length + 1, meta: {} })
  }

  const openEdit = (item) => {
    setForm({ ...item, meta: item.meta || {} })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        type,
        title: form.title,
        subtitle: form.subtitle,
        body: form.body,
        image: form.image,
        link: form.link,
        cta: form.cta,
        tag: form.tag,
        sort_order: Number(form.sort_order) || 0,
        is_active: form.is_active !== false,
        meta: {
          ...form.meta,
          product_id: form.meta?.product_id ? Number(form.meta.product_id) : undefined,
          bg: form.meta?.bg || '',
          rating: form.meta?.rating ? Number(form.meta.rating) : undefined,
        },
      }
      if (form.id) {
        await updateCmsBlock(form.id, payload)
      } else {
        await createCmsBlock(payload)
      }
      setForm(null)
      await load()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, label) => {
    if (!window.confirm(`Delete "${label}"?`)) return
    try {
      await deleteCmsBlock(id)
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  const toggleActive = async (item) => {
    try {
      await updateCmsBlock(item.id, { ...item, is_active: !item.is_active })
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
        <div>
          <h2 className="font-display text-3xl">Website Content</h2>
          <p className="text-muted text-sm mt-1">Edit homepage banners, announcements, testimonials, and more.</p>
        </div>
        {!form && (
          <button onClick={openAdd} className="btn-primary text-xs">+ Add Item</button>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mb-4 bg-red-50 px-4 py-2 rounded">{error}</p>}

      <div className="flex flex-wrap gap-2 mb-6">
        {CONTENT_TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => { setType(t.id); setForm(null) }}
            className={`text-xs px-3 py-2 rounded border transition-colors ${
              type === t.id ? 'bg-gold text-charcoal border-gold' : 'border-gray-200 text-muted hover:border-gold/50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {form && (
        <form onSubmit={handleSave} className="bg-white p-6 shadow-sm mb-6 space-y-4 max-w-2xl">
          <h3 className="font-display text-lg">{form.id ? 'Edit' : 'Add'} — {typeConfig?.label}</h3>

          {type === 'announcement' && (
            <Field label="Message" value={form.body} onChange={(v) => setForm({ ...form, body: v })} textarea />
          )}

          {type === 'hero_slide' && (
            <>
              <Field label="Tag" value={form.tag} onChange={(v) => setForm({ ...form, tag: v })} />
              <Field label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
              <Field label="Description" value={form.body} onChange={(v) => setForm({ ...form, body: v })} textarea />
              <Field label="Button Text" value={form.cta} onChange={(v) => setForm({ ...form, cta: v })} />
              <Field label="Link (e.g. product/1 or shop)" value={form.link} onChange={(v) => setForm({ ...form, link: v })} />
              <Field label="Product ID (optional)" value={form.meta?.product_id || ''} onChange={(v) => setForm({ ...form, meta: { ...form.meta, product_id: v } })} />
              <ImageField value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
            </>
          )}

          {type === 'showcase' && (
            <>
              <Field label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
              <Field label="Subtitle" value={form.subtitle} onChange={(v) => setForm({ ...form, subtitle: v })} />
              <Field label="Link (e.g. shop?category=wedding)" value={form.link} onChange={(v) => setForm({ ...form, link: v })} />
              <ImageField value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
            </>
          )}

          {type === 'split_section' && (
            <>
              <Field label="Heading" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
              <Field label="Description" value={form.body} onChange={(v) => setForm({ ...form, body: v })} textarea required />
              <Field label="Show More Button Text" value={form.cta} onChange={(v) => setForm({ ...form, cta: v })} />
              <Field label="Category Link (e.g. shop?category=wedding)" value={form.link} onChange={(v) => setForm({ ...form, link: v })} required />
              <Field label="Overlay Card Title" value={form.meta?.overlay_title || ''} onChange={(v) => setForm({ ...form, meta: { ...form.meta, overlay_title: v } })} />
              <Field label="Overlay Button Text" value={form.meta?.overlay_cta || 'Show Products'} onChange={(v) => setForm({ ...form, meta: { ...form.meta, overlay_cta: v } })} />
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.meta?.reversed === true}
                  onChange={(e) => setForm({ ...form, meta: { ...form.meta, reversed: e.target.checked } })}
                  className="rounded border-gray-300"
                />
                Image on right (reversed layout)
              </label>
              <ImageField value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
            </>
          )}

          {type === 'special_offer' && (
            <>
              <Field label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
              <Field label="Button Text" value={form.cta} onChange={(v) => setForm({ ...form, cta: v })} />
              <Field label="Link (e.g. custom or shop)" value={form.link} onChange={(v) => setForm({ ...form, link: v })} />
              <Field label="Gradient CSS (e.g. from-blush to-[#F5D5DA])" value={form.meta?.bg || ''} onChange={(v) => setForm({ ...form, meta: { ...form.meta, bg: v } })} />
              <ImageField value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
            </>
          )}

          {type === 'promo_banner' && (
            <>
              <Field label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
              <Field label="Subtitle" value={form.subtitle} onChange={(v) => setForm({ ...form, subtitle: v })} />
              <Field label="Button Text" value={form.cta} onChange={(v) => setForm({ ...form, cta: v })} />
              <Field label="Link" value={form.link} onChange={(v) => setForm({ ...form, link: v })} />
              <ImageField value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
            </>
          )}

          {type === 'testimonial' && (
            <>
              <Field label="Customer Name" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
              <Field label="Review Text" value={form.body} onChange={(v) => setForm({ ...form, body: v })} textarea required />
              <Field label="Rating (1-5)" type="number" value={form.meta?.rating || 5} onChange={(v) => setForm({ ...form, meta: { ...form.meta, rating: v } })} />
            </>
          )}

          <Field label="Sort Order" type="number" value={form.sort_order} onChange={(v) => setForm({ ...form, sort_order: v })} />

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary text-xs">{saving ? 'Saving…' : 'Save'}</button>
            <button type="button" onClick={() => setForm(null)} className="btn-outline text-xs">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="bg-white p-12 text-center shadow-sm">
          <p className="text-muted mb-4">No items yet for {typeConfig?.label}.</p>
          <button onClick={openAdd} className="btn-primary text-xs">Add First Item</button>
        </div>
      ) : (
        <div className="bg-white shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ivory text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 text-left">Preview</th>
                {type !== 'announcement' && type !== 'testimonial' && <th className="p-4 text-left">Image</th>}
                <th className="p-4 text-left">Order</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-gray-100">
                  <td className="p-4 max-w-xs truncate">{typeConfig?.preview(item)}</td>
                  {type !== 'announcement' && type !== 'testimonial' && (
                    <td className="p-4">
                      {item.image ? <img src={item.image} alt="" className="w-12 h-12 object-cover rounded" /> : '—'}
                    </td>
                  )}
                  <td className="p-4">{item.sort_order}</td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleActive(item)}
                      className={`text-xs px-2 py-1 rounded ${item.is_active !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {item.is_active !== false ? 'Visible' : 'Hidden'}
                    </button>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <button onClick={() => openEdit(item)} className="text-gold text-sm me-3 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(item.id, typeConfig?.preview(item))} className="text-red-400 text-sm hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', textarea, required }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-muted mb-1">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} required={required} rows={3} className="w-full border border-gray-200 px-3 py-2 text-sm rounded" />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} className="w-full border border-gray-200 px-3 py-2 text-sm rounded" />
      )}
    </div>
  )
}

function ImageField({ value, onChange }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-muted mb-1">Image</label>
      <AdminImagePicker value={value} onChange={onChange} />
    </div>
  )
}
