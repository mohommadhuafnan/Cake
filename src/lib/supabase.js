import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  ''

const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  ''

export const isSupabaseConfigured = () => Boolean(supabaseUrl && supabaseKey)

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

export function mapSupabaseProduct(row) {
  const category = row.categories?.slug || row.category || 'birthday'
  return {
    id: row.id,
    name: row.name || row.name_en || '',
    description: row.description || row.description_en || '',
    price: Number(row.price),
    category,
    image: row.image,
    images: row.images?.length ? row.images : row.image ? [row.image] : [],
    stock: row.stock ?? 0,
    rating: Number(row.rating) || 4.5,
    reviews: row.reviews ?? 0,
    popular: row.popular ?? (Number(row.rating) * 20 || 80),
  }
}
