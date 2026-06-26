import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

function getSiteUrl() {
  if (process.env.VITE_SITE_URL) return process.env.VITE_SITE_URL.replace(/\/$/, '')
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:5173'
}

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
    return res.status(503).json({ error: 'Stripe is not configured. Add STRIPE_SECRET_KEY in Vercel environment variables.' })
  }

  try {
    const { orderId, orderNumber, items, subtotal, discount, total, form } = req.body

    if (!orderId || !orderNumber || !items?.length || !form?.email || !form?.name) {
      return res.status(400).json({ error: 'Missing order or customer details' })
    }

    const stripe = new Stripe(secretKey)
    const siteUrl = getSiteUrl()

    const payFactor = Number(subtotal) > 0 ? Number(total) / Number(subtotal) : 1

    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'qar',
        product_data: {
          name: typeof item.name === 'object' ? item.name.en || item.name : String(item.name),
          ...(item.image ? { images: [item.image] } : {}),
        },
        unit_amount: Math.round(Number(item.price) * payFactor * 100),
      },
      quantity: item.quantity,
    }))

    const sessionParams = {
      mode: 'payment',
      customer_email: form.email,
      line_items: lineItems,
      metadata: {
        order_id: String(orderId),
        order_number: orderNumber,
        customer_name: form.name.slice(0, 500),
        customer_email: form.email.slice(0, 500),
        subtotal: String(subtotal ?? total),
        discount: String(discount ?? 0),
        total: String(total),
      },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout?cancelled=1`,
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    const supabase = getSupabaseAdmin()
    if (supabase) {
      await supabase
        .from('orders')
        .update({ notes: `Stripe session: ${session.id}` })
        .eq('id', orderId)
    }

    return res.status(200).json({ url: session.url, sessionId: session.id })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return res.status(500).json({ error: err.message || 'Failed to create checkout session' })
  }
}
