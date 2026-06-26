import { useLanguage } from '../context/LanguageContext'

const ICONS = {
  leaf: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
      <path d="M12 3c-4 5-6 9-6 13a6 6 0 0012 0c0-4-2-8-6-13z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 16v-3" strokeLinecap="round" />
    </svg>
  ),
  palette: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
      <path d="M12 2a10 10 0 100 20h1.5a2.5 2.5 0 000-5H17a2 2 0 01-2-2v-.5a6 6 0 00-6-6z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7.5" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="9.5" cy="7" r="1" fill="currentColor" stroke="none" />
      <circle cx="14" cy="7.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  truck: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
      <path d="M3 7h11v8H3V7z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 10h4l3 3v2h-7v-5z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
      <path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
}

const FEATURES = [
  { key: 'fresh', icon: 'leaf', bg: 'bg-[#F5E6E8]' },
  { key: 'custom', icon: 'palette', bg: 'bg-[#EDE4CC]' },
  { key: 'delivery', icon: 'truck', bg: 'bg-[#F5E6E8]' },
  { key: 'quality', icon: 'shield', bg: 'bg-[#F5E6E8]' },
]

export default function WhyChooseUs() {
  const { t } = useLanguage()

  return (
    <section className="py-16 md:py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="font-display text-3xl md:text-4xl text-charcoal text-center mb-10 md:mb-14 fade-up">
          {t('whyChooseUs.title')}
        </h2>

        <div className="stagger-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {FEATURES.map(({ key, icon, bg }) => (
            <article
              key={key}
              className="stagger-card bg-white rounded-2xl px-6 py-8 md:py-10 text-center shadow-[0_4px_24px_rgba(26,26,26,0.06)] hover:shadow-[0_8px_32px_rgba(26,26,26,0.1)] hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className={`w-[72px] h-[72px] md:w-[80px] md:h-[80px] rounded-full ${bg} flex items-center justify-center mx-auto mb-5 md:mb-6 text-gold`}
              >
                {ICONS[icon]}
              </div>
              <h3 className="font-display text-lg md:text-xl text-charcoal mb-2 leading-snug">
                {t(`whyChooseUs.${key}.title`)}
              </h3>
              <p className="text-muted text-sm leading-relaxed max-w-[220px] mx-auto">
                {t(`whyChooseUs.${key}.subtitle`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
