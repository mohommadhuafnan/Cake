import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import { products as staticProducts } from '../data/products'

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
