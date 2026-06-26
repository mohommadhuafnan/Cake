import { useState, useMemo, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import { useLanguage } from '../context/LanguageContext'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import DiscountOffers from '../components/DiscountOffers'
import CategoryBrowse from '../components/shop/CategoryBrowse'
import ShopFilters from '../components/shop/ShopFilters'
import ShopProductCard from '../components/shop/ShopProductCard'

function sortProducts(list, sort) {
  const copy = [...list]
  switch (sort) {
    case 'price-asc':
      return copy.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return copy.sort((a, b) => b.price - a.price)
    case 'popular':
      return copy.sort((a, b) => (b.popular || 0) - (a.popular || 0))
    default:
      return copy
  }
}

export default function Shop() {
  const { t } = useLanguage()
  const { products, loading } = useProducts()
  const { categories } = useCategories()
  const [searchParams, setSearchParams] = useSearchParams()
  const [mobileFilters, setMobileFilters] = useState(false)

  const search = searchParams.get('search') || ''
  const categoryParam = searchParams.get('category') || ''
  const sort = searchParams.get('sort') || 'relevance'

  const selectedCategories = useMemo(() => {
    if (!categoryParam || categoryParam === 'all') return []
    return categoryParam.split(',').filter(Boolean)
  }, [categoryParam])

  const priceBounds = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 1000 }
    const prices = products.map((p) => p.price)
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) }
  }, [products])

  const [priceRange, setPriceRange] = useState([priceBounds.min, priceBounds.max])

  useEffect(() => {
    setPriceRange([priceBounds.min, priceBounds.max])
  }, [priceBounds.min, priceBounds.max])

  const updateParams = useCallback((updates) => {
    const next = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') next.delete(key)
      else next.set(key, value)
    })
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
      const matchCat = selectedCategories.length === 0 || selectedCategories.includes(p.category)
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1]
      return matchSearch && matchCat && matchPrice
    })
    return sortProducts(list, sort)
  }, [products, search, selectedCategories, priceRange, sort])

  const activeCategory = selectedCategories.length === 1 ? selectedCategories[0] : 'all'
  const activeCategoryName = selectedCategories.length === 1
    ? categories.find((c) => c.id === selectedCategories[0])?.name
    : null

  const handleCategoriesChange = (cats) => {
    updateParams({ category: cats.length ? cats.join(',') : null })
  }

  return (
    <Layout title={t('shop.title')} description={t('shop.subtitle')} showCategoryNav>
      <DiscountOffers />

      <CategoryBrowse activeCategory={activeCategory} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Breadcrumbs + header */}
        <nav className="text-xs text-muted mb-2">
          <Link to="/" className="hover:text-gold transition-colors">{t('nav.home')}</Link>
          <span className="mx-2">›</span>
          <Link to="/shop" className="hover:text-gold transition-colors">{t('nav.shop')}</Link>
          {activeCategoryName && (
            <>
              <span className="mx-2">›</span>
              <span className="text-charcoal">{activeCategoryName}</span>
            </>
          )}
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="font-display text-2xl md:text-3xl text-charcoal">
            {activeCategoryName || t('shop.allItems')}
            <span className="text-muted font-normal text-lg ms-2">• {filtered.length}</span>
          </h1>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="search"
              placeholder={t('shop.search')}
              defaultValue={search}
              onKeyDown={(e) => {
                if (e.key === 'Enter') updateParams({ search: e.target.value.trim() || null })
              }}
              className="input-field flex-1 sm:w-56 text-sm py-2 rounded-full"
            />
            <button
              type="button"
              onClick={() => setMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm text-charcoal hover:border-gold transition-colors shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {t('shop.filters')}
            </button>
          </div>
        </div>

        <div className="flex gap-8 items-start">
          <ShopFilters
            categories={categories}
            products={products}
            selectedCategories={selectedCategories}
            onCategoriesChange={handleCategoriesChange}
            sort={sort}
            onSortChange={(s) => updateParams({ sort: s === 'relevance' ? null : s })}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            priceBounds={priceBounds}
            mobileOpen={mobileFilters}
            onMobileClose={() => setMobileFilters(false)}
          />

          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 bg-ivory rounded-2xl">
                <p className="text-muted mb-4">{t('shop.noResults')}</p>
                <Link to="/shop" className="btn-outline text-xs">{t('shop.clearFilters')}</Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filtered.map((p) => (
                  <ShopProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
