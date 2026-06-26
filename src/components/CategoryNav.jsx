import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useCategories } from '../hooks/useCategories'
import { useProducts } from '../hooks/useProducts'

export default function CategoryNav() {
  const { t } = useLanguage()
  const { categories } = useCategories()
  const { products } = useProducts()
  const location = useLocation()

  const params = new URLSearchParams(location.search)
  const activeCat = params.get('category') || (location.pathname === '/shop' ? 'all' : '')

  const countFor = (slug) => products.filter((p) => p.category === slug).length

  const items = [
    { id: 'all', label: t('shop.all'), to: '/shop' },
    ...categories.map((c) => ({
      id: c.id,
      label: c.name,
      to: `/shop?category=${c.id}`,
      count: countFor(c.id),
    })),
    { id: 'custom', label: t('nav.custom'), to: '/custom' },
  ]

  return (
    <div className="category-nav glass-nav border-t border-white/30 overflow-x-auto">
      <div className="max-w-7xl mx-auto px-3 md:px-5 flex items-center gap-0 min-w-max md:min-w-0 md:justify-center">
        {items.map((cat) => {
          const isActive = cat.id === activeCat || (cat.id === 'all' && location.pathname === '/shop' && !params.get('category'))

          return (
            <Link
              key={cat.id}
              to={cat.to}
              className={`category-nav-link px-3 md:px-5 py-2 text-[11px] md:text-xs font-medium whitespace-nowrap transition-colors relative group ${
                isActive ? 'text-gold' : 'text-charcoal/75 hover:text-gold'
              }`}
            >
              {cat.label}
              {cat.count != null && <span className="text-muted ms-1">({cat.count})</span>}
              <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-gold transition-all duration-300 ${isActive ? 'w-2/3' : 'w-0 group-hover:w-2/3'}`} />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
