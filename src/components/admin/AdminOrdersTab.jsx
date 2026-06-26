import { useState, useEffect } from 'react'
import { formatPrice } from '../../utils/currency'
import { getAllOrders, updateOrderStatus } from '../../services/supabaseDb'
import { isSupabaseConfigured } from '../../lib/supabase'

const STATUSES = ['pending', 'confirmed', 'baking', 'ready', 'delivered', 'cancelled']

export default function AdminOrdersTab() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }
    setLoading(true)
    getAllOrders().then(setOrders).catch(() => setOrders([])).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const changeStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status)
      load()
    } catch (e) {
      alert(e.message)
    }
  }

  if (!isSupabaseConfigured()) {
    return (
      <div>
        <h2 className="font-display text-3xl mb-4">Orders</h2>
        <p className="text-muted">Connect Supabase to manage orders. Run backend/migrations/supabase.sql first.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="font-display text-3xl mb-2">Orders</h2>
      <p className="text-muted text-sm mb-6">Track and update customer orders.</p>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>
      ) : orders.length === 0 ? (
        <p className="text-muted bg-white p-8 shadow-sm">No orders yet. Place a test order from the shop.</p>
      ) : (
        <div className="bg-white shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ivory text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 text-left">Order #</th>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Total</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-gray-100">
                  <td className="p-4 font-mono">{o.order_number}</td>
                  <td className="p-4">{o.customer_name}</td>
                  <td className="p-4 text-muted">{o.customer_email}</td>
                  <td className="p-4 font-medium">{formatPrice(Number(o.total), 'en')}</td>
                  <td className="p-4 text-muted">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    <select
                      value={o.status}
                      onChange={(e) => changeStatus(o.id, e.target.value)}
                      className="border border-gray-200 px-2 py-1 rounded text-xs capitalize"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
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
