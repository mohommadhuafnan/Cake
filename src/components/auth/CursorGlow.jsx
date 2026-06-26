import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CursorGlow() {
  const containerRef = useRef(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 120, damping: 22, mass: 0.4 })
  const y = useSpring(rawY, { stiffness: 120, damping: 22, mass: 0.4 })

  useEffect(() => {
    const onMove = (e) => {
      const el = containerRef.current?.parentElement
      if (!el) return
      const rect = el.getBoundingClientRect()
      rawX.set(e.clientX - rect.left)
      rawY.set(e.clientY - rect.top)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [rawX, rawY])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <motion.div
        className="absolute w-[480px] h-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 mix-blend-soft-light"
        style={{
          x,
          y,
          background: 'radial-gradient(circle, rgba(201,168,76,0.35) 0%, rgba(201,168,76,0.08) 35%, transparent 70%)',
          willChange: 'transform',
        }}
      />
    </div>
  )
}
