import { useRef, useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import CompactProductCard from './CompactProductCard'

const CONTAINER_PAD = 'max(1.5rem, calc((100vw - 80rem) / 2 + 1.5rem))'
const GAP_PX = { base: 20, md: 24 }

function PromoSideCard({ promo }) {
  return (
    <div className="carousel-card-slot flex-shrink-0">
      <Link
        to={`/${promo.link || 'shop'}`}
        className="promo-side-card block h-[440px] w-[252px] md:w-[280px] rounded-2xl overflow-hidden relative group border border-gray-100/80 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
      >
        <img
          src={promo.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/40 to-charcoal/20 group-hover:from-charcoal/90 transition-colors duration-500" />
        <div className="relative z-10 h-full flex flex-col justify-end p-6">
          <h3 className="font-display text-xl text-white mb-2 group-hover:text-gold transition-colors leading-snug">
            {promo.title}
          </h3>
          <span className="text-sm font-medium text-gold">{promo.cta} →</span>
        </div>
      </Link>
    </div>
  )
}

function CarouselItem({ item }) {
  if (item.type === 'promo') {
    return <PromoSideCard promo={item.data} />
  }
  return <CompactProductCard product={item.data} />
}

function MarqueeSet({ items, setRef, clone }) {
  return (
    <div
      ref={setRef}
      className={`marquee-set flex items-stretch gap-5 md:gap-6 flex-shrink-0${clone ? ' marquee-set--clone' : ''}`}
      aria-hidden={clone || undefined}
    >
      {items.map((item, i) => (
        <CarouselItem key={`${item.type}-${item.data.id ?? 'promo'}-${i}`} item={item} />
      ))}
    </div>
  )
}

export default function ProductCarousel({ title, subtitle, products, viewAllLink = 'shop', promoCard }) {
  const { t } = useLanguage()
  const setRef = useRef(null)
  const [loopPx, setLoopPx] = useState(0)
  const [duration, setDuration] = useState(28)

  const trackItems = [
    ...(promoCard ? [{ type: 'promo', data: promoCard }] : []),
    ...products.map((p) => ({ type: 'product', data: p })),
  ]

  const measure = useCallback(() => {
    const el = setRef.current
    if (!el) return
    const setWidth = el.getBoundingClientRect().width
    const gap = window.matchMedia('(min-width: 768px)').matches ? GAP_PX.md : GAP_PX.base
    const distance = setWidth + gap
    setLoopPx(distance)
    setDuration(Math.max(20, Math.min(45, distance / 55)))
  }, [])

  useEffect(() => {
    measure()
    const el = setRef.current
    if (!el) return undefined
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    el.querySelectorAll('img').forEach((img) => {
      if (!img.complete) img.addEventListener('load', measure, { once: true })
    })
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure, products, promoCard])

  const trackStyle = loopPx
    ? {
        '--marquee-distance': `${loopPx}px`,
        '--marquee-duration': `${duration}s`,
      }
    : undefined

  return (
    <section className="py-16 md:py-20 bg-white overflow-hidden">
      <div className="mb-10 md:mb-12 fade-up" style={{ paddingInline: CONTAINER_PAD }}>
        <div className="max-w-xl">
          <h2 className="font-display text-3xl md:text-4xl text-charcoal leading-tight">{title}</h2>
          {subtitle && (
            <p className="text-muted text-sm md:text-base mt-3 leading-relaxed">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="carousel-viewport overflow-hidden" style={{ paddingInline: CONTAINER_PAD }}>
        <div
          className={`marquee-track flex items-stretch gap-5 md:gap-6 w-max${loopPx ? ' marquee-track--ready' : ''}`}
          style={trackStyle}
        >
          <MarqueeSet items={trackItems} setRef={setRef} />
          <MarqueeSet items={trackItems} clone />
        </div>
      </div>

      <div className="mt-10 md:mt-12 text-center fade-up" style={{ paddingInline: CONTAINER_PAD }}>
        <Link
          to={`/${viewAllLink}`}
          className="inline-flex items-center gap-2 px-10 py-3.5 bg-charcoal text-white text-xs font-medium uppercase tracking-widest hover:bg-gold hover:text-charcoal transition-all duration-300"
        >
          {t('common.viewAll')} →
        </Link>
      </div>
    </section>
  )
}
