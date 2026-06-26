import { useMemo, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'

const SORT_OPTIONS = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'popular', label: 'Best Selling' },
]

export default function ShopFilters({
  categories,
  products,
  selectedCategories,
  onCategoriesChange,
  sort,
  onSortChange,
  priceRange,
  onPriceRangeChange,
  priceBounds,
  mobileOpen,
  onMobileClose,
}) {
  const { t } = useLanguage()
  const [categoryOpen, setCategoryOpen] = useState(true)
  const [priceOpen, setPriceOpen] = useState(true)
  const [sortOpen, setSortOpen] = useState(true)

  const counts = useMemo(() => {
    const map = {}
    products.forEach((p) => {
      map[p.category] = (map[p.category] || 0) + 1
    })
    return map
  }, [products])

  const toggleCategory = (slug) => {
    if (slug === 'all') {
      onCategoriesChange([])
      return
    }
    if (selectedCategories.includes(slug)) {
      onCategoriesChange(selectedCategories.filter((c) => c !== slug))
    } else {
      onCategoriesChange([...selectedCategories, slug])
    }
  }

  const panel = (
    <div className="space-y-1">
      {/* Sort */}
      <div className="border-b border-gray-100 pb-4 mb-4">
        <button
          type="button"
          onClick={() => setSortOpen(!sortOpen)}
          className="flex items-center justify-between w-full py-2 text-sm font-semibold text-charcoal"
        >
          Sort By
          <Chevron open={sortOpen} />
        </button>
        {sortOpen && (
          <div className="mt-2 space-y-2">
            {SORT_OPTIONS.map((opt) => (
              <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${sort === opt.id ? 'border-gold' : 'border-gray-300 group-hover:border-gold/60'}`}>
                  {sort === opt.id && <span className="w-2 h-2 rounded-full bg-gold" />}
                </span>
                <input type="radio" name="sort" value={opt.id} checked={sort === opt.id} onChange={() => onSortChange(opt.id)} className="sr-only" />
                <span className={`text-sm ${sort === opt.id ? 'text-charcoal font-medium' : 'text-muted'}`}>{opt.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Category */}
      <div className="border-b border-gray-100 pb-4 mb-4">
        <button
          type="button"
          onClick={() => setCategoryOpen(!categoryOpen)}
          className="flex items-center justify-between w-full py-2 text-sm font-semibold text-charcoal"
        >
          {t('shop.filter')}
          <Chevron open={categoryOpen} />
        </button>
        {categoryOpen && (
          <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
            <label className="flex items-center justify-between cursor-pointer group py-1">
              <span className="flex items-center gap-3">
                <Checkbox checked={selectedCategories.length === 0} onChange={() => onCategoriesChange([])} />
                <span className={`text-sm ${selectedCategories.length === 0 ? 'font-medium text-charcoal' : 'text-muted'}`}>{t('shop.all')}</span>
              </span>
              <span className="text-xs text-muted">({products.length})</span>
            </label>
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center justify-between cursor-pointer group py-1">
                <span className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                  />
                  <span className={`text-sm ${selectedCategories.includes(cat.id) ? 'font-medium text-charcoal' : 'text-muted'}`}>{cat.name}</span>
                </span>
                <span className="text-xs text-muted">({counts[cat.id] || 0})</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price */}
      <div>
        <button
          type="button"
          onClick={() => setPriceOpen(!priceOpen)}
          className="flex items-center justify-between w-full py-2 text-sm font-semibold text-charcoal"
        >
          Price
          <Chevron open={priceOpen} />
        </button>
        {priceOpen && priceBounds.max > priceBounds.min && (
          <div className="mt-4 px-1">
            <div className="flex justify-between text-xs text-muted mb-3">
              <span>QAR {priceRange[0]}</span>
              <span>QAR {priceRange[1]}</span>
            </div>
            <div className="relative h-6 flex items-center">
              <input
                type="range"
                min={priceBounds.min}
                max={priceBounds.max}
                value={priceRange[0]}
                onChange={(e) => onPriceRangeChange([Math.min(Number(e.target.value), priceRange[1] - 1), priceRange[1]])}
                className="shop-range absolute w-full pointer-events-none appearance-none bg-transparent z-10"
              />
              <input
                type="range"
                min={priceBounds.min}
                max={priceBounds.max}
                value={priceRange[1]}
                onChange={(e) => onPriceRangeChange([priceRange[0], Math.max(Number(e.target.value), priceRange[0] + 1)])}
                className="shop-range absolute w-full pointer-events-none appearance-none bg-transparent z-20"
              />
              <div className="absolute w-full h-1 bg-gray-200 rounded-full">
                <div
                  className="absolute h-1 bg-gold rounded-full"
                  style={{
                    left: `${((priceRange[0] - priceBounds.min) / (priceBounds.max - priceBounds.min)) * 100}%`,
                    right: `${100 - ((priceRange[1] - priceBounds.min) / (priceBounds.max - priceBounds.min)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-28 pr-6">{panel}</div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-50 lg:hidden" onClick={onMobileClose} />
          <div className="fixed inset-y-0 start-0 w-80 max-w-[85vw] bg-white z-50 shadow-xl p-6 overflow-y-auto lg:hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg">Filters</h3>
              <button type="button" onClick={onMobileClose} className="text-muted hover:text-charcoal p-1" aria-label="Close filters">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {panel}
            <button type="button" onClick={onMobileClose} className="btn-primary w-full text-xs mt-8">Show Results</button>
          </div>
        </>
      )}
    </>
  )
}

function Chevron({ open }) {
  return (
    <svg className={`w-4 h-4 text-muted transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function Checkbox({ checked, onChange }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center shrink-0 transition-colors ${checked ? 'bg-gold border-gold' : 'border-gray-300 hover:border-gold/60'}`}
    >
      {checked && (
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  )
}
