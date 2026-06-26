import { useState } from 'react'
import { products as demoProducts } from '../data/products'

const TABS = ['dashboard', 'products', 'orders', 'customers', 'coupons', 'customOrders', 'reports']

export default function Admin() {
  const [tab, setTab] = useState('dashboard')
  const [authed, setAuthed] = useState(() => !!sessionStorage.getItem('admin'))
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })

  const handleLogin = (e) => {
    e.preventDefault()
    if (loginForm.email && loginForm.password) {
      sessionStorage.setItem('admin', 'true')
      setAuthed(true)
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="bg-white p-10 shadow-lg w-full max-w-md">
          <h1 className="font-display text-3xl mb-8 text-center">Admin Panel</h1>
          <input className="input-field mb-4" type="email" placeholder="Email" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} required />
          <input className="input-field mb-6" type="password" placeholder="Password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required />
          <button type="submit" className="btn-primary w-full">Sign In</button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-charcoal text-white p-6 min-h-screen">
        <h1 className="font-display text-xl text-gold mb-8">Admin</h1>
        <nav className="space-y-2">
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
        <button onClick={() => { sessionStorage.removeItem('admin'); setAuthed(false) }} className="mt-8 text-sm text-gray-400 hover:text-white">
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8">
        {tab === 'dashboard' && (
          <div>
            <h2 className="font-display text-3xl mb-8">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Orders', value: '156' },
                { label: 'Revenue', value: 'QAR 48,200' },
                { label: 'Products', value: demoProducts.length },
                { label: 'Customers', value: '89' },
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
            <p className="text-muted">Order management connected to backend API.</p>
          </div>
        )}

        {tab !== 'dashboard' && tab !== 'products' && tab !== 'orders' && (
          <div>
            <h2 className="font-display text-3xl mb-4 capitalize">{tab.replace(/([A-Z])/g, ' $1')}</h2>
            <p className="text-muted">Manage {tab} via the admin API endpoints.</p>
          </div>
        )}
      </main>
    </div>
  )
}
