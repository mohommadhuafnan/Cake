import { useState, useEffect } from 'react'
import { getAdminReviews, updateReviewApproval, deleteReview } from '../../services/contentDb'
import { isSupabaseConfigured } from '../../lib/supabase'

export default function AdminReviewsTab() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = () => {
    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }
    setLoading(true)
    getAdminReviews()
      .then(setReviews)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  if (!isSupabaseConfigured()) {
    return (
      <div>
        <h2 className="font-display text-3xl mb-4">Product Reviews</h2>
        <p className="text-muted">Connect Supabase to manage customer reviews.</p>
      </div>
    )
  }

  const toggleApproval = async (id, approved) => {
    try {
      await updateReviewApproval(id, approved)
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return
    try {
      await deleteReview(id)
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div>
      <h2 className="font-display text-3xl mb-2">Product Reviews</h2>
      <p className="text-muted text-sm mb-6">Approve or remove customer reviews before they appear on the website.</p>

      {error && <p className="text-red-500 text-sm mb-4 bg-red-50 px-4 py-2 rounded">{error}</p>}

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>
      ) : reviews.length === 0 ? (
        <p className="text-muted bg-white p-8 shadow-sm">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white p-6 shadow-sm">
              <div className="flex flex-wrap justify-between gap-4 mb-2">
                <div>
                  <p className="font-medium">{r.customer_name}</p>
                  <p className="text-muted text-sm">{r.products?.name || 'Product'} · {'★'.repeat(r.rating)}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleApproval(r.id, !r.is_approved)}
                    className={`text-xs px-3 py-1 rounded ${r.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                  >
                    {r.is_approved ? 'Approved' : 'Pending — Click to Approve'}
                  </button>
                  <button onClick={() => handleDelete(r.id)} className="text-xs text-red-400 hover:underline">Delete</button>
                </div>
              </div>
              {r.comment && <p className="text-sm text-muted">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
