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
import { useSite, useCms } from '../context/SiteContext'
import GallerySection from '../components/GallerySection'
import { testimonials as fallbackTestimonials } from '../data/products'
import { promoBanners as fallbackPromos } from '../data/homeContent'
import { triggerAddToCartAnimation } from '../hooks/useScrollAnimations'
import { useProducts } from '../hooks/useProducts'
import HeroSection from '../components/HeroSection'
import WhyChooseUs from '../components/WhyChooseUs'
import DiscountOffers from '../components/DiscountOffers'
import SplitCategorySections from '../components/SplitCategorySections'

function mapTestimonial(t) {
  return { id: t.id, name: t.title, text: t.body, rating: t.meta?.rating || 5 }
}

function mapPromo(b) {
  return {
    id: b.id,
    title: b.title,
    subtitle: b.subtitle,
    cta: b.cta || 'Shop Now',
    image: b.image,
    link: b.link || 'shop',
  }
}

export default function Home() {
  const { t } = useLanguage()
  const { addItem } = useCart()
  const { products } = useProducts()
  const { settings } = useSite()
  const cmsTestimonials = useCms('testimonial')
  const cmsPromos = useCms('promo_banner')
  const testimonials = cmsTestimonials.length > 0
    ? cmsTestimonials.map(mapTestimonial)
    : fallbackTestimonials
  const promoBanners = cmsPromos.length > 0
    ? cmsPromos.map(mapPromo)
    : fallbackPromos

  const [quickView, setQuickView] = useState(null)

  const signatureProducts = products.filter((p) => p.category === 'wedding' || p.popular >= 90)
  const topSelling = [...products].sort((a, b) => b.popular - a.popular).slice(0, 6)
  const delightProducts = products.filter((p) => p.category === 'birthday' || p.category === 'seasonal')
  const galleryItems = products.slice(0, 6).map((p) => ({ id: p.id, src: p.image, name: p.name, price: p.price }))

  const handleQuickAdd = (product) => {
    addItem(product)
    triggerAddToCartAnimation(null, document.getElementById('cart-badge'))
  }

  return (
    <Layout title={t('nav.home')} description={settings.hero_subtitle || t('hero.subtitle')} showCategoryNav showOfferPopup fullBleedHero>
      <HeroSection />
      <CategoryShowcase />
      <SpecialOfferCards />
      <SplitCategorySections />
      <HeroBannerCarousel />

      <div className="gold-ribbon" />

      <ProductCarousel
        title={settings.section_signature_title || 'Signature Gateau Cakes'}
        subtitle={settings.section_signature_subtitle || ''}
        products={signatureProducts}
      />

      {promoBanners[0] && <PromoBanner banner={promoBanners[0]} />}

      <ProductCarousel
        title={settings.section_top_selling_title || 'Top-Selling Products'}
        subtitle={settings.section_top_selling_subtitle || ''}
        products={topSelling}
      />

      <ProductCarousel
        title={settings.section_delight_title || 'Cakes of Delight'}
        subtitle={settings.section_delight_subtitle || ''}
        products={delightProducts}
        promoCard={promoBanners[1] ? {
          title: promoBanners[1].title,
          cta: promoBanners[1].cta,
          image: promoBanners[1].image,
          link: promoBanners[1].link || 'shop',
        } : undefined}
      />

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

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <img
            src={settings.home_about_image || 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80'}
            alt=""
            className="slide-image slide-image--left w-full aspect-[4/5] object-cover rounded-2xl"
            loading="lazy"
          />
          <div>
            <h2 className="font-display text-4xl mb-2 fade-up">{settings.about_title || t('about.title')}</h2>
            <p className="text-gold uppercase tracking-widest text-sm mb-6 fade-up">{settings.about_subtitle || t('about.subtitle')}</p>
            <p className="text-muted leading-relaxed mb-8 fade-up">{settings.about_text || t('about.text')}</p>
            <Link to="/about" className="btn-outline fade-up">{t('nav.about')}</Link>
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <DiscountOffers />

      <section className="stats-section py-20 bg-charcoal text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { count: Number(settings.stat_orders) || 5000, suffix: '+', label: t('stats.orders') },
            { count: Number(settings.stat_customers) || 3200, suffix: '+', label: t('stats.customers') },
            { count: Number(settings.stat_years) || 12, suffix: '', label: t('stats.years') },
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

      <section className="py-20 text-center bg-white">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-display text-4xl mb-4 fade-up">{t('custom.title')}</h2>
          <p className="text-muted mb-8 fade-up">{t('custom.subtitle')}</p>
          <Link to="/custom" className="btn-primary fade-up">{t('hero.ctaSecondary')}</Link>
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
