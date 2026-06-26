import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { getSiteSettings, getCmsBlocks, parseJsonSetting } from '../services/contentDb'
import { DEFAULT_SETTINGS } from '../data/defaultSite'

const SiteContext = createContext(null)

export function SiteProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [blocks, setBlocks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [s, b] = await Promise.all([getSiteSettings(), getCmsBlocks()])
        if (!cancelled) {
          setSettings(s)
          setBlocks(b)
        }
      } catch {
        if (!cancelled) {
          setSettings(DEFAULT_SETTINGS)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const blocksByType = useMemo(() => {
    const map = {}
    blocks.forEach((b) => {
      if (!map[b.type]) map[b.type] = []
      map[b.type].push(b)
    })
    Object.keys(map).forEach((k) => {
      map[k].sort((a, b) => a.sort_order - b.sort_order)
    })
    return map
  }, [blocks])

  const heroImages = useMemo(
    () => parseJsonSetting(settings.hero_images, []),
    [settings.hero_images],
  )

  const aboutValues = useMemo(
    () => parseJsonSetting(settings.about_values, []),
    [settings.about_values],
  )

  const value = {
    settings,
    blocks,
    blocksByType,
    heroImages,
    aboutValues,
    loading,
    refresh: async () => {
      const [s, b] = await Promise.all([getSiteSettings(), getCmsBlocks()])
      setSettings(s)
      setBlocks(b)
    },
  }

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export function useSite() {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useSite must be used within SiteProvider')
  return ctx
}

export function useCms(type) {
  const { blocksByType } = useSite()
  return blocksByType[type] || []
}
