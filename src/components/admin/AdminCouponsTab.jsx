import { useState, useEffect, useCallback } from 'react'
import { getAdminCoupons, createCoupon, updateCoupon, deleteCoupon } from '../../services/adminDb'
import { isSupabaseConfigured } from '../../lib/supabase'

export default function AdminCouponsTab() {
  const [coupons, setCoupons] = useState([])
  const [form, setForm] = useState(null)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!isSupabaseConfigured()) return
    try {
      setCoupons(await getAdminCoupons())
    } catch (e) {
      setError(e.message)
    }
  }, [])

  useEffect(() => { load() }, [load])

  if (!isSupabaseConfigured()) {
    return (
      <div>
        <h2 className="font-display text-3xl mb-4">Coupons</h2>
        <p className="text-muted">Connect Supabase to manage discount coupons.</p>
      </div>
    )
  }

  const startAdd = () => setForm({ code: '', type: 'percentage', value: '10', min_order: '0', max_uses: '', is_active: true })
  const startEdit = (c) => setForm({ ...c, value: String(c.value), min_order: String(c.min_order ?? 0), max_uses: c.max_uses ? String(c.max_uses) : '' })

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        type: form.type,
        value: Number(form.value),
        min_order: Number(form.min_order) || 0,
        max_uses: form.max_uses ? Number(form.max_uses) : null,
        is_active: form.is_active !== false,
      }
      if (form.id) await updateCoupon(form.id, payload)
      else await createCoupon(payload)
      setForm(null)
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-display text-3xl">Coupons</h2>
          <p className="text-muted text-sm mt-1">Create discount codes for customers.</p>
        </div>
        {!form && <button onClick={startAdd} className="btn-primary text-xs">+ Add Coupon</button>}
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {form && (
        <form onSubmit={handleSave} className="bg-white p-6 shadow-sm mb-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          <Field label="Code" value={form.code} onChange={(v) => setForm({ ...form, code: v })} required />
          <div>
            <label className="block text-xs uppercase text-muted mb-1">Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full border px-3 py-2 text-sm rounded">
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed (QAR)</option>
            </select>
          </div>
          <Field label="Value" type="number" value={form.value} onChange={(v) => setForm({ ...form, value: v })} required />
          <Field label="Min Order (QAR)" type="number" value={form.min_order} onChange={(v) => setForm({ ...form, min_order: v })} />
          <Field label="Max Uses" type="number" value={form.max_uses} onChange={(v) => setForm({ ...form, max_uses: v })} />
          <label className="flex items-center gap-2 text-sm self-end pb-2">
            <input type="checkbox" checked={form.is_active !== false} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
            Active
          </label>
          <div className="col-span-full flex gap-3">
            <button type="submit" className="btn-primary text-xs">Save</button>
            <button type="button" onClick={() => setForm(null)} className="btn-outline text-xs">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-ivory text-xs uppercase">
            <tr>
              <th className="p-4 text-left">Code</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Value</th>
              <th className="p-4 text-left">Used</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-4 font-mono font-medium">{c.code}</td>
                <td className="p-4 capitalize">{c.type}</td>
                <td className="p-4">{c.type === 'percentage' ? `${c.value}%` : `QAR ${c.value}`}</td>
                <td className="p-4">{c.used_count ?? 0}{c.max_uses ? ` / ${c.max_uses}` : ''}</td>
                <td className="p-4">{c.is_active ? 'Active' : 'Inactive'}</td>
                <td className="p-4">
                  <button onClick={() => startEdit(c)} className="text-gold text-sm me-3">Edit</button>
                  <button onClick={() => deleteCoupon(c.id).then(load)} className="text-red-400 text-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Field({ label, type = 'text', value, onChange, ...rest }) {
  return (
    <div>
      <label className="block text-xs uppercase text-muted mb-1">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full border px-3 py-2 text-sm rounded" {...rest} />
    </div>
  )
}
