import { useState, useEffect } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { isAdminEmail } from '../config/admin'
import { isSupabaseConfigured } from '../lib/supabase'
import AdminDashboard from '../components/admin/AdminDashboard'
import AdminProductsTab from '../components/admin/AdminProductsTab'
import AdminCategoriesTab from '../components/admin/AdminCategoriesTab'
import AdminOrdersTab from '../components/admin/AdminOrdersTab'
import AdminCouponsTab from '../components/admin/AdminCouponsTab'
import AdminCustomOrdersTab from '../components/admin/AdminCustomOrdersTab'
import AdminContactTab from '../components/admin/AdminContactTab'
import AdminSettingsTab from '../components/admin/AdminSettingsTab'
import AdminContentTab from '../components/admin/AdminContentTab'
import AdminReviewsTab from '../components/admin/AdminReviewsTab'
import AdminNewsletterTab from '../components/admin/AdminNewsletterTab'

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: '◈' },
  { id: 'settings', label: 'Site Settings', icon: '⚙' },
  { id: 'content', label: 'Website Content', icon: '✎' },
  { id: 'products', label: 'Products', icon: '◆' },
  { id: 'categories', label: 'Categories', icon: '◇' },
  { id: 'orders', label: 'Orders', icon: '◉' },
  { id: 'coupons', label: 'Coupons', icon: '◎' },
  { id: 'customOrders', label: 'Custom Orders', icon: '✦' },
  { id: 'contact', label: 'Messages', icon: '✉' },
  { id: 'reviews', label: 'Reviews', icon: '★' },
  { id: 'newsletter', label: 'Newsletter', icon: '▤' },
]

export default function Admin() {
  const { user, loading, logout, isAuthenticated } = useAuth()
  const [tab, setTab] = useState('dashboard')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated || !isAdminEmail(user?.email)) {
    return <Navigate to="/account" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <aside className="w-full lg:w-64 bg-charcoal text-white p-6 lg:min-h-screen flex flex-col shrink-0">
        <Link to="/" className="font-display text-xl text-gold mb-1 hover:opacity-80">Maison Douceur</Link>
        <p className="text-xs text-gray-400 mb-1 truncate">{user.email}</p>
        <p className="text-[10px] text-gold/70 mb-6 uppercase tracking-widest">
          {isSupabaseConfigured() ? '● Live database' : '○ Local demo mode'}
        </p>

        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible flex-1 pb-4 lg:pb-0">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded text-sm transition-colors shrink-0 ${
                tab === t.id ? 'bg-gold text-charcoal font-medium' : 'hover:bg-white/10 text-gray-300'
              }`}
            >
              <span className="opacity-70">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        <button onClick={logout} className="text-sm text-gray-400 hover:text-white text-start mt-4 hidden lg:block">
          Logout
        </button>
      </aside>

      <main className="flex-1 p-6 lg:p-8 overflow-x-hidden">
        {tab === 'dashboard' && <AdminDashboard />}
        {tab === 'settings' && <AdminSettingsTab />}
        {tab === 'content' && <AdminContentTab />}
        {tab === 'products' && <AdminProductsTab />}
        {tab === 'categories' && <AdminCategoriesTab />}
        {tab === 'orders' && <AdminOrdersTab />}
        {tab === 'coupons' && <AdminCouponsTab />}
        {tab === 'customOrders' && <AdminCustomOrdersTab />}
        {tab === 'contact' && <AdminContactTab />}
        {tab === 'reviews' && <AdminReviewsTab />}
        {tab === 'newsletter' && <AdminNewsletterTab />}
      </main>
    </div>
  )
}
