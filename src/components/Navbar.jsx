import { useLanguage } from '../context/LanguageContext'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useState } from 'react'
import AnnouncementBar from './AnnouncementBar'

export default function Navbar() {
  const { t } = useLanguage()
  const { itemCount, setIsOpen } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search, setSearch] = useState('')

  const links = [
    { to: '/shop', label: t('nav.shop') },
    { to: '/custom', label: t('nav.custom') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ]

  const isActive = (to) => location.pathname.startsWith(to)

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`)
      setSearch('')
    }
  }

  return (
    <>
      <AnnouncementBar />
      <nav className="navbar glass-nav fixed top-9 left-0 right-0 z-50 px-3 md:px-5 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-2 md:gap-4">
          <Link to="/" className="navbar-logo font-display text-lg md:text-xl font-bold text-charcoal tracking-wide shrink-0">
            {t('brand')}
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm lg:max-w-md mx-2">
            <div className="relative w-full">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('shop.search')}
                className="w-full px-4 py-1.5 pe-9 glass-ios rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-gold/40 transition-all"
              />
              <button type="submit" className="absolute end-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-gold transition-colors" aria-label="Search">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          <div className="hidden lg:flex items-center gap-4 xl:gap-5 shrink-0">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`navbar-link relative text-[11px] uppercase tracking-wider font-medium whitespace-nowrap transition-colors ${
                  isActive(link.to) ? 'nav-link-active text-gold' : 'nav-link text-charcoal/80 hover:text-gold'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-3 ms-auto shrink-0">
            <Link to="/account" className="hidden sm:block text-charcoal/70 hover:text-gold transition-colors p-1" aria-label="Account">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            <button
              onClick={() => setIsOpen(true)}
              className="relative text-charcoal/70 hover:text-gold transition-colors p-1"
              aria-label="Open cart"
              id="cart-icon-btn"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {itemCount > 0 && (
                <span id="cart-badge" className="absolute -top-1 -end-1 w-4 h-4 bg-gold text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                  {itemCount}
                </span>
              )}
            </button>

            <button className="lg:hidden text-charcoal p-1" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu glass-panel fixed inset-y-0 end-0 w-72 z-[60] shadow-2xl p-6 pt-24 ${mobileOpen ? 'open' : ''}`}>
        <button className="absolute top-8 end-5 text-charcoal" onClick={() => setMobileOpen(false)} aria-label="Close menu">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <form onSubmit={(e) => { handleSearch(e); setMobileOpen(false) }} className="mb-5">
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('shop.search')} className="input-field rounded-full text-sm py-2" />
        </form>
        <div className="flex flex-col gap-4">
          <Link to="/" onClick={() => setMobileOpen(false)} className="text-base font-display text-charcoal hover:text-gold transition-colors">{t('nav.home')}</Link>
          {links.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="text-base font-display text-charcoal hover:text-gold transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      {mobileOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[55]" onClick={() => setMobileOpen(false)} />}
    </>
  )
}
