import { supabase, isSupabaseConfigured } from '../lib/supabase'

const LOCAL_PRODUCTS_KEY = 'maison_admin_products'
const LOCAL_CATEGORIES_KEY = 'maison_admin_categories'

function requireDb() {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured. Run backend/migrations/supabase.sql first.')
  }
  return supabase
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

// ─── Products ───

export async function getAdminProducts() {
  if (!isSupabaseConfigured()) {
    return readLocal(LOCAL_PRODUCTS_KEY)
  }
  const db = requireDb()
  const { data, error } = await db
    .from('products')
    .select('*, categories(id, slug, name_en)')
    .order('created_at', { ascending: false })
  if (error) throw error
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
  const { data, error } = await db
    .from('products')
    .insert({ ...product, updated_at: new Date().toISOString() })
    .select('*, categories(id, slug, name_en)')
    .single()
  if (error) throw error
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
  const { data, error } = await db
    .from('products')
    .update({ ...product, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*, categories(id, slug, name_en)')
    .single()
  if (error) throw error
  return data
}

export async function deleteProduct(id) {
  if (!isSupabaseConfigured()) {
    writeLocal(LOCAL_PRODUCTS_KEY, readLocal(LOCAL_PRODUCTS_KEY).filter((p) => p.id !== id))
    return
  }
  const db = requireDb()
  const { error } = await db.from('products').delete().eq('id', id)
  if (error) throw error
}

// ─── Categories ───

export async function getAdminCategories() {
  if (!isSupabaseConfigured()) {
    return readLocal(LOCAL_CATEGORIES_KEY, [
      { id: 1, slug: 'wedding', name_en: 'Wedding', name_ar: 'أعراس', sort_order: 1 },
      { id: 2, slug: 'birthday', name_en: 'Birthday', name_ar: 'أعياد ميلاد', sort_order: 2 },
      { id: 3, slug: 'corporate', name_en: 'Corporate', name_ar: 'شركات', sort_order: 3 },
      { id: 4, slug: 'seasonal', name_en: 'Seasonal', name_ar: 'موسمي', sort_order: 4 },
    ])
  }
  const db = requireDb()
  const { data, error } = await db.from('categories').select('*').order('sort_order')
  if (error) throw error
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
  if (error) throw error
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
  if (error) throw error
  return data
}

export async function deleteCategory(id) {
  if (!isSupabaseConfigured()) {
    writeLocal(LOCAL_CATEGORIES_KEY, readLocal(LOCAL_CATEGORIES_KEY, []).filter((c) => c.id !== id))
    return
  }
  const db = requireDb()
  const { error } = await db.from('categories').delete().eq('id', id)
  if (error) throw error
}

// ─── Coupons ───

export async function getAdminCoupons() {
  const db = requireDb()
  const { data, error } = await db.from('coupons').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createCoupon(coupon) {
  const db = requireDb()
  const { data, error } = await db.from('coupons').insert(coupon).select().single()
  if (error) throw error
  return data
}

export async function updateCoupon(id, coupon) {
  const db = requireDb()
  const { data, error } = await db.from('coupons').update(coupon).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteCoupon(id) {
  const db = requireDb()
  const { error } = await db.from('coupons').delete().eq('id', id)
  if (error) throw error
}

// ─── Custom orders ───

export async function getAdminCustomOrders() {
  const db = requireDb()
  const { data, error } = await db
    .from('custom_cake_orders')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function updateCustomOrderStatus(id, status, quotedPrice = null) {
  const db = requireDb()
  const payload = { status }
  if (quotedPrice != null) payload.quoted_price = quotedPrice
  const { data, error } = await db.from('custom_cake_orders').update(payload).eq('id', id).select().single()
  if (error) throw error
  return data
}

// ─── Contact messages ───

export async function getContactMessages() {
  const db = requireDb()
  const { data, error } = await db
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function markContactRead(id) {
  const db = requireDb()
  const { error } = await db.from('contact_messages').update({ is_read: true }).eq('id', id)
  if (error) throw error
}
