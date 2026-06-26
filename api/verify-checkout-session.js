import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return res.status(503).json({ error: 'Stripe is not configured' })
  }

  try {
    const { sessionId } = req.body
    if (!sessionId) {
      return res.status(400).json({ error: 'Missing session ID' })
    }

    const stripe = new Stripe(secretKey)
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return res.status(402).json({ error: 'Payment not completed', status: session.payment_status })
    }

    const orderId = session.metadata?.order_id
    const orderNumber = session.metadata?.order_number

    const supabase = getSupabaseAdmin()
    if (supabase && orderId) {
      await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          status: 'confirmed',
          updated_at: new Date().toISOString(),
          notes: `Paid via Stripe (${sessionId})`,
        })
        .eq('id', orderId)
    }

    return res.status(200).json({
      paid: true,
      orderNumber: orderNumber || null,
      orderId: orderId || null,
      customerEmail: session.customer_email || session.metadata?.customer_email,
    })
  } catch (err) {
    console.error('Stripe verify error:', err)
    return res.status(500).json({ error: err.message || 'Failed to verify payment' })
  }
}
