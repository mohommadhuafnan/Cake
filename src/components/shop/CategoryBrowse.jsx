import { Link } from 'react-router-dom'
import { useCategories } from '../../hooks/useCategories'
import { useProducts } from '../../hooks/useProducts'

const FALLBACK_IMAGES = {
  wedding: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=400&q=80',
  birthday: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&q=80',
  corporate: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&q=80',
  seasonal: 'https://images.unsplash.com/photo-1625866448531-1b00c0251f76?w=400&q=80',
}

export default function CategoryBrowse({ activeCategory = 'all' }) {
  const { categories } = useCategories()
  const { products } = useProducts()

  const countFor = (slug) => products.filter((p) => p.category === slug).length

  const items = [
    { id: 'all', name: 'All Cakes', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80', count: products.length },
    ...categories.map((c) => ({
      id: c.id,
      name: c.name,
      image: c.image || FALLBACK_IMAGES[c.id] || FALLBACK_IMAGES.birthday,
      count: countFor(c.id),
    })),
    { id: 'custom', name: 'Custom Order', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&q=80', count: null, link: '/custom' },
  ]

  return (
    <section className="border-b border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {items.map((cat) => {
            const isActive = activeCategory === cat.id || (activeCategory === 'all' && cat.id === 'all')
            const to = cat.link || (cat.id === 'all' ? '/shop' : `/shop?category=${cat.id}`)

            return (
              <Link
                key={cat.id}
                to={to}
                className={`flex-shrink-0 snap-start group w-[100px] md:w-[120px] text-center transition-transform hover:-translate-y-1 ${isActive ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
              >
                <div className={`relative w-[100px] h-[100px] md:w-[120px] md:h-[120px] mx-auto rounded-2xl overflow-hidden ring-2 transition-all ${isActive ? 'ring-gold shadow-md' : 'ring-transparent group-hover:ring-gold/40'}`}>
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  {isActive && <div className="absolute inset-0 ring-2 ring-inset ring-gold rounded-2xl pointer-events-none" />}
                </div>
                <p className={`mt-2 text-xs md:text-sm font-medium leading-tight ${isActive ? 'text-gold' : 'text-charcoal group-hover:text-gold'}`}>
                  {cat.name}
                </p>
                {cat.count != null && (
                  <p className="text-[10px] text-muted mt-0.5">({cat.count})</p>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
