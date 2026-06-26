import { useState, useEffect, useCallback } from 'react'
import { getAdminCategories, createCategory, updateCategory, deleteCategory } from '../../services/adminDb'

export default function AdminCategoriesTab() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(null)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setCategories(await getAdminCategories())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const startAdd = () => setForm({ slug: '', name_en: '', name_ar: '', sort_order: categories.length + 1 })
  const startEdit = (c) => setForm({ ...c })
  const cancel = () => setForm(null)

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const payload = {
        slug: form.slug.trim().toLowerCase().replace(/\s+/g, '-'),
        name_en: form.name_en.trim(),
        name_ar: form.name_ar.trim(),
        sort_order: Number(form.sort_order) || 0,
        image: form.image?.trim() || null,
      }
      if (form.id) {
        await updateCategory(form.id, payload)
      } else {
        await createCategory(payload)
      }
      setForm(null)
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return
    try {
      await deleteCategory(id)
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-display text-3xl">Categories</h2>
          <p className="text-muted text-sm mt-1">Organize cakes by type (Wedding, Birthday, etc.)</p>
        </div>
        {!form && <button onClick={startAdd} className="btn-primary text-xs">+ Add Category</button>}
      </div>

      {error && <p className="text-red-500 text-sm mb-4 bg-red-50 px-4 py-2 rounded">{error}</p>}

      {form && (
        <form onSubmit={handleSave} className="bg-white p-6 shadow-sm mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} placeholder="birthday" required />
          <Input label="Sort Order" type="number" value={form.sort_order} onChange={(v) => setForm({ ...form, sort_order: v })} />
          <Input label="Name (English)" value={form.name_en} onChange={(v) => setForm({ ...form, name_en: v })} required />
          <Input label="Name (Arabic)" value={form.name_ar} onChange={(v) => setForm({ ...form, name_ar: v })} dir="rtl" required />
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="btn-primary text-xs">Save</button>
            <button type="button" onClick={cancel} className="btn-outline text-xs">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-ivory text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 text-left">Slug</th>
                <th className="p-4 text-left">English</th>
                <th className="p-4 text-left">Arabic</th>
                <th className="p-4 text-left">Order</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-t border-gray-100">
                  <td className="p-4 font-mono text-xs">{c.slug}</td>
                  <td className="p-4">{c.name_en}</td>
                  <td className="p-4" dir="rtl">{c.name_ar}</td>
                  <td className="p-4">{c.sort_order}</td>
                  <td className="p-4">
                    <button onClick={() => startEdit(c)} className="text-gold text-sm me-3">Edit</button>
                    <button onClick={() => handleDelete(c.id, c.name_en)} className="text-red-400 text-sm">Delete</button>
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

function Input({ label, dir, type = 'text', ...props }) {
  const { value, onChange, ...rest } = props
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-muted mb-1">{label}</label>
      <input
        dir={dir}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 px-3 py-2 text-sm rounded"
        {...rest}
      />
    </div>
  )
}
