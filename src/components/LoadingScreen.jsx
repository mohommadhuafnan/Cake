import { useEffect } from 'react'

export default function LoadingScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1800)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-[100] bg-ivory flex items-center justify-center">
      <div className="text-center loading-logo">
        <h1 className="font-display text-4xl md:text-5xl text-charcoal mb-2">Maison Douceur</h1>
        <div className="gold-ribbon w-32 mx-auto mb-4" />
        <p className="text-muted text-sm tracking-widest uppercase">Artisan Luxury Cakes</p>
      </div>
    </div>
  )
}
