import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { validateCoupon } from '../services/supabaseDb'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]')
    } catch {
      return []
    }
  })
  const [isOpen, setIsOpen] = useState(false)
  const [coupon, setCoupon] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cartCoupon') || 'null')
    } catch {
      return null
    }
  })
  const [couponError, setCouponError] = useState('')

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  useEffect(() => {
    if (coupon) localStorage.setItem('cartCoupon', JSON.stringify(coupon))
    else localStorage.removeItem('cartCoupon')
  }, [coupon])

  const addItem = useCallback((product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [...prev, { ...product, quantity }]
    })
  }, [])

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const updateQuantity = useCallback((id, quantity) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id))
      return
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    setCoupon(null)
    setCouponError('')
  }, [])

  const applyCoupon = useCallback(async (code, subtotal) => {
    setCouponError('')
    try {
      const validated = await validateCoupon(code, subtotal)
      setCoupon(validated)
      return true
    } catch (e) {
      setCoupon(null)
      setCouponError(e.message)
      return false
    }
  }, [])

  const removeCoupon = useCallback(() => {
    setCoupon(null)
    setCouponError('')
  }, [])

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const discount = coupon
    ? coupon.type === 'percentage'
      ? subtotal * (Number(coupon.value) / 100)
      : Number(coupon.value)
    : 0
  const total = Math.max(0, subtotal - discount)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        discount,
        total,
        isOpen,
        setIsOpen,
        coupon,
        setCoupon,
        applyCoupon,
        removeCoupon,
        couponError,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
