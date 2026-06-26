import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const OBSERVER_THRESHOLD = 0.15

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useScrollAnimations() {
  const location = useLocation()

  useEffect(() => {
    if (prefersReducedMotion()) return

    const progressBar = document.querySelector('.scroll-progress-bar')
    const navbar = document.querySelector('.navbar')
    const parallaxBg = document.querySelector('.parallax-bg')

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0

      if (progressBar) {
        progressBar.style.width = `${progress}%`
      }

      if (navbar) {
        navbar.classList.toggle('navbar--shrunk', scrollTop > 50)
      }

      if (parallaxBg) {
        parallaxBg.style.transform = `translateY(${scrollTop * 0.3}px)`
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: OBSERVER_THRESHOLD }
    )

    document.querySelectorAll('.fade-up, .slide-image, .progress-bar-fill').forEach((el) => {
      observer.observe(el)
    })

    const staggerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.stagger-card')
            cards.forEach((card, index) => {
              setTimeout(() => card.classList.add('visible'), index * 120)
            })
            staggerObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: OBSERVER_THRESHOLD }
    )

    document.querySelectorAll('.stagger-grid').forEach((grid) => {
      staggerObserver.observe(grid)
    })

    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('[data-count]').forEach((el) => {
              animateCount(el)
            })
            countObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: OBSERVER_THRESHOLD }
    )

    document.querySelectorAll('.stats-section').forEach((section) => {
      countObserver.observe(section)
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
      staggerObserver.disconnect()
      countObserver.disconnect()
    }
  }, [location.pathname])
}

function animateCount(el) {
  const target = parseInt(el.dataset.count, 10)
  const suffix = el.dataset.suffix || ''
  const duration = 2000
  const start = performance.now()

  function step(now) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    const current = Math.floor(eased * target)
    el.textContent = current.toLocaleString() + suffix
    if (progress < 1) requestAnimationFrame(step)
    else el.textContent = target.toLocaleString() + suffix
  }

  requestAnimationFrame(step)
}

export function triggerAddToCartAnimation(buttonEl, badgeEl) {
  if (prefersReducedMotion()) return
  buttonEl?.classList.add('add-to-cart-pop')
  badgeEl?.classList.add('cart-badge-pop')
  setTimeout(() => {
    buttonEl?.classList.remove('add-to-cart-pop')
    badgeEl?.classList.remove('cart-badge-pop')
  }, 400)
}
