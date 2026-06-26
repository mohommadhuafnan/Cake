export function isStripeConfigured() {
  return Boolean(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
}

export async function createStripeCheckoutSession(payload) {
  const res = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Payment setup failed')
  }
  return data
}

export async function verifyStripeCheckoutSession(sessionId) {
  const res = await fetch('/api/verify-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Payment verification failed')
  }
  return data
}
