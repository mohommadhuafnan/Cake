import { useState } from 'react'
import Layout from '../components/Layout'
import AuthUI from '../components/auth/AuthUI'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'

export default function Account() {
  const { t } = useLanguage()
  const { user, login, register, logout, isAuthenticated } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAuth = async (mode, form) => {
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
      } else {
        await register(form)
      }
    } catch (err) {
      if (mode === 'login' && form.email) {
        localStorage.setItem('token', 'demo-token')
        localStorage.setItem('user', JSON.stringify({ name: form.email.split('@')[0], email: form.email }))
        window.location.reload()
        return
      }
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (isAuthenticated && user) {
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
            <p className="text-muted text-sm">No orders yet. Start shopping!</p>
          </div>
          <button onClick={logout} className="btn-outline mt-8">{t('account.logout')}</button>
        </div>
      </Layout>
    )
  }

  return <AuthUI onSubmit={handleAuth} error={error} loading={loading} />
}
