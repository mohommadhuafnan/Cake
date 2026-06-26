import { supabase, isSupabaseConfigured } from '../lib/supabase'

function requireSupabase() {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured')
  }
  return supabase
}

function generateOrderNumber() {
  return `MD${Date.now().toString(36).toUpperCase()}`
}

export async function upsertCustomerProfile({ id, name, email, phone, city }) {
  if (!id || !email) return null
  const db = requireSupabase()
  const { data, error } = await db
    .from('customer_profiles')
    .upsert({ id, name, email, phone, city, updated_at: new Date().toISOString() }, { onConflict: 'id' })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function createOrder({ form, items, subtotal, discount = 0, total, couponCode = null, userId = null }) {
  const db = requireSupabase()
  const orderNumber = generateOrderNumber()
  const orderSubtotal = Number(subtotal ?? total)
  const orderDiscount = Number(discount) || 0
  const orderTotal = Number(total ?? orderSubtotal - orderDiscount)

  const { data: order, error: orderError } = await db
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: userId,
      customer_name: form.name,
      customer_email: form.email,
      customer_phone: form.phone || null,
      shipping_address: form.address,
      city: form.city || 'Doha',
      subtotal: orderSubtotal,
      discount: orderDiscount,
      total: orderTotal,
      payment_method: form.payment || 'card',
      payment_status: 'pending',
      status: 'pending',
      notes: couponCode ? `Coupon: ${couponCode}` : null,
    })
    .select()
    .single()

  if (orderError) throw orderError

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    product_name: typeof item.name === 'object' ? item.name.en : item.name,
    quantity: item.quantity,
    unit_price: item.price,
    total_price: item.price * item.quantity,
  }))

  const { error: itemsError } = await db.from('order_items').insert(orderItems)
  if (itemsError) throw itemsError

  await db.from('delivery_tracking').insert({
    order_id: order.id,
    status: 'pending',
    notes: 'Order placed',
  })

  return order
}

export async function trackOrder(orderNumber) {
  const db = requireSupabase()
  const q = orderNumber.trim()

  let { data, error } = await db
    .from('orders')
    .select('id, order_number, status, payment_status, total, created_at, customer_name')
    .eq('order_number', q)
    .maybeSingle()

  if (!data && /^\d+$/.test(q)) {
    ({ data, error } = await db
      .from('orders')
      .select('id, order_number, status, payment_status, total, created_at, customer_name')
      .eq('id', q)
      .maybeSingle())
  }

  if (error) throw error
  if (!data) throw new Error('Order not found')
  return data
}

export async function getOrdersByEmail(email) {
  const db = requireSupabase()
  const { data, error } = await db
    .from('orders')
    .select('id, order_number, status, total, created_at')
    .eq('customer_email', email)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getAllOrders() {
  const db = requireSupabase()
  const { data, error } = await db
    .from('orders')
    .select('id, order_number, customer_name, customer_email, status, total, created_at')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function updateOrderStatus(id, status) {
  const db = requireSupabase()
  const { data, error } = await db
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error

  await db.from('delivery_tracking').insert({ order_id: id, status, notes: `Status updated to ${status}` })
  return data
}

export async function submitContactMessage(form) {
  const db = requireSupabase()
  const { error } = await db.from('contact_messages').insert({
    name: form.name,
    email: form.email,
    message: form.message,
  })
  if (error) throw error
}

export async function submitCustomCakeOrder(form, userId = null) {
  const db = requireSupabase()
  const { error } = await db.from('custom_cake_orders').insert({
    user_id: userId,
    customer_name: form.name,
    customer_email: form.email,
    customer_phone: form.phone || null,
    cake_size: form.size,
    flavor: form.flavor,
    design_description: form.design,
    delivery_date: form.date,
    special_notes: form.notes || null,
    status: 'pending',
  })
  if (error) throw error
}

export async function subscribeNewsletter(email) {
  const db = requireSupabase()
  const { error } = await db.from('newsletter_subscribers').upsert(
    { email, is_active: true },
    { onConflict: 'email' },
  )
  if (error) throw error
}

export async function getDashboardStats() {
  const db = requireSupabase()
  const [ordersRes, productsRes, customRes, contactRes] = await Promise.all([
    db.from('orders').select('id, total', { count: 'exact', head: false }),
    db.from('products').select('id', { count: 'exact', head: true }),
    db.from('custom_cake_orders').select('id', { count: 'exact', head: true }),
    db.from('contact_messages').select('id', { count: 'exact', head: true }),
  ])

  const orders = ordersRes.data || []
  const revenue = orders.reduce((sum, o) => sum + Number(o.total), 0)

  return {
    orderCount: ordersRes.count ?? orders.length,
    revenue,
    productCount: productsRes.count ?? 0,
    customOrderCount: customRes.count ?? 0,
    contactCount: contactRes.count ?? 0,
  }
}

export async function checkSupabaseConnection() {
  if (!isSupabaseConfigured()) return { ok: false, reason: 'not_configured' }
  try {
    const db = requireSupabase()
    const { count, error } = await db.from('categories').select('id', { count: 'exact', head: true })
    if (error) return { ok: false, reason: error.message }
    return { ok: true, categories: count ?? 0 }
  } catch (e) {
    return { ok: false, reason: e.message }
  }
}

const FALLBACK_COUPONS = [
  { id: 1, code: 'WELCOME10', type: 'percentage', value: 10, min_order: 100, is_active: true },
  { id: 2, code: 'FLAT50', type: 'fixed', value: 50, min_order: 200, is_active: true },
]

export async function getActiveCoupons() {
  if (!isSupabaseConfigured()) return FALLBACK_COUPONS

  const db = requireSupabase()
  const { data, error } = await db
    .from('coupons')
    .select('id, code, type, value, min_order, max_uses, used_count, expires_at, is_active')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error

  const now = new Date()
  return (data || []).filter((c) => {
    if (c.expires_at && new Date(c.expires_at) < now) return false
    if (c.max_uses && c.used_count >= c.max_uses) return false
    return true
  })
}

export async function validateCoupon(code, subtotal = 0) {
  const normalized = code.trim().toUpperCase()
  if (!normalized) throw new Error('Enter a coupon code')

  let coupon
  if (isSupabaseConfigured()) {
    const db = requireSupabase()
    const { data, error } = await db
      .from('coupons')
      .select('*')
      .eq('code', normalized)
      .eq('is_active', true)
      .maybeSingle()
    if (error) throw error
    coupon = data
  } else {
    coupon = FALLBACK_COUPONS.find((c) => c.code === normalized)
  }

  if (!coupon) throw new Error('Invalid coupon code')
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    throw new Error('This coupon has expired')
  }
  if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
    throw new Error('This coupon is no longer available')
  }
  if (subtotal > 0 && Number(coupon.min_order) > subtotal) {
    throw new Error(`Minimum order is QAR ${Number(coupon.min_order).toLocaleString('en-QA')}`)
  }

  return coupon
}
