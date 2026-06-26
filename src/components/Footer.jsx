import { useLanguage } from '../context/LanguageContext'
import { useSite } from '../context/SiteContext'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { api } from '../utils/api'

export default function Footer() {
  const { t } = useLanguage()
  const { settings } = useSite()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) return
    try {
      await api.subscribeNewsletter(email)
    } catch {
      /* fallback for demo */
    }
    setSubscribed(true)
    setEmail('')
  }

  const socials = [
    { id: 'instagram', url: settings.instagram_url, label: 'Instagram' },
    { id: 'facebook', url: settings.facebook_url, label: 'Facebook' },
    { id: 'twitter', url: settings.twitter_url, label: 'Twitter' },
  ].filter((s) => s.url)

  return (
    <footer className="bg-charcoal text-white pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <h3 className="font-display text-2xl mb-4 text-gold">{settings.brand_name || t('brand')}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{settings.tagline || t('tagline')}</p>
          </div>

          <div>
            <h4 className="font-display text-lg mb-4">{t('nav.shop')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/shop" className="hover:text-gold transition-colors">{t('categories.wedding')}</Link></li>
              <li><Link to="/shop" className="hover:text-gold transition-colors">{t('categories.birthday')}</Link></li>
              <li><Link to="/custom" className="hover:text-gold transition-colors">{t('nav.custom')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg mb-4">{t('nav.about')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-gold transition-colors">{t('about.title')}</Link></li>
              <li><Link to="/contact" className="hover:text-gold transition-colors">{t('nav.contact')}</Link></li>
              <li><Link to="/tracking" className="hover:text-gold transition-colors">{t('tracking.title')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg mb-4 fade-up">{t('footer.newsletter')}</h4>
            {subscribed ? (
              <p className="text-gold text-sm fade-up">{t('footer.subscribeSuccess')}</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('footer.emailPlaceholder')}
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gold"
                  required
                />
                <button type="submit" className="px-4 py-2 bg-gold text-charcoal text-sm font-medium hover:bg-gold-light transition-colors">
                  {t('footer.subscribe')}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="gold-ribbon mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} {settings.brand_name || t('brand')}. {t('footer.rights')}</p>
          {socials.length > 0 && (
            <div className="flex gap-4">
              {socials.map((social) => (
                <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors capitalize" aria-label={social.label}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
