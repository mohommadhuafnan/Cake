import { useState, useEffect } from 'react'
import { getAdminCustomOrders, updateCustomOrderStatus } from '../../services/adminDb'
import { isSupabaseConfigured } from '../../lib/supabase'
import { formatPrice } from '../../utils/currency'

const STATUSES = ['pending', 'reviewing', 'quoted', 'confirmed', 'completed', 'cancelled']

export default function AdminCustomOrdersTab() {
  const [orders, setOrders] = useState([])
  const [quoteInputs, setQuoteInputs] = useState({})

  const load = () => {
    if (!isSupabaseConfigured()) return
    getAdminCustomOrders().then(setOrders).catch(() => setOrders([]))
  }

  useEffect(() => { load() }, [])

  if (!isSupabaseConfigured()) {
    return (
      <div>
        <h2 className="font-display text-3xl mb-4">Custom Cake Orders</h2>
        <p className="text-muted">Connect Supabase to view custom cake requests.</p>
      </div>
    )
  }

  const updateStatus = async (id, status) => {
    const quotedPrice = quoteInputs[id] ? Number(quoteInputs[id]) : null
    await updateCustomOrderStatus(id, status, quotedPrice)
    load()
  }

  return (
    <div>
      <h2 className="font-display text-3xl mb-2">Custom Cake Orders</h2>
      <p className="text-muted text-sm mb-6">Review bespoke cake requests and send price quotes to customers.</p>

      {orders.length === 0 ? (
        <p className="text-muted bg-white p-8 shadow-sm">No custom orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="bg-white p-6 shadow-sm">
              <div className="flex flex-wrap justify-between gap-4 mb-4">
                <div>
                  <p className="font-medium">{o.customer_name}</p>
                  <p className="text-muted text-sm">{o.customer_email} · {o.customer_phone || 'No phone'}</p>
                </div>
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o.id, e.target.value)}
                  className="border px-3 py-1 rounded text-sm capitalize self-start"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><span className="text-muted block text-xs uppercase">Size</span>{o.cake_size}</div>
                <div><span className="text-muted block text-xs uppercase">Flavor</span>{o.flavor}</div>
                <div><span className="text-muted block text-xs uppercase">Delivery</span>{o.delivery_date}</div>
                <div>
                  <span className="text-muted block text-xs uppercase">Quoted Price (QAR)</span>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="number"
                      min="0"
                      placeholder={o.quoted_price || 'Enter price'}
                      value={quoteInputs[o.id] ?? o.quoted_price ?? ''}
                      onChange={(e) => setQuoteInputs({ ...quoteInputs, [o.id]: e.target.value })}
                      className="border px-2 py-1 rounded text-sm w-24"
                    />
                    <button
                      type="button"
                      onClick={() => updateStatus(o.id, 'quoted')}
                      className="text-xs px-2 py-1 bg-gold text-charcoal rounded"
                    >
                      Save Quote
                    </button>
                  </div>
                  {o.quoted_price && (
                    <p className="text-gold text-xs mt-1">{formatPrice(Number(o.quoted_price), 'en')}</p>
                  )}
                </div>
              </div>
              {o.design_description && <p className="text-sm mt-3"><span className="text-muted">Design:</span> {o.design_description}</p>}
              {o.special_notes && <p className="text-sm mt-1 text-muted">{o.special_notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
