import { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
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
import LangSync from './components/LangSync'

function LangRedirect() {
  const stored = localStorage.getItem('lang')
  const browserLang = navigator.language?.split('-')[0]
  const lang = stored || (browserLang === 'ar' ? 'ar' : 'en')
  return <Navigate to={`/${lang}`} replace />
}

function LocalizedRoutes() {
  const { lang } = useParams()
  if (lang !== 'en' && lang !== 'ar') {
    return <Navigate to="/en" replace />
  }

  return (
    <LangSync>
      <Routes>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="custom" element={<CustomCake />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="tracking" element={<OrderTracking />} />
        <Route path="account" element={<Account />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<Navigate to={`/${lang}`} replace />} />
      </Routes>
    </LangSync>
  )
}

function AppRoutes() {
  const [loading, setLoading] = useState(true)
  const handleLoadComplete = useCallback(() => setLoading(false), [])

  if (loading) {
    return <LoadingScreen onComplete={handleLoadComplete} />
  }

  return (
    <Routes>
      <Route path="/" element={<LangRedirect />} />
      <Route path="/admin/*" element={<Admin />} />
      <Route path="/:lang/*" element={<LocalizedRoutes />} />
      <Route path="*" element={<LangRedirect />} />
    </Routes>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}
