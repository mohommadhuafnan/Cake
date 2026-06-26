import { useState, useEffect } from 'react'

const EMPTY = {
  name_en: '',
  name_ar: '',
  description_en: '',
  description_ar: '',
  price: '',
  category_id: '',
  image: '',
  stock: '10',
  rating: '4.5',
  reviews: '0',
  popular: '80',
  is_active: true,
}

export default function AdminProductModal({ open, product, categories, onClose, onSave, saving }) {
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    if (!open) return
    if (product) {
      setForm({
        name_en: product.name_en || '',
        name_ar: product.name_ar || '',
        description_en: product.description_en || '',
        description_ar: product.description_ar || '',
        price: String(product.price ?? ''),
        category_id: String(product.category_id ?? ''),
        image: product.image || '',
        stock: String(product.stock ?? 10),
        rating: String(product.rating ?? 4.5),
        reviews: String(product.reviews ?? 0),
        popular: String(product.popular ?? 80),
        is_active: product.is_active !== false,
      })
    } else {
      setForm({
        ...EMPTY,
        category_id: categories[0] ? String(categories[0].id) : '',
      })
    }
  }, [open, product, categories])

  if (!open) return null

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      name_en: form.name_en.trim(),
      name_ar: form.name_ar.trim(),
      description_en: form.description_en.trim(),
      description_ar: form.description_ar.trim(),
      price: Number(form.price),
      category_id: form.category_id ? Number(form.category_id) : null,
      image: form.image.trim(),
      images: form.image.trim() ? [form.image.trim()] : [],
      stock: Number(form.stock) || 0,
      rating: Number(form.rating) || 4.5,
      reviews: Number(form.reviews) || 0,
      popular: Number(form.popular) || 80,
      is_active: form.is_active,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h3 className="font-display text-xl">{product ? 'Edit Product' : 'Add New Cake'}</h3>
          <button type="button" onClick={onClose} className="text-muted hover:text-charcoal text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Name (English)" value={form.name_en} onChange={set('name_en')} required />
            <Field label="Name (Arabic)" value={form.name_ar} onChange={set('name_ar')} required dir="rtl" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextArea label="Description (English)" value={form.description_en} onChange={set('description_en')} />
            <TextArea label="Description (Arabic)" value={form.description_ar} onChange={set('description_ar')} dir="rtl" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Field label="Price (QAR)" type="number" min="0" step="0.01" value={form.price} onChange={set('price')} required />
            <Field label="Stock" type="number" min="0" value={form.stock} onChange={set('stock')} />
            <Field label="Rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={set('rating')} />
            <Field label="Popular %" type="number" min="0" max="100" value={form.popular} onChange={set('popular')} />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-muted mb-1">Category</label>
            <select
              value={form.category_id}
              onChange={set('category_id')}
              className="w-full border border-gray-200 px-3 py-2 text-sm rounded"
              required
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name_en}</option>
              ))}
            </select>
          </div>

          <Field
            label="Image URL"
            value={form.image}
            onChange={set('image')}
            placeholder="https://images.unsplash.com/..."
            required
          />

          {form.image && (
            <img src={form.image} alt="Preview" className="w-32 h-32 object-cover rounded border" onError={(e) => { e.target.style.display = 'none' }} />
          )}

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_active} onChange={set('is_active')} />
            Active (visible on website)
          </label>

          <div className="flex gap-3 pt-4 border-t">
            <button type="submit" disabled={saving} className="btn-primary text-xs flex-1">
              {saving ? 'Saving…' : product ? 'Update Product' : 'Add Product'}
            </button>
            <button type="button" onClick={onClose} className="btn-outline text-xs px-6">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, dir, ...props }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-muted mb-1">{label}</label>
      <input dir={dir} className="w-full border border-gray-200 px-3 py-2 text-sm rounded focus:border-gold outline-none" {...props} />
    </div>
  )
}

function TextArea({ label, dir, ...props }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-muted mb-1">{label}</label>
      <textarea dir={dir} rows={3} className="w-full border border-gray-200 px-3 py-2 text-sm rounded focus:border-gold outline-none resize-none" {...props} />
    </div>
  )
}
