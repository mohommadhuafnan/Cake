import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import AuthUI from '../components/auth/AuthUI'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { isSupabaseConfigured } from '../lib/supabase'
import { isFirebaseConfigured } from '../lib/firebase'
import { isAdminEmail } from '../config/admin'
import { getOrdersByEmail } from '../services/supabaseDb'
import { formatPrice } from '../utils/currency'

export default function Account() {
  const { lang, t } = useLanguage()
  const navigate = useNavigate()
  const { user, login, loginWithGoogle, register, resetPassword, logout, isAuthenticated, isFirebaseEnabled, loading: authLoading } = useAuth()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState([])

  const redirectAfterAuth = (email) => {
    if (isAdminEmail(email)) {
      navigate('/admin', { replace: true })
    }
  }

  useEffect(() => {
    if (!authLoading && isAuthenticated && user && isAdminEmail(user.email)) {
      navigate('/admin', { replace: true })
    }
  }, [authLoading, isAuthenticated, user, navigate])

  useEffect(() => {
    if (!user?.email || !isSupabaseConfigured()) return
    getOrdersByEmail(user.email).then(setOrders).catch(() => setOrders([]))
  }, [user?.email])

  const handleAuth = async (mode, form) => {
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      let result
      if (mode === 'login') {
        result = await login(form.email, form.password)
      } else {
        result = await register(form)
      }
      redirectAfterAuth(result.user?.email || form.email)
    } catch (err) {
      if (!isFirebaseConfigured() && !isSupabaseConfigured() && mode === 'login' && form.email) {
        localStorage.setItem('token', 'demo-token')
        localStorage.setItem('user', JSON.stringify({ name: form.email.split('@')[0], email: form.email }))
        redirectAfterAuth(form.email)
        return
      }
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const result = await loginWithGoogle()
      redirectAfterAuth(result.user?.email)
    } catch (err) {
      setError(err.message || 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (email) => {
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await resetPassword(email)
      setSuccess(t('auth.resetLinkSent'))
    } catch (err) {
      setError(err.message || 'Failed to send reset link')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isAuthenticated && user && !isAdminEmail(user.email)) {
    return (
      <Layout title={t('account.dashboard')}>
        <div className="max-w-2xl mx-auto px-6 py-16">
          <h1 className="font-display text-5xl mb-8 fade-up">{t('account.dashboard')}</h1>
          <div className="glass-card p-8 mb-8 fade-up">
            <p className="text-muted text-sm uppercase tracking-widest mb-1">{t('account.profile')}</p>
            <p className="font-display text-2xl">{user.name}</p>
            <p className="text-muted">{user.email}</p>
          </div>
          <div className="space-y-4 fade-up">
            <h2 className="font-display text-2xl">{t('account.orders')}</h2>
            {orders.length === 0 ? (
              <p className="text-muted text-sm">No orders yet. Start shopping!</p>
            ) : (
              <ul className="space-y-3">
                {orders.map((o) => (
                  <li key={o.id} className="glass-card p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{o.order_number}</p>
                      <p className="text-muted text-xs capitalize">{o.status}</p>
                    </div>
                    <p className="text-gold font-medium">{formatPrice(Number(o.total), lang)}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button onClick={logout} className="btn-outline mt-8">{t('account.logout')}</button>
        </div>
      </Layout>
    )
  }

  if (isAuthenticated && user && isAdminEmail(user.email)) {
    return null
  }

  return (
    <AuthUI
      onSubmit={handleAuth}
      onGoogleSignIn={isFirebaseEnabled ? handleGoogleSignIn : undefined}
      onResetPassword={isFirebaseEnabled || isSupabaseConfigured() ? handleResetPassword : undefined}
      error={error}
      success={success}
      loading={loading}
    />
  )
}
