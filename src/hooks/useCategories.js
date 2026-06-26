import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { categories as staticCategories } from '../data/products'
import { getAdminCategories } from '../services/adminDb'

const LOCAL_CATEGORIES_KEY = 'maison_admin_categories'

export function useCategories() {
  const [categories, setCategories] = useState(staticCategories)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        if (isSupabaseConfigured()) {
          const { data, error } = await supabase.from('categories').select('*').order('sort_order')
          if (!cancelled && !error && data?.length) {
            setCategories(data.map((c) => ({
              id: c.slug,
              name: c.name,
              image: c.image || '',
            })))
            return
          }
        }

        const localRaw = localStorage.getItem(LOCAL_CATEGORIES_KEY)
        if (localRaw) {
          const local = JSON.parse(localRaw)
          if (local.length > 0) {
            if (!cancelled) {
              setCategories(local.map((c) => ({
                id: c.slug,
                name: c.name,
                image: c.image || '',
              })))
            }
            return
          }
        }

        const adminCats = await getAdminCategories().catch(() => [])
        if (!cancelled && adminCats.length > 0) {
          setCategories(adminCats.map((c) => ({
            id: c.slug,
            name: c.name,
            image: c.image || '',
          })))
        }
      } catch {
        if (!cancelled) setCategories(staticCategories)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { categories, loading }
}
