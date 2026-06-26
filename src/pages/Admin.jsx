import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { products as demoProducts } from '../data/products'
import { useAuth } from '../context/AuthContext'
import { isAdminEmail } from '../config/admin'
import { isSupabaseConfigured } from '../lib/supabase'
import { getAllOrders, getDashboardStats } from '../services/supabaseDb'
import { formatPrice } from '../utils/currency'

const TABS = ['dashboard', 'products', 'orders', 'customers', 'coupons', 'customOrders', 'reports']

export default function Admin() {
  const { user, loading, logout, isAuthenticated } = useAuth()
  const [tab, setTab] = useState('dashboard')
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState(null)

  useEffect(() => {
    if (!isSupabaseConfigured()) return
    getAllOrders().then(setOrders).catch(() => setOrders([]))
    getDashboardStats().then(setStats).catch(() => setStats(null))
  }, [tab])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated || !isAdminEmail(user?.email)) {
    return <Navigate to="/en/account" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-charcoal text-white p-6 min-h-screen flex flex-col">
        <h1 className="font-display text-xl text-gold mb-2">Maison Douceur</h1>
        <p className="text-xs text-gray-400 mb-2 truncate">{user.email}</p>
        <p className="text-[10px] text-gold/70 mb-8 uppercase tracking-widest">
          {isSupabaseConfigured() ? '● Supabase live' : '○ Demo mode'}
        </p>
        <nav className="space-y-2 flex-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`block w-full text-start px-4 py-2 rounded text-sm capitalize transition-colors ${tab === t ? 'bg-gold text-charcoal' : 'hover:bg-white/10'}`}
            >
              {t.replace(/([A-Z])/g, ' $1')}
            </button>
          ))}
        </nav>
        <button onClick={logout} className="text-sm text-gray-400 hover:text-white text-start">
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8">
        {tab === 'dashboard' && (
          <div>
            <h2 className="font-display text-3xl mb-8">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Orders', value: stats ? String(stats.orderCount) : '—' },
                { label: 'Revenue', value: stats ? formatPrice(stats.revenue, 'en') : '—' },
                { label: 'Products', value: stats ? String(stats.productCount) : demoProducts.length },
                { label: 'Custom Requests', value: stats ? String(stats.customOrderCount) : '—' },
              ].map((s) => (
                <div key={s.label} className="bg-white p-6 shadow-sm">
                  <p className="text-muted text-sm">{s.label}</p>
                  <p className="font-display text-2xl mt-1">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-display text-3xl">Products</h2>
              <button className="btn-primary text-xs">Add Product</button>
            </div>
            <table className="w-full bg-white shadow-sm">
              <thead className="bg-ivory text-left text-sm uppercase tracking-wider">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {demoProducts.map((p) => (
                  <tr key={p.id} className="border-t border-gray-100">
                    <td className="p-4">{p.name.en}</td>
                    <td className="p-4">QAR {p.price}</td>
                    <td className="p-4">
                      <span className={p.stock <= 3 ? 'text-red-500' : ''}>{p.stock}</span>
                    </td>
                    <td className="p-4">
                      <button className="text-gold text-sm me-3">Edit</button>
                      <button className="text-red-400 text-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'orders' && (
          <div>
            <h2 className="font-display text-3xl mb-8">Orders</h2>
            {orders.length === 0 ? (
              <p className="text-muted">No orders in Supabase yet. Place a test order from the shop.</p>
            ) : (
              <table className="w-full bg-white shadow-sm">
                <thead className="bg-ivory text-left text-sm uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Order #</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-t border-gray-100">
                      <td className="p-4 font-mono text-sm">{o.order_number}</td>
                      <td className="p-4">{o.customer_name}</td>
                      <td className="p-4 capitalize">{o.status}</td>
                      <td className="p-4">{formatPrice(Number(o.total), 'en')}</td>
                      <td className="p-4 text-sm text-muted">{new Date(o.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab !== 'dashboard' && tab !== 'products' && tab !== 'orders' && (
          <div>
            <h2 className="font-display text-3xl mb-4 capitalize">{tab.replace(/([A-Z])/g, ' $1')}</h2>
            <p className="text-muted">View and manage {tab} in Supabase Dashboard → Table Editor.</p>
          </div>
        )}
      </main>
    </div>
  )
}
