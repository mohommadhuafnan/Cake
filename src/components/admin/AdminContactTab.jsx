import { useState, useEffect } from 'react'
import { getContactMessages, markContactRead } from '../../services/adminDb'
import { isSupabaseConfigured } from '../../lib/supabase'

export default function AdminContactTab() {
  const [messages, setMessages] = useState([])

  const load = () => {
    if (!isSupabaseConfigured()) return
    getContactMessages().then(setMessages).catch(() => setMessages([]))
  }

  useEffect(() => { load() }, [])

  if (!isSupabaseConfigured()) {
    return (
      <div>
        <h2 className="font-display text-3xl mb-4">Contact Messages</h2>
        <p className="text-muted">Connect Supabase to view contact form submissions.</p>
      </div>
    )
  }

  const markRead = async (id) => {
    await markContactRead(id)
    load()
  }

  return (
    <div>
      <h2 className="font-display text-3xl mb-2">Contact Messages</h2>
      <p className="text-muted text-sm mb-6">Messages from the contact form.</p>

      {messages.length === 0 ? (
        <p className="text-muted bg-white p-8 shadow-sm">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={`bg-white p-5 shadow-sm border-l-4 ${m.is_read ? 'border-gray-200' : 'border-gold'}`}>
              <div className="flex justify-between items-start gap-4 mb-2">
                <div>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-muted text-sm">{m.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted">{new Date(m.created_at).toLocaleString()}</p>
                  {!m.is_read && (
                    <button onClick={() => markRead(m.id)} className="text-gold text-xs mt-1 hover:underline">Mark read</button>
                  )}
                </div>
              </div>
              <p className="text-sm">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
