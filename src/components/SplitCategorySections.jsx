import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCms } from '../context/SiteContext'

const FALLBACK = [
  {
    id: 1,
    title: 'Freshly baked and full of love!',
    body: 'Every Maison Douceur wedding cake is handcrafted with premium ingredients — baked fresh daily in our Doha kitchen.',
    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&q=80',
    link: 'shop?category=wedding',
    cta: 'Show More',
    overlayTitle: 'Wedding Collection',
    overlayCta: 'Show Products',
    reversed: false,
  },
  {
    id: 2,
    title: 'Birthdays made unforgettable!',
    body: 'From kids\' rainbow cakes to elegant adult celebrations — find the perfect birthday centrepiece.',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80',
    link: 'shop?category=birthday',
    cta: 'Show More',
    overlayTitle: 'Birthday Collection',
    overlayCta: 'Show Products',
    reversed: true,
  },
  {
    id: 3,
    title: 'Meetings are about to get sweet!',
    body: 'Impress clients with our corporate collection — elegant designs, custom logos, and unforgettable flavors.',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80',
    link: 'shop?category=corporate',
    cta: 'Show More',
    overlayTitle: 'Corporate Collection',
    overlayCta: 'Show Products',
    reversed: false,
  },
  {
    id: 4,
    title: 'Seasonal flavours, limited time!',
    body: 'Ramadan, Eid, and holiday specials crafted with traditional ingredients and modern flair.',
    image: 'https://images.unsplash.com/photo-1625866448531-1b00c0251f76?w=800&q=80',
    link: 'shop?category=seasonal',
    cta: 'Show More',
    overlayTitle: 'Seasonal Collection',
    overlayCta: 'Show Products',
    reversed: true,
  },
]

function mapSection(s, index) {
  return {
    id: s.id,
    title: s.title,
    body: s.body || s.subtitle,
    image: s.image,
    link: s.link || 'shop',
    cta: s.cta || 'Show More',
    overlayTitle: s.meta?.overlay_title || s.title,
    overlayCta: s.meta?.overlay_cta || 'Show Products',
    reversed: s.meta?.reversed ?? index % 2 === 1,
  }
}

export default function SplitCategorySections() {
  const cmsItems = useCms('split_section')
  const sections = cmsItems.length > 0
    ? cmsItems.map((s, i) => mapSection(s, i))
    : FALLBACK

  return (
    <section className="bg-white overflow-hidden">
      {sections.map((item, index) => (
        <div
          key={item.id}
          className={`max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20 ${index > 0 ? 'border-t border-gray-100' : ''}`}
        >
          <div className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${item.reversed ? 'lg:[direction:rtl]' : ''}`}>
            {/* Image column */}
            <motion.div
              initial={{ opacity: 0, x: item.reversed ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative lg:[direction:ltr]"
            >
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] md:aspect-[5/4] bg-ivory shadow-lg">
                <img
                  src={item.image}
                  alt={item.overlayTitle}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Floating product card — like reference */}
              <div className="absolute -top-4 end-0 md:top-6 md:-end-4 lg:end-4 z-10 bg-white rounded-2xl shadow-xl p-4 md:p-5 min-w-[160px] max-w-[200px] border border-gray-100">
                <p className="font-display text-sm md:text-base text-charcoal mb-3 leading-snug">
                  {item.overlayTitle}
                </p>
                <Link
                  to={`/${item.link}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blush hover:bg-gold text-white text-xs font-semibold rounded-full transition-colors duration-300 shadow-sm"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {item.overlayCta}
                </Link>
              </div>
            </motion.div>

            {/* Text column */}
            <motion.div
              initial={{ opacity: 0, x: item.reversed ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
              className="lg:[direction:ltr] px-2 md:px-0"
            >
              <h2 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] text-charcoal leading-tight mb-5">
                {item.title}
              </h2>
              <p className="text-muted text-base md:text-lg leading-relaxed mb-8 max-w-lg">
                {item.body}
              </p>
              <Link
                to={`/${item.link}`}
                className="inline-flex items-center px-8 py-3.5 bg-charcoal text-white text-sm font-medium rounded-full hover:bg-gold hover:text-charcoal transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                {item.cta}
              </Link>
            </motion.div>
          </div>
        </div>
      ))}
    </section>
  )
}
