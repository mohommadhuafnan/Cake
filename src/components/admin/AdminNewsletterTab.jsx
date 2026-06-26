import { useState, useEffect } from 'react'
import { getNewsletterSubscribers, toggleNewsletterSubscriber } from '../../services/contentDb'
import { isSupabaseConfigured } from '../../lib/supabase'

export default function AdminNewsletterTab() {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = () => {
    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }
    setLoading(true)
    getNewsletterSubscribers()
      .then(setSubscribers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  if (!isSupabaseConfigured()) {
    return (
      <div>
        <h2 className="font-display text-3xl mb-4">Newsletter</h2>
        <p className="text-muted">Connect Supabase to view newsletter subscribers.</p>
      </div>
    )
  }

  const toggleActive = async (id, active) => {
    try {
      await toggleNewsletterSubscriber(id, active)
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  const exportCsv = () => {
    const active = subscribers.filter((s) => s.is_active !== false)
    const csv = ['Email,Subscribed At', ...active.map((s) => `${s.email},${s.subscribed_at}`)].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'newsletter-subscribers.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
        <div>
          <h2 className="font-display text-3xl">Newsletter</h2>
          <p className="text-muted text-sm mt-1">{subscribers.length} total subscribers</p>
        </div>
        {subscribers.length > 0 && (
          <button onClick={exportCsv} className="btn-outline text-xs">Export CSV</button>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mb-4 bg-red-50 px-4 py-2 rounded">{error}</p>}

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>
      ) : subscribers.length === 0 ? (
        <p className="text-muted bg-white p-8 shadow-sm">No subscribers yet.</p>
      ) : (
        <div className="bg-white shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ivory text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Subscribed</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.id} className="border-t border-gray-100">
                  <td className="p-4">{s.email}</td>
                  <td className="p-4 text-muted">{new Date(s.subscribed_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleActive(s.id, !s.is_active)}
                      className={`text-xs px-2 py-1 rounded ${s.is_active !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {s.is_active !== false ? 'Active' : 'Unsubscribed'}
                    </button>
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
