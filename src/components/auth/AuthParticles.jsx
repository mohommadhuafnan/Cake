import { useEffect, useRef } from 'react'

const PARTICLE_COUNT = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches ? 24 : 48

export default function AuthParticles() {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    let w = 0
    let h = 0

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.5 + Math.random() * 2,
      vx: (Math.random() - 0.5) * 0.00025,
      vy: (Math.random() - 0.5) * 0.00025,
      opacity: 0.15 + Math.random() * 0.35,
    }))

    const shapes = Array.from({ length: 6 }, (_, i) => ({
      x: 0.1 + (i * 0.15) % 0.8,
      y: 0.2 + (i * 0.17) % 0.6,
      size: 80 + i * 40,
      rotation: i * 45,
      speed: 0.00008 + i * 0.00002,
    }))

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (time) => {
      ctx.clearRect(0, 0, w, h)

      shapes.forEach((shape, i) => {
        const cx = (shape.x + Math.sin(time * shape.speed + i) * 0.05) * w
        const cy = (shape.y + Math.cos(time * shape.speed * 1.3 + i) * 0.04) * h
        const rot = shape.rotation + time * 0.00002 * (i + 1)

        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(rot)
        ctx.strokeStyle = `rgba(201, 168, 76, ${0.06 + i * 0.015})`
        ctx.lineWidth = 1
        ctx.beginPath()
        const s = shape.size
        for (let j = 0; j < 6; j++) {
          const angle = (j / 6) * Math.PI * 2
          const px = Math.cos(angle) * s
          const py = Math.sin(angle) * s
          if (j === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.closePath()
        ctx.stroke()
        ctx.restore()
      })

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > 1) p.vx *= -1
        if (p.y < 0 || p.y > 1) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(232, 213, 163, ${p.opacity})`
        ctx.fill()
      })

      rafRef.current = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    rafRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}
