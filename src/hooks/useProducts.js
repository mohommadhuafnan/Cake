import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import { products as staticProducts } from '../data/products'
import { supabase, isSupabaseConfigured, mapSupabaseProduct } from '../lib/supabase'

const LOCAL_PRODUCTS_KEY = 'maison_admin_products'

function mapLocalAdminProduct(row) {
  return {
    id: row.id,
    name: { en: row.name_en, ar: row.name_ar },
    description: { en: row.description_en || '', ar: row.description_ar || '' },
    price: Number(row.price),
    category: row.category || 'birthday',
    image: row.image,
    images: row.images?.length ? row.images : row.image ? [row.image] : [],
    stock: row.stock ?? 0,
    rating: Number(row.rating) || 4.5,
    reviews: row.reviews ?? 0,
    popular: row.popular ?? 80,
  }
}

function mapApiProduct(row) {
  return {
    id: row.id,
    name: { en: row.name_en, ar: row.name_ar },
    description: { en: row.description_en || '', ar: row.description_ar || '' },
    price: Number(row.price),
    category: row.category || 'birthday',
    image: row.image,
    images: row.image ? [row.image] : [],
    stock: row.stock ?? 0,
    rating: Number(row.rating) || 4.5,
    reviews: row.reviews ?? 0,
    popular: row.popular ?? (Number(row.rating) * 20 || 80),
  }
}

export function useProducts() {
  const [products, setProducts] = useState(staticProducts)
  const [loading, setLoading] = useState(true)
  const [fromApi, setFromApi] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        if (isSupabaseConfigured()) {
          const { data, error } = await supabase
            .from('products')
            .select('*, categories(slug)')
            .eq('is_active', true)
            .order('created_at', { ascending: false })

          if (cancelled) return
          if (!error && data?.length > 0) {
            setProducts(data.map(mapSupabaseProduct))
            setFromApi(true)
            return
          }
        }

        const localRaw = localStorage.getItem(LOCAL_PRODUCTS_KEY)
        if (localRaw) {
          const local = JSON.parse(localRaw).filter((p) => p.is_active !== false)
          if (local.length > 0) {
            if (cancelled) return
            setProducts(local.map(mapLocalAdminProduct))
            setFromApi(true)
            return
          }
        }

        const data = await api.getProducts()
        if (cancelled) return
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data.map(mapApiProduct))
          setFromApi(true)
        }
      } catch {
        if (!cancelled) {
          setProducts(staticProducts)
          setFromApi(false)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { products, loading, fromApi }
}
