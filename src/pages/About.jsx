import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { useLanguage } from '../context/LanguageContext'

export default function About() {
  const { lang, t } = useLanguage()

  return (
    <Layout title={t('about.title')} description={t('about.text')}>
      <section className="relative py-32 bg-ivory">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-display text-5xl md:text-6xl mb-4 hero-headline">{t('about.title')}</h1>
          <p className="text-gold uppercase tracking-widest hero-subtext">{t('about.subtitle')}</p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80" alt="" className="slide-image slide-image--left w-full aspect-[4/3] object-cover" loading="lazy" />
          <div>
            <p className="text-muted leading-relaxed text-lg mb-6 fade-up">{t('about.text')}</p>
            <p className="text-muted leading-relaxed fade-up">
              Our master patissiers bring decades of experience from Paris, Milan, and Dubai, combining European techniques with Middle Eastern flavors to create truly unique confections.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-charcoal text-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display text-4xl text-center mb-16 fade-up">Our Values</h2>
          <div className="stagger-grid grid md:grid-cols-3 gap-12 text-center">
            {[
              { title: 'Quality', desc: 'Only the finest ingredients, sourced ethically from around the world.' },
              { title: 'Craftsmanship', desc: 'Every cake is handcrafted with meticulous attention to detail.' },
              { title: 'Passion', desc: 'We pour our hearts into every creation, making your moments unforgettable.' },
            ].map((v) => (
              <div key={v.title} className="stagger-card">
                <h3 className="font-display text-2xl text-gold mb-3">{v.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 text-center">
        <Link to={`/shop`} className="btn-primary fade-up">{t('hero.cta')}</Link>
      </section>
    </Layout>
  )
}
