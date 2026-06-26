import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

export default function TestimonialsCarousel({ items }) {
  const { t } = useLanguage()
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const trackRef = useRef(null)

  useEffect(() => {
    if (paused) return
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [items.length, paused])

  return (
    <section className="py-24 bg-ivory overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="font-display text-4xl text-center mb-16 fade-up">{t('testimonials.title')}</h2>

        <div
          className="overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            ref={trackRef}
            className="testimonial-track"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {items.map((item) => (
              <div key={item.id} className="min-w-full px-4">
                <div className="glass-card p-10 text-center" style={{ perspective: '1000px' }}>
                  <div className="flex justify-center gap-1 mb-6">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <span key={i} className="text-gold text-xl fade-up" style={{ transitionDelay: `${i * 0.1}s` }}>★</span>
                    ))}
                  </div>
                  <p className="font-display text-xl italic text-charcoal mb-6 leading-relaxed fade-up">
                    &ldquo;{item.text}&rdquo;
                  </p>
                  <p className="text-sm uppercase tracking-widest text-gold fade-up">{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-gold' : 'bg-gray-300'}`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
