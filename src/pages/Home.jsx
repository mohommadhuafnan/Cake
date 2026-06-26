import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import ProductCard from '../components/ProductCard'
import TestimonialsCarousel from '../components/TestimonialsCarousel'
import QuickViewModal from '../components/QuickViewModal'
import CategoryShowcase from '../components/CategoryShowcase'
import SpecialOfferCards from '../components/SpecialOfferCards'
import HeroBannerCarousel from '../components/HeroBannerCarousel'
import ProductCarousel from '../components/ProductCarousel'
import PromoBanner from '../components/PromoBanner'
import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import GallerySection from '../components/GallerySection'
import { testimonials } from '../data/products'
import { promoBanners } from '../data/homeContent'
import { triggerAddToCartAnimation } from '../hooks/useScrollAnimations'
import { useProducts } from '../hooks/useProducts'
import HeroSection from '../components/HeroSection'

export default function Home() {
  const { lang, t, localized } = useLanguage()
  const { addItem } = useCart()
  const { products } = useProducts()
  const [quickView, setQuickView] = useState(null)

  const signatureProducts = products.filter((p) => p.category === 'wedding' || p.popular >= 90)
  const topSelling = [...products].sort((a, b) => b.popular - a.popular).slice(0, 6)
  const delightProducts = products.filter((p) => p.category === 'birthday' || p.category === 'seasonal')
  const galleryItems = [1, 3, 6, 5, 2, 4]
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)
    .map((p) => ({ id: p.id, src: p.image, name: p.name, price: p.price }))

  const handleQuickAdd = (product) => {
    addItem(product)
    triggerAddToCartAnimation(null, document.getElementById('cart-badge'))
  }

  return (
    <Layout title={t('nav.home')} description={t('hero.subtitle')} showCategoryNav showOfferPopup fullBleedHero>
      {/* Hero — 4-image loop + typing animation */}
      <HeroSection />

      {/* Category Showcase — like Caravan Fresh 3 cards */}
      <CategoryShowcase />

      {/* Special Offers — Create Your Own / Photo / Dream Shape */}
      <SpecialOfferCards />

      {/* Hero Promo Carousel — GATEAU style */}
      <HeroBannerCarousel />

      <div className="gold-ribbon" />

      {/* Signature Gateau Cakes carousel */}
      <ProductCarousel
        title={{ en: 'Signature Gateau Cakes', ar: 'كيك التوقيع الفاخر' }}
        subtitle={{ en: 'Elevate your celebrations with our signature creations, available for order today.', ar: 'ارتقِ باحتفالاتك مع إبداعاتنا المميزة، متوفرة للطلب اليوم.' }}
        products={signatureProducts}
      />

      {/* Best Sellers Promo Banner */}
      <PromoBanner banner={promoBanners[0]} />

      {/* Top Selling Products */}
      <ProductCarousel
        title={{ en: 'Top-Selling Products', ar: 'المنتجات الأكثر مبيعاً' }}
        subtitle={{ en: 'Our customers\' most loved cakes — order yours today.', ar: 'كيك عملائنا المفضل — اطلب كيكك اليوم.' }}
        products={topSelling}
      />

      {/* Cakes of Delight — live from API */}
      <ProductCarousel
        title={{ en: 'Cakes of Delight', ar: 'كيك المتعة' }}
        subtitle={{ en: 'Freshly baked delights for every sweet craving.', ar: 'متع طازجة لكل رغبة حلوة.' }}
        products={delightProducts}
        promoCard={{
          title: promoBanners[1].title,
          cta: promoBanners[1].cta,
          image: promoBanners[1].image,
          link: 'shop',
        }}
      />

      {/* Featured grid */}
      <section className="py-16 bg-ivory">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl fade-up">{t('featured.title')}</h2>
            <p className="text-muted mt-3 fade-up">{t('featured.subtitle')}</p>
          </div>
          <div className="stagger-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={setQuickView} />
            ))}
          </div>
        </div>
      </section>

      {/* About Snippet */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <img
            src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80"
            alt=""
            className="slide-image slide-image--left w-full aspect-[4/5] object-cover rounded-2xl"
            loading="lazy"
          />
          <div>
            <h2 className="font-display text-4xl mb-2 fade-up">{t('about.title')}</h2>
            <p className="text-gold uppercase tracking-widest text-sm mb-6 fade-up">{t('about.subtitle')}</p>
            <p className="text-muted leading-relaxed mb-8 fade-up">{t('about.text')}</p>
            <Link to={`/${lang}/about`} className="btn-outline fade-up">{t('nav.about')}</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section py-20 bg-charcoal text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { count: 5000, suffix: '+', label: t('stats.orders') },
            { count: 3200, suffix: '+', label: t('stats.customers') },
            { count: 12, suffix: '', label: t('stats.years') },
          ].map((stat, i) => (
            <div key={i} className="fade-up">
              <p className="font-display text-5xl md:text-6xl text-gold mb-2" data-count={stat.count} data-suffix={stat.suffix}>0</p>
              <p className="text-gray-400 uppercase tracking-widest text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <GallerySection items={galleryItems} />

      <TestimonialsCarousel items={testimonials} />

      {/* CTA */}
      <section className="py-20 text-center bg-white">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-display text-4xl mb-4 fade-up">{t('custom.title')}</h2>
          <p className="text-muted mb-8 fade-up">{t('custom.subtitle')}</p>
          <Link to={`/${lang}/custom`} className="btn-primary fade-up">{t('hero.ctaSecondary')}</Link>
        </div>
      </section>

      <QuickViewModal
        product={quickView}
        onClose={() => setQuickView(null)}
        onAddToCart={handleQuickAdd}
      />
    </Layout>
  )
}
