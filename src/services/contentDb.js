import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { DEFAULT_SETTINGS, getDefaultCmsBlocks } from '../data/defaultSite'

const LOCAL_SETTINGS_KEY = 'maison_site_settings'
const LOCAL_CMS_KEY = 'maison_cms_blocks'

function readLocal(key, fallback) {
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

function requireDb() {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured.')
  }
  return supabase
}

function wrapDbError(error) {
  const msg = error?.message || ''
  if (msg.includes('site_settings') || msg.includes('cms_blocks')) {
    throw new Error(
      'CMS tables missing. Open Supabase → SQL Editor → run the file backend/migrations/supabase_fix_all.sql → then refresh this page.',
    )
  }
  if (msg.includes('categories') && msg.includes('name')) {
    throw new Error(
      'Database columns outdated. Run backend/migrations/supabase_fix_all.sql in Supabase SQL Editor, then refresh.',
    )
  }
  throw error
}

function mapBlock(row) {
  return {
    id: row.id,
    type: row.type,
    title: row.title || '',
    subtitle: row.subtitle || '',
    body: row.body || '',
    image: row.image || '',
    link: row.link || '',
    cta: row.cta || '',
    tag: row.tag || '',
    sort_order: row.sort_order ?? 0,
    is_active: row.is_active !== false,
    meta: row.meta || {},
  }
}

// ─── Site Settings ───

export async function getSiteSettings() {
  if (!isSupabaseConfigured()) {
    const stored = readLocal(LOCAL_SETTINGS_KEY, null)
    return { ...DEFAULT_SETTINGS, ...(stored || {}) }
  }

  const db = requireDb()
  const { data, error } = await db.from('site_settings').select('key, value')
  if (error) wrapDbError(error)

  const settings = { ...DEFAULT_SETTINGS }
  ;(data || []).forEach((row) => {
    settings[row.key] = row.value
  })
  return settings
}

export async function updateSiteSettings(updates) {
  if (!isSupabaseConfigured()) {
    const current = readLocal(LOCAL_SETTINGS_KEY, { ...DEFAULT_SETTINGS })
    const next = { ...current, ...updates }
    writeLocal(LOCAL_SETTINGS_KEY, next)
    return next
  }

  const db = requireDb()
  const rows = Object.entries(updates).map(([key, value]) => ({
    key,
    value: String(value ?? ''),
    updated_at: new Date().toISOString(),
  }))

  const { error } = await db.from('site_settings').upsert(rows, { onConflict: 'key' })
  if (error) wrapDbError(error)
  return getSiteSettings()
}

export function parseJsonSetting(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

// ─── CMS Blocks ───

export async function getCmsBlocks(type = null) {
  if (!isSupabaseConfigured()) {
    let blocks = readLocal(LOCAL_CMS_KEY, null)
    if (!blocks?.length) {
      blocks = getDefaultCmsBlocks()
      writeLocal(LOCAL_CMS_KEY, blocks)
    }
    const filtered = type ? blocks.filter((b) => b.type === type && b.is_active !== false) : blocks
    return filtered.sort((a, b) => a.sort_order - b.sort_order)
  }

  const db = requireDb()
  let query = db.from('cms_blocks').select('*').order('sort_order')
  if (type) query = query.eq('type', type)
  const { data, error } = await query
  if (error) wrapDbError(error)
  return (data || []).map(mapBlock).filter((b) => b.is_active !== false)
}

export async function getAdminCmsBlocks(type = null) {
  if (!isSupabaseConfigured()) {
    let blocks = readLocal(LOCAL_CMS_KEY, null)
    if (!blocks?.length) {
      blocks = getDefaultCmsBlocks()
      writeLocal(LOCAL_CMS_KEY, blocks)
    }
    const filtered = type ? blocks.filter((b) => b.type === type) : blocks
    return filtered.sort((a, b) => a.sort_order - b.sort_order)
  }

  const db = requireDb()
  let query = db.from('cms_blocks').select('*').order('sort_order')
  if (type) query = query.eq('type', type)
  const { data, error } = await query
  if (error) wrapDbError(error)
  return (data || []).map(mapBlock)
}

export async function createCmsBlock(block) {
  const payload = {
    type: block.type,
    title: block.title || '',
    subtitle: block.subtitle || '',
    body: block.body || '',
    image: block.image || '',
    link: block.link || '',
    cta: block.cta || '',
    tag: block.tag || '',
    sort_order: Number(block.sort_order) || 0,
    is_active: block.is_active !== false,
    meta: block.meta || {},
  }

  if (!isSupabaseConfigured()) {
    const list = readLocal(LOCAL_CMS_KEY, getDefaultCmsBlocks())
    const row = { ...payload, id: Date.now() }
    writeLocal(LOCAL_CMS_KEY, [...list, row])
    return row
  }

  const db = requireDb()
  const { data, error } = await db.from('cms_blocks').insert(payload).select().single()
  if (error) wrapDbError(error)
  return mapBlock(data)
}

export async function updateCmsBlock(id, block) {
  const payload = {
    title: block.title ?? '',
    subtitle: block.subtitle ?? '',
    body: block.body ?? '',
    image: block.image ?? '',
    link: block.link ?? '',
    cta: block.cta ?? '',
    tag: block.tag ?? '',
    sort_order: Number(block.sort_order) || 0,
    is_active: block.is_active !== false,
    meta: block.meta || {},
  }

  if (!isSupabaseConfigured()) {
    const list = readLocal(LOCAL_CMS_KEY, getDefaultCmsBlocks())
    const next = list.map((b) => (b.id === id ? { ...b, ...payload, type: b.type } : b))
    writeLocal(LOCAL_CMS_KEY, next)
    return next.find((b) => b.id === id)
  }

  const db = requireDb()
  const { data, error } = await db.from('cms_blocks').update(payload).eq('id', id).select().single()
  if (error) wrapDbError(error)
  return mapBlock(data)
}

export async function deleteCmsBlock(id) {
  if (!isSupabaseConfigured()) {
    writeLocal(
      LOCAL_CMS_KEY,
      readLocal(LOCAL_CMS_KEY, getDefaultCmsBlocks()).filter((b) => b.id !== id),
    )
    return
  }
  const db = requireDb()
  const { error } = await db.from('cms_blocks').delete().eq('id', id)
  if (error) wrapDbError(error)
}

// ─── Reviews (admin) ───

export async function getAdminReviews() {
  const db = requireDb()
  const { data, error } = await db
    .from('reviews')
    .select('*, products(name)')
    .order('created_at', { ascending: false })
  if (error) wrapDbError(error)
  return data || []
}

export async function updateReviewApproval(id, isApproved) {
  const db = requireDb()
  const { error } = await db.from('reviews').update({ is_approved: isApproved }).eq('id', id)
  if (error) wrapDbError(error)
}

export async function deleteReview(id) {
  const db = requireDb()
  const { error } = await db.from('reviews').delete().eq('id', id)
  if (error) wrapDbError(error)
}

// ─── Newsletter (admin) ───

export async function getNewsletterSubscribers() {
  const db = requireDb()
  const { data, error } = await db
    .from('newsletter_subscribers')
    .select('*')
    .order('subscribed_at', { ascending: false })
  if (error) wrapDbError(error)
  return data || []
}

export async function toggleNewsletterSubscriber(id, isActive) {
  const db = requireDb()
  const { error } = await db.from('newsletter_subscribers').update({ is_active: isActive }).eq('id', id)
  if (error) wrapDbError(error)
}
