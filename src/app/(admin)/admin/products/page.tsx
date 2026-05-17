'use client'

// ទំព័រគ្រប់គ្រងផលិតផល Admin - Real Version
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'

interface Category {
  id: string
  slug: string
  nameKm: string
  nameEn: string
}

interface Product {
  id: string
  nameKm: string
  nameEn: string
  descriptionKm?: string
  descriptionEn?: string
  price: number
  originalPrice?: number | null
  image?: string | null
  categoryId: string
  category?: Category | null
  stockStatus: string
  isFeatured: boolean
  isActive: boolean
}

const emptyForm = {
  nameKm: '', nameEn: '', descriptionKm: '', descriptionEn: '',
  price: '', originalPrice: '', categoryId: '', stockStatus: 'IN_STOCK',
  isFeatured: false, image: '',
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [showCatForm, setShowCatForm] = useState(false)
  const [catForm, setCatForm] = useState({ nameKm: '', nameEn: '' })

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products?all=true')
      const data = await res.json()
      setProducts(data.products || [])
    } catch { setProducts([]) }
    finally { setLoading(false) }
  }, [])

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/categories')
      const data = await res.json()
      setCategories(data.categories || [])
    } catch { setCategories([]) }
  }, [])

  useEffect(() => { fetchProducts(); fetchCategories() }, [fetchProducts, fetchCategories])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError(null)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) {
        setUploadError(data.error || 'Upload failed')
        return
      }
      if (data.url) {
        setForm((f) => ({ ...f, image: data.url }))
        setImagePreview(data.url)
      }
    } catch {
      setUploadError('Network error - could not upload image')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSave = async () => {
    if (!form.nameKm || !form.nameEn || !form.price || !form.categoryId) {
      setSaveError('Please fill in all required fields (Name KM, Name EN, Price, Category)')
      return
    }
    setSaving(true)
    setSaveError(null)
    try {
      const method = editingId ? 'PUT' : 'POST'
      const body = editingId ? { id: editingId, ...form } : form
      const res = await fetch('/api/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        setShowForm(false)
        setEditingId(null)
        setForm(emptyForm)
        setImagePreview(null)
        setUploadError(null)
        fetchProducts()
      } else {
        const data = await res.json().catch(() => ({ error: 'Save failed' }))
        setSaveError(data.error || `Error ${res.status}`)
      }
    } catch {
      setSaveError('Network error - could not save product')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingId(product.id)
    setForm({
      nameKm: product.nameKm, nameEn: product.nameEn,
      descriptionKm: product.descriptionKm || '', descriptionEn: product.descriptionEn || '',
      price: String(product.price), originalPrice: product.originalPrice ? String(product.originalPrice) : '',
      categoryId: product.categoryId, stockStatus: product.stockStatus,
      isFeatured: product.isFeatured, image: product.image || '',
    })
    setImagePreview(product.image || null)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' })
      if (!res.ok) {
        alert('Failed to delete product')
        return
      }
      fetchProducts()
    } catch {
      alert('Network error - could not delete product')
    }
  }

  const handleCreateCategory = async () => {
    if (!catForm.nameKm || !catForm.nameEn) return
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catForm),
      })
      if (res.ok) {
        setShowCatForm(false)
        setCatForm({ nameKm: '', nameEn: '' })
        fetchCategories()
      } else {
        const data = await res.json().catch(() => ({ error: 'Failed to create category' }))
        alert(data.error || 'Failed to create category')
      }
    } catch {
      alert('Network error - could not create category')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-white font-khmer">គ្រប់គ្រងផលិតផល</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowCatForm(!showCatForm)} className="btn-outline-neon text-sm">
            + ប្រភេទ
          </button>
          <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); setImagePreview(null) }} className="btn-neon text-sm">
            + បន្ថែមផលិតផល
          </button>
        </div>
      </div>

      {/* Category form */}
      {showCatForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="card-gaming p-6">
          <h3 className="text-neon font-semibold mb-4 font-khmer">បន្ថែមប្រភេទថ្មី</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/40 font-khmer mb-1.5">ឈ្មោះ (ខ្មែរ)</label>
              <input value={catForm.nameKm} onChange={(e) => setCatForm({ ...catForm, nameKm: e.target.value })}
                className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon/50" />
            </div>
            <div>
              <label className="block text-sm text-white/40 mb-1.5">Name (English)</label>
              <input value={catForm.nameEn} onChange={(e) => setCatForm({ ...catForm, nameEn: e.target.value })}
                className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon/50" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleCreateCategory} className="btn-gold text-sm">រក្សាទុក</button>
            <button onClick={() => setShowCatForm(false)} className="btn-outline-neon text-sm">បោះបង់</button>
          </div>
        </motion.div>
      )}

      {/* Product form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="card-gaming p-6">
          <h3 className="text-neon font-semibold mb-4 font-khmer">
            {editingId ? 'កែប្រែផលិតផល' : 'បន្ថែមផលិតផលថ្មី'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/40 font-khmer mb-1.5">ឈ្មោះ (ខ្មែរ)</label>
              <input value={form.nameKm} onChange={(e) => setForm({ ...form, nameKm: e.target.value })}
                className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon/50" placeholder="ឈ្មោះផលិតផលជាភាសាខ្មែរ" />
            </div>
            <div>
              <label className="block text-sm text-white/40 mb-1.5">Name (English)</label>
              <input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon/50" placeholder="Product name in English" />
            </div>
            <div>
              <label className="block text-sm text-white/40 font-khmer mb-1.5">ការពិពណ៌នា (ខ្មែរ)</label>
              <textarea value={form.descriptionKm} onChange={(e) => setForm({ ...form, descriptionKm: e.target.value })}
                className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon/50 h-20" placeholder="ការពិពណ៌នាជាភាសាខ្មែរ" />
            </div>
            <div>
              <label className="block text-sm text-white/40 mb-1.5">Description (English)</label>
              <textarea value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
                className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon/50 h-20" placeholder="Description in English" />
            </div>
            <div>
              <label className="block text-sm text-white/40 font-khmer mb-1.5">តម្លៃ (USD)</label>
              <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon/50" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm text-white/40 font-khmer mb-1.5">តម្លៃដើម (USD)</label>
              <input type="number" step="0.01" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon/50" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm text-white/40 font-khmer mb-1.5">ប្រភេទ</label>
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon/50">
                <option value="">ជ្រើសរើសប្រភេទ</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nameKm} / {cat.nameEn}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/40 font-khmer mb-1.5">ស្តុក</label>
              <select value={form.stockStatus} onChange={(e) => setForm({ ...form, stockStatus: e.target.value })}
                className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon/50">
                <option value="IN_STOCK">IN_STOCK</option>
                <option value="LOW_STOCK">LOW_STOCK</option>
                <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
                <option value="PRE_ORDER">PRE_ORDER</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-white/40 font-khmer mb-1.5">រូបភាពផលិតផល</label>
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                  className="border border-dashed border-neon/30 rounded-lg px-6 py-3 text-sm text-neon hover:border-neon/60 transition-colors disabled:opacity-50">
                  {uploading ? '⏳ កំពុងផ្ទុក...' : '📷 ផ្ទុករូបភាព'}
                </button>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageUpload} className="hidden" />
                {imagePreview && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-neon/20">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              {uploadError && (
                <p className="text-red-400 text-xs mt-2">{uploadError}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded border-neon/30 bg-obsidian-50 text-neon focus:ring-neon" />
                <span className="text-sm text-white/60 font-khmer">ផលិតផលពិសេស (Featured)</span>
              </label>
            </div>
          </div>
          {saveError && (
            <p className="text-red-400 text-xs mt-2">{saveError}</p>
          )}
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} disabled={saving} className="btn-gold text-sm disabled:opacity-50">
              {saving ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក'}
            </button>
            <button onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); setImagePreview(null); setSaveError(null) }} className="btn-outline-neon text-sm">បោះបង់</button>
          </div>
        </motion.div>
      )}

      {/* Products table */}
      <div className="card-gaming overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-obsidian-100 border-b border-neon/10">
                <th className="text-left px-4 py-3 text-white/40 font-normal">រូបភាព</th>
                <th className="text-left px-4 py-3 text-white/40 font-khmer font-normal">ឈ្មោះ</th>
                <th className="text-left px-4 py-3 text-white/40 font-normal">Name</th>
                <th className="text-left px-4 py-3 text-white/40 font-khmer font-normal">តម្លៃ</th>
                <th className="text-left px-4 py-3 text-white/40 font-khmer font-normal">ស្តុក</th>
                <th className="text-left px-4 py-3 text-white/40 font-khmer font-normal">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-white/30 font-khmer">មិនមានផលិតផល - សូមបន្ថែមផលិតផលថ្មី</td></tr>
              ) : products.map((product) => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-obsidian-50 border border-neon/10">
                      {product.image ? (
                        <img src={product.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">📷</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/70 font-khmer">{product.nameKm}</td>
                  <td className="px-4 py-3 text-white/50">{product.nameEn}</td>
                  <td className="px-4 py-3 text-gold font-bold">${product.price.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      product.stockStatus === 'IN_STOCK' ? 'bg-green-400/10 text-green-400' :
                      product.stockStatus === 'LOW_STOCK' ? 'bg-orange-400/10 text-orange-400' :
                      'bg-red-400/10 text-red-400'
                    }`}>
                      {product.stockStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(product)} className="text-neon hover:text-neon-300 text-xs font-khmer">កែប្រែ</button>
                      <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-300 text-xs font-khmer">លុប</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
