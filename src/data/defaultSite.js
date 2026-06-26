import {
  announcements,
  showcaseCategories,
  specialOffers,
  heroSlides,
  promoBanners,
} from './homeContent'
import { testimonials } from './products'

export const DEFAULT_SETTINGS = {
  brand_name: 'Maison Douceur',
  tagline: 'Artisan Luxury Cakes',
  phone: '+974 1234 5678',
  email: 'hello@maisondouceur.qa',
  address: 'West Bay, Doha, Qatar',
  whatsapp: '97412345678',
  whatsapp_message: 'Hello! I would like to order a cake from Maison Douceur.',
  map_embed: 'https://maps.google.com/maps?q=Doha+Qatar&output=embed',
  instagram_url: '',
  facebook_url: '',
  twitter_url: '',
  stat_orders: '5000',
  stat_customers: '3200',
  stat_years: '12',
  about_title: 'Our Story',
  about_subtitle: 'Crafted with Love Since 2012',
  about_text:
    'At Maison Douceur, we believe every celebration deserves a masterpiece. Our artisan bakers combine French patisserie techniques with premium ingredients to create cakes that are as beautiful as they are delicious.',
  about_extra:
    'Our master patissiers bring decades of experience from Paris, Milan, and Dubai, combining European techniques with Middle Eastern flavors to create truly unique confections.',
  about_image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80',
  about_values: JSON.stringify([
    { title: 'Quality', desc: 'Only the finest ingredients, sourced ethically from around the world.' },
    { title: 'Craftsmanship', desc: 'Every cake is handcrafted with meticulous attention to detail.' },
    { title: 'Passion', desc: 'We pour our hearts into every creation, making your moments unforgettable.' },
  ]),
  hero_title: 'Artisan Cakes for Every Celebration',
  hero_subtitle: 'Handcrafted luxury cakes made with love in Doha, Qatar',
  hero_images: JSON.stringify([
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1920&q=80',
    'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=1920&q=80',
    'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=1920&q=80',
    'https://images.unsplash.com/photo-1606890737304-57a1aa8aef7e?w=1920&q=80',
  ]),
  home_about_image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80',
  section_signature_title: 'Signature Gateau Cakes',
  section_signature_subtitle: 'Elevate your celebrations with our signature creations, available for order today.',
  section_top_selling_title: 'Top-Selling Products',
  section_top_selling_subtitle: "Our customers' most loved cakes — order yours today.",
  section_delight_title: 'Cakes of Delight',
  section_delight_subtitle: 'Freshly baked delights for every sweet craving.',
}

function cmsRow(type, item, sortOrder, extra = {}) {
  return {
    id: item.id,
    type,
    title: item.title || item.name || '',
    subtitle: item.subtitle || '',
    body: item.text || item.description || '',
    image: item.image || '',
    link: item.link || '',
    cta: item.cta || '',
    tag: item.tag || '',
    sort_order: sortOrder,
    is_active: true,
    meta: extra,
  }
}

export function getDefaultCmsBlocks() {
  const blocks = []

  announcements.forEach((a, i) => {
    blocks.push({
      id: a.id,
      type: 'announcement',
      title: '',
      body: a.text,
      sort_order: i + 1,
      is_active: true,
      meta: {},
    })
  })

  heroSlides.forEach((s, i) => {
    blocks.push(cmsRow('hero_slide', s, i + 1, { product_id: s.productId }))
  })

  showcaseCategories.forEach((c, i) => {
    blocks.push(cmsRow('showcase', c, i + 1, { bg: c.bg }))
  })

  specialOffers.forEach((o, i) => {
    blocks.push(cmsRow('special_offer', o, i + 1, { bg: o.bg }))
  })

  promoBanners.forEach((b, i) => {
    blocks.push(cmsRow('promo_banner', b, i + 1))
  })

  blocks.push({
    id: 101,
    type: 'split_section',
    title: 'Freshly baked and full of love!',
    body: 'Every Maison Douceur cake is handcrafted with premium ingredients — from Belgian chocolate to organic vanilla — baked fresh daily in our Doha kitchen.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
    link: 'shop?category=wedding',
    cta: 'Show More',
    sort_order: 1,
    is_active: true,
    meta: { overlay_title: 'Signature Wedding Cakes', overlay_cta: 'Show Products', reversed: false },
  })
  blocks.push({
    id: 102,
    type: 'split_section',
    title: 'Meetings are about to get sweet!',
    body: 'Impress clients and celebrate teams with our corporate cake collection — elegant designs, custom logos, and flavors everyone will remember.',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80',
    link: 'shop?category=corporate',
    cta: 'Show More',
    sort_order: 2,
    is_active: true,
    meta: { overlay_title: 'Corporate Collection', overlay_cta: 'Show Products', reversed: true },
  })

  testimonials.forEach((t, i) => {
    blocks.push({
      id: t.id,
      type: 'testimonial',
      title: t.name,
      body: t.text,
      sort_order: i + 1,
      is_active: true,
      meta: { rating: t.rating },
    })
  })

  return blocks
}
