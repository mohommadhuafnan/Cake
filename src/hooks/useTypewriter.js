import { useState, useEffect } from 'react'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useTypewriter(text, speed = 55, startDelay = 400) {
  const [display, setDisplay] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplay('')
    setDone(false)

    if (prefersReducedMotion()) {
      setDisplay(text)
      setDone(true)
      return
    }

    let index = 0
    let intervalId

    const startTimer = setTimeout(() => {
      intervalId = setInterval(() => {
        index += 1
        setDisplay(text.slice(0, index))
        if (index >= text.length) {
          clearInterval(intervalId)
          setDone(true)
        }
      }, speed)
    }, startDelay)

    return () => {
      clearTimeout(startTimer)
      clearInterval(intervalId)
    }
  }, [text, speed, startDelay])

  return { display, done }
}
