import { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { SiteProvider } from './context/SiteContext'
import LoadingScreen from './components/LoadingScreen'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import CustomCake from './pages/CustomCake'
import CartPage from './pages/CartPage'
import Checkout from './pages/Checkout'
import OrderTracking from './pages/OrderTracking'
import Account from './pages/Account'
import About from './pages/About'
import Contact from './pages/Contact'
import Admin from './pages/Admin'

function LegacyLangRedirect() {
  const location = useLocation()
  const path = location.pathname.replace(/^\/(en|ar)(?=\/|$)/, '') || '/'
  return <Navigate to={`${path}${location.search}${location.hash}`} replace />
}

function AppRoutes() {
  const [loading, setLoading] = useState(true)
  const handleLoadComplete = useCallback(() => setLoading(false), [])

  if (loading) {
    return <LoadingScreen onComplete={handleLoadComplete} />
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/custom" element={<CustomCake />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/tracking" element={<OrderTracking />} />
      <Route path="/account" element={<Account />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/admin/*" element={<Admin />} />
      <Route path="/en/*" element={<LegacyLangRedirect />} />
      <Route path="/ar/*" element={<LegacyLangRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <SiteProvider>
        <AuthProvider>
          <CartProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </SiteProvider>
    </LanguageProvider>
  )
}
