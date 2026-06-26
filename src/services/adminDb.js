import { supabase, isSupabaseConfigured } from '../lib/supabase'

const LOCAL_PRODUCTS_KEY = 'maison_admin_products'
const LOCAL_CATEGORIES_KEY = 'maison_admin_categories'

function requireDb() {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured. Run backend/migrations/supabase.sql first.')
  }
  return supabase
}

function wrapDbError(error) {
  const msg = error?.message || ''
  if (msg.includes('site_settings') || msg.includes('cms_blocks') || (msg.includes('categories') && msg.includes('name'))) {
    throw new Error(
      'Database needs updating. Run backend/migrations/supabase_fix_all.sql in Supabase SQL Editor, then refresh.',
    )
  }
  if (msg.includes("'category'") && msg.includes('products')) {
    throw new Error(
      'Product save error fixed in latest update — refresh the page and try again. If it persists, run supabase_fix_all.sql.',
    )
  }
  throw error
}

function readLocal(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeLocal(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function isAdminDbLive() {
  return isSupabaseConfigured()
}

/** Only columns that exist on the Supabase `products` table */
function toSupabaseProductRow(product) {
  return {
    name: product.name,
    description: product.description ?? '',
    price: product.price,
    category_id: product.category_id ?? null,
    image: product.image ?? '',
    images: product.images ?? (product.image ? [product.image] : []),
    stock: product.stock ?? 0,
    rating: product.rating ?? 4.5,
    reviews: product.reviews ?? 0,
    popular: product.popular ?? 80,
    is_active: product.is_active !== false,
  }
}

// ─── Products ───

export async function getAdminProducts() {
  if (!isSupabaseConfigured()) {
    return readLocal(LOCAL_PRODUCTS_KEY)
  }
  const db = requireDb()
  const { data, error } = await db
    .from('products')
    .select('*, categories(id, slug)')
    .order('created_at', { ascending: false })
  if (error) wrapDbError(error)
  return data || []
}

export async function createProduct(product) {
  if (!isSupabaseConfigured()) {
    const list = readLocal(LOCAL_PRODUCTS_KEY)
    const row = { ...product, id: Date.now(), created_at: new Date().toISOString() }
    writeLocal(LOCAL_PRODUCTS_KEY, [row, ...list])
    return row
  }
  const db = requireDb()
  const row = toSupabaseProductRow(product)
  const { data, error } = await db
    .from('products')
    .insert({ ...row, updated_at: new Date().toISOString() })
    .select('*, categories(id, slug)')
    .single()
  if (error) wrapDbError(error)
  return data
}

export async function updateProduct(id, product) {
  if (!isSupabaseConfigured()) {
    const list = readLocal(LOCAL_PRODUCTS_KEY)
    const next = list.map((p) => (p.id === id ? { ...p, ...product } : p))
    writeLocal(LOCAL_PRODUCTS_KEY, next)
    return next.find((p) => p.id === id)
  }
  const db = requireDb()
  const row = product.is_active !== undefined && Object.keys(product).length === 1
    ? { is_active: product.is_active }
    : toSupabaseProductRow(product)
  const { data, error } = await db
    .from('products')
    .update({ ...row, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*, categories(id, slug)')
    .single()
  if (error) wrapDbError(error)
  return data
}

export async function deleteProduct(id) {
  if (!isSupabaseConfigured()) {
    writeLocal(LOCAL_PRODUCTS_KEY, readLocal(LOCAL_PRODUCTS_KEY).filter((p) => p.id !== id))
    return
  }
  const db = requireDb()
  const { error } = await db.from('products').delete().eq('id', id)
  if (error) wrapDbError(error)
}

// ─── Categories ───

export async function getAdminCategories() {
  if (!isSupabaseConfigured()) {
    return readLocal(LOCAL_CATEGORIES_KEY, [
      { id: 1, slug: 'wedding', name: 'Wedding', sort_order: 1 },
      { id: 2, slug: 'birthday', name: 'Birthday', sort_order: 2 },
      { id: 3, slug: 'corporate', name: 'Corporate', sort_order: 3 },
      { id: 4, slug: 'seasonal', name: 'Seasonal', sort_order: 4 },
    ])
  }
  const db = requireDb()
  const { data, error } = await db.from('categories').select('*').order('sort_order')
  if (error) wrapDbError(error)
  return data || []
}

export async function createCategory(category) {
  if (!isSupabaseConfigured()) {
    const list = readLocal(LOCAL_CATEGORIES_KEY, [])
    const row = { ...category, id: Date.now() }
    writeLocal(LOCAL_CATEGORIES_KEY, [...list, row])
    return row
  }
  const db = requireDb()
  const { data, error } = await db.from('categories').insert(category).select().single()
  if (error) wrapDbError(error)
  return data
}

export async function updateCategory(id, category) {
  if (!isSupabaseConfigured()) {
    const list = readLocal(LOCAL_CATEGORIES_KEY, [])
    const next = list.map((c) => (c.id === id ? { ...c, ...category } : c))
    writeLocal(LOCAL_CATEGORIES_KEY, next)
    return next.find((c) => c.id === id)
  }
  const db = requireDb()
  const { data, error } = await db.from('categories').update(category).eq('id', id).select().single()
  if (error) wrapDbError(error)
  return data
}

export async function deleteCategory(id) {
  if (!isSupabaseConfigured()) {
    writeLocal(LOCAL_CATEGORIES_KEY, readLocal(LOCAL_CATEGORIES_KEY, []).filter((c) => c.id !== id))
    return
  }
  const db = requireDb()
  const { error } = await db.from('categories').delete().eq('id', id)
  if (error) wrapDbError(error)
}

// ─── Coupons ───

export async function getAdminCoupons() {
  const db = requireDb()
  const { data, error } = await db.from('coupons').select('*').order('created_at', { ascending: false })
  if (error) wrapDbError(error)
  return data || []
}

export async function createCoupon(coupon) {
  const db = requireDb()
  const { data, error } = await db.from('coupons').insert(coupon).select().single()
  if (error) wrapDbError(error)
  return data
}

export async function updateCoupon(id, coupon) {
  const db = requireDb()
  const { data, error } = await db.from('coupons').update(coupon).eq('id', id).select().single()
  if (error) wrapDbError(error)
  return data
}

export async function deleteCoupon(id) {
  const db = requireDb()
  const { error } = await db.from('coupons').delete().eq('id', id)
  if (error) wrapDbError(error)
}

// ─── Custom orders ───

export async function getAdminCustomOrders() {
  const db = requireDb()
  const { data, error } = await db
    .from('custom_cake_orders')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) wrapDbError(error)
  return data || []
}

export async function updateCustomOrderStatus(id, status, quotedPrice = null) {
  const db = requireDb()
  const payload = { status }
  if (quotedPrice != null) payload.quoted_price = quotedPrice
  const { data, error } = await db.from('custom_cake_orders').update(payload).eq('id', id).select().single()
  if (error) wrapDbError(error)
  return data
}

// ─── Contact messages ───

export async function getContactMessages() {
  const db = requireDb()
  const { data, error } = await db
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) wrapDbError(error)
  return data || []
}

export async function markContactRead(id) {
  const db = requireDb()
  const { error } = await db.from('contact_messages').update({ is_read: true }).eq('id', id)
  if (error) wrapDbError(error)
}
