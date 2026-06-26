import { useState, useEffect, useCallback } from 'react'
import { formatPrice } from '../../utils/currency'
import { getAdminProducts, getAdminCategories, createProduct, updateProduct, deleteProduct } from '../../services/adminDb'
import AdminProductModal from './AdminProductModal'

export default function AdminProductsTab() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [prods, cats] = await Promise.all([getAdminProducts(), getAdminCategories()])
      setProducts(prods)
      setCategories(cats)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const openAdd = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (p) => {
    setEditing(p)
    setModalOpen(true)
  }

  const handleSave = async (data) => {
    setSaving(true)
    setError('')
    try {
      const cat = categories.find((c) => String(c.id) === String(data.category_id))
      const payload = { ...data, category: cat?.slug || 'birthday' }
      if (editing) {
        await updateProduct(editing.id, payload)
      } else {
        await createProduct(payload)
      }
      setModalOpen(false)
      await load()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await deleteProduct(id)
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  const toggleActive = async (p) => {
    try {
      await updateProduct(p.id, { is_active: !p.is_active })
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-display text-3xl">Products</h2>
          <p className="text-muted text-sm mt-1">Add, edit, and manage all cakes on your website.</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-xs">+ Add Product</button>
      </div>

      {error && <p className="text-red-500 text-sm mb-4 bg-red-50 px-4 py-2 rounded">{error}</p>}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white p-12 text-center shadow-sm">
          <p className="text-muted mb-4">No products yet. Add your first cake!</p>
          <button onClick={openAdd} className="btn-primary text-xs">Add Product</button>
        </div>
      ) : (
        <div className="bg-white shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ivory text-left text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50/50">
                  <td className="p-4">
                    {p.image ? (
                      <img src={p.image} alt="" className="w-14 h-14 object-cover rounded" />
                    ) : (
                      <div className="w-14 h-14 bg-gray-100 rounded flex items-center justify-center text-muted text-xs">No img</div>
                    )}
                  </td>
                  <td className="p-4">
                    <p className="font-medium">{p.name || p.name_en}</p>
                  </td>
                  <td className="p-4 capitalize text-muted">{p.categories?.slug || p.category || '—'}</td>
                  <td className="p-4 font-medium">{formatPrice(Number(p.price), 'en')}</td>
                  <td className="p-4">
                    <span className={p.stock <= 3 ? 'text-red-500 font-medium' : ''}>{p.stock}</span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleActive(p)}
                      className={`text-xs px-2 py-1 rounded ${p.is_active !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {p.is_active !== false ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <button onClick={() => openEdit(p)} className="text-gold text-sm me-3 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(p.id, p.name || p.name_en)} className="text-red-400 text-sm hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminProductModal
        open={modalOpen}
        product={editing}
        categories={categories}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  )
}
