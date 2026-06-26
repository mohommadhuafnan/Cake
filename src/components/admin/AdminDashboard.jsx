import { useState, useEffect } from 'react'
import { formatPrice } from '../../utils/currency'
import { getDashboardStats } from '../../services/supabaseDb'
import { getAdminProducts } from '../../services/adminDb'
import { isSupabaseConfigured } from '../../lib/supabase'
import { products as demoProducts } from '../../data/products'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [productCount, setProductCount] = useState(demoProducts.length)

  useEffect(() => {
    if (isSupabaseConfigured()) {
      getDashboardStats().then(setStats).catch(() => setStats(null))
    }
    getAdminProducts().then((p) => setProductCount(p.length)).catch(() => {})
  }, [])

  const cards = [
    { label: 'Total Orders', value: stats ? String(stats.orderCount) : '—' },
    { label: 'Revenue', value: stats ? formatPrice(stats.revenue, 'en') : '—' },
    { label: 'Products', value: String(productCount) },
    { label: 'Custom Requests', value: stats ? String(stats.customOrderCount) : '—' },
    { label: 'Contact Messages', value: stats ? String(stats.contactCount) : '—' },
  ]

  return (
    <div>
      <h2 className="font-display text-3xl mb-2">Dashboard</h2>
      <p className="text-muted text-sm mb-8">Overview of your Maison Douceur store.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((s) => (
          <div key={s.label} className="bg-white p-6 shadow-sm">
            <p className="text-muted text-sm">{s.label}</p>
            <p className="font-display text-2xl mt-1">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-white p-6 shadow-sm">
        <h3 className="font-display text-lg mb-2">Quick tips</h3>
        <ul className="text-sm text-muted space-y-1 list-disc list-inside">
          <li>Use <strong className="text-charcoal">Products</strong> to add cakes with image URL, price, and stock.</li>
          <li>Use <strong className="text-charcoal">Categories</strong> to organize your catalog.</li>
          <li>Changes appear on the live website immediately after saving.</li>
        </ul>
      </div>
    </div>
  )
}
