import { supabase, isSupabaseConfigured } from '../lib/supabase'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function compressImage(file, maxWidth = 1200) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width)
        width = maxWidth
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Could not compress image'))
            return
          }
          resolve(new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' }))
        },
        'image/jpeg',
        0.85,
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Invalid image file'))
    }
    img.src = url
  })
}

export async function uploadProductImage(file) {
  if (!file) throw new Error('No file selected')
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Use JPG, PNG, WebP, or GIF')
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Image must be under 5 MB')
  }

  const prepared = file.size > 800_000 ? await compressImage(file) : file

  if (isSupabaseConfigured() && supabase) {
    const ext = prepared.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`
    const { error } = await supabase.storage
      .from('product-images')
      .upload(path, prepared, { cacheControl: '3600', upsert: false })

    if (error) {
      const dataUrl = await readAsDataUrl(prepared)
      return dataUrl
    }

    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    return data.publicUrl
  }

  return readAsDataUrl(prepared)
}

export function isDataUrl(url) {
  return typeof url === 'string' && url.startsWith('data:image/')
}
