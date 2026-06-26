import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import ProductCard from '../components/ProductCard'
import QuickViewModal from '../components/QuickViewModal'
import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import { products, categories } from '../data/products'

export default function Shop() {
  const { lang, t, localized } = useLanguage()
  const { addItem } = useCart()
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'all')
  const [quickView, setQuickView] = useState(null)

  useEffect(() => {
    const q = searchParams.get('search')
    if (q) setSearch(q)
    const cat = searchParams.get('category')
    if (cat) setCategory(cat)
  }, [searchParams])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const name = localized(p.name).toLowerCase()
      const matchSearch = !search || name.includes(search.toLowerCase())
      const matchCat = category === 'all' || p.category === category
      return matchSearch && matchCat
    })
  }, [search, category, localized])

  return (
    <Layout title={t('shop.title')} description={t('shop.subtitle')}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="font-display text-5xl fade-up">{t('shop.title')}</h1>
          <p className="text-muted mt-3 fade-up">{t('shop.subtitle')}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-12 fade-up">
          <input
            type="search"
            placeholder={t('shop.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field flex-1"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field md:w-48"
          >
            <option value="all">{t('shop.all')}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{localized(c.name)}</option>
            ))}
          </select>
        </div>

        <div className="stagger-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onQuickView={setQuickView} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted py-16 fade-up">No products found.</p>
        )}
      </div>

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} onAddToCart={addItem} />
    </Layout>
  )
}
