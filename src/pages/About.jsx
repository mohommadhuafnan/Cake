import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { useLanguage } from '../context/LanguageContext'
import { useSite } from '../context/SiteContext'

export default function About() {
  const { t } = useLanguage()
  const { settings, aboutValues } = useSite()

  const values = aboutValues.length > 0 ? aboutValues : [
    { title: 'Quality', desc: 'Only the finest ingredients, sourced ethically from around the world.' },
    { title: 'Craftsmanship', desc: 'Every cake is handcrafted with meticulous attention to detail.' },
    { title: 'Passion', desc: 'We pour our hearts into every creation, making your moments unforgettable.' },
  ]

  return (
    <Layout title={settings.about_title || t('about.title')} description={settings.about_text || t('about.text')}>
      <section className="relative py-32 bg-ivory">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-display text-5xl md:text-6xl mb-4 hero-headline">{settings.about_title || t('about.title')}</h1>
          <p className="text-gold uppercase tracking-widest hero-subtext">{settings.about_subtitle || t('about.subtitle')}</p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <img
            src={settings.about_image || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80'}
            alt=""
            className="slide-image slide-image--left w-full aspect-[4/3] object-cover"
            loading="lazy"
          />
          <div>
            <p className="text-muted leading-relaxed text-lg mb-6 fade-up">{settings.about_text || t('about.text')}</p>
            {settings.about_extra && (
              <p className="text-muted leading-relaxed fade-up">{settings.about_extra}</p>
            )}
          </div>
        </div>
      </section>

      <section className="py-24 bg-charcoal text-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display text-4xl text-center mb-16 fade-up">Our Values</h2>
          <div className="stagger-grid grid md:grid-cols-3 gap-12 text-center">
            {values.map((v) => (
              <div key={v.title} className="stagger-card">
                <h3 className="font-display text-2xl text-gold mb-3">{v.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 text-center">
        <Link to="/shop" className="btn-primary fade-up">{t('hero.cta')}</Link>
      </section>
    </Layout>
  )
}
