const API_BASE = import.meta.env.VITE_API_URL || '/backend/api'

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers })
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.message || 'Request failed')
  }

  return data
}

export const api = {
  getProducts: (params = '') => apiFetch(`/products.php${params}`),
  getProduct: (id) => apiFetch(`/products.php?id=${id}`),
  getCategories: () => apiFetch('/categories.php'),
  login: (body) => apiFetch('/auth.php?action=login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) => apiFetch('/auth.php?action=register', { method: 'POST', body: JSON.stringify(body) }),
  createOrder: (body) => apiFetch('/orders.php', { method: 'POST', body: JSON.stringify(body) }),
  trackOrder: (id) => apiFetch(`/orders.php?track=${id}`),
  submitContact: (body) => apiFetch('/contact.php', { method: 'POST', body: JSON.stringify(body) }),
  submitCustomOrder: (body) => apiFetch('/custom-orders.php', { method: 'POST', body: JSON.stringify(body) }),
  subscribeNewsletter: (email) => apiFetch('/newsletter.php', { method: 'POST', body: JSON.stringify({ email }) }),
  validateCoupon: (code) => apiFetch(`/coupons.php?code=${code}`),
}
