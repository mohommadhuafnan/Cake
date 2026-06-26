import { useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import Navbar from './Navbar'
import Footer from './Footer'
import ScrollProgress from './ScrollProgress'
import WhatsAppButton from './WhatsAppButton'
import CartDrawer from './CartDrawer'
import CategoryNav from './CategoryNav'
import OfferPopup from './OfferPopup'
import { useScrollAnimations } from '../hooks/useScrollAnimations'

export default function Layout({ children, title, description, showCategoryNav = false, showOfferPopup = false, fullBleedHero = false }) {
  const { t } = useLanguage()
  useScrollAnimations()

  useEffect(() => {
    document.title = title ? `${title} — ${t('brand')}` : `${t('brand')} — ${t('tagline')}`
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc && description) metaDesc.setAttribute('content', description)
  }, [title, description, t])

  return (
    <>
      <ScrollProgress />
      <Navbar />
      {showCategoryNav && (
        <div className="fixed top-[calc(2.25rem+2.75rem)] left-0 right-0 z-40">
          <CategoryNav />
        </div>
      )}
      <main className={`min-h-screen ${fullBleedHero ? '' : showCategoryNav ? 'pt-[6.75rem]' : 'pt-[5.25rem]'}`}>
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
      <CartDrawer />
      {showOfferPopup && <OfferPopup />}
    </>
  )
}
