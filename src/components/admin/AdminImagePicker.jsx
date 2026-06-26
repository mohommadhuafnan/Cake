import { useState } from 'react'
import { uploadProductImage } from '../../services/imageUpload'

export default function AdminImagePicker({ value, onChange, onUploading }) {
  const [mode, setMode] = useState('upload')
  const [uploadError, setUploadError] = useState('')
  const [dragOver, setDragOver] = useState(false)

  const handleFile = async (file) => {
    if (!file) return
    setUploadError('')
    onUploading?.(true)
    try {
      const url = await uploadProductImage(file)
      onChange(url)
      setMode('url')
    } catch (e) {
      setUploadError(e.message)
    } finally {
      onUploading?.(false)
    }
  }

  const onFileInput = (e) => handleFile(e.target.files?.[0])

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`text-xs px-3 py-1.5 rounded border ${mode === 'upload' ? 'bg-gold text-charcoal border-gold' : 'border-gray-200 text-muted'}`}
        >
          Upload from device
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`text-xs px-3 py-1.5 rounded border ${mode === 'url' ? 'bg-gold text-charcoal border-gold' : 'border-gray-200 text-muted'}`}
        >
          Image URL
        </button>
      </div>

      {mode === 'upload' ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver ? 'border-gold bg-gold/5' : 'border-gray-200 hover:border-gold/50'
          }`}
        >
          <div className="text-3xl mb-2">📷</div>
          <p className="text-sm text-charcoal mb-1">Drag & drop a cake photo here</p>
          <p className="text-xs text-muted mb-4">JPG, PNG, WebP — max 5 MB</p>
          <label className="btn-primary text-xs inline-block cursor-pointer">
            Choose file
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={onFileInput} />
          </label>
        </div>
      ) : (
        <div>
          <label className="block text-xs uppercase tracking-wider text-muted mb-1">Image URL</label>
          <input
            type="url"
            value={value?.startsWith('data:') ? '' : (value || '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full border border-gray-200 px-3 py-2 text-sm rounded focus:border-gold outline-none"
          />
          {value?.startsWith('data:') && (
            <p className="text-xs text-muted mt-1">Uploaded image saved locally. Paste a URL to replace it.</p>
          )}
        </div>
      )}

      {uploadError && <p className="text-red-500 text-xs">{uploadError}</p>}

      {value && (
        <div className="flex items-start gap-4">
          <img src={value} alt="Preview" className="w-28 h-28 object-cover rounded border" />
          <button type="button" onClick={() => onChange('')} className="text-xs text-red-400 hover:underline mt-1">
            Remove image
          </button>
        </div>
      )}
    </div>
  )
}
