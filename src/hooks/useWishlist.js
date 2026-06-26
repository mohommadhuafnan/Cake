import { useState, useEffect, useCallback } from 'react'

export function useWishlist(productId) {
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem('wishlist') || '[]')
      setIsFavorite(list.includes(productId))
    } catch {
      setIsFavorite(false)
    }
  }, [productId])

  const toggle = useCallback(
    (e) => {
      e?.preventDefault()
      e?.stopPropagation()
      try {
        const list = JSON.parse(localStorage.getItem('wishlist') || '[]')
        const next = list.includes(productId)
          ? list.filter((id) => id !== productId)
          : [...list, productId]
        localStorage.setItem('wishlist', JSON.stringify(next))
        setIsFavorite(!isFavorite)
      } catch {
        setIsFavorite((v) => !v)
      }
    },
    [productId, isFavorite]
  )

  return { isFavorite, toggle }
}
