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

export async function createOrder({ form, items, total, userId = null }) {
  const db = requireSupabase()
  const orderNumber = generateOrderNumber()
  const subtotal = Number(total)

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
      subtotal,
      discount: 0,
      total: subtotal,
      payment_method: form.payment || 'card',
      payment_status: 'pending',
      status: 'pending',
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
