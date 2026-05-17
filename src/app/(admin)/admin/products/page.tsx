'use client'

// ទំព័រគ្រប់គ្រងផលិតផល Admin
import { useState } from 'react'
import { motion } from 'framer-motion'

const sampleProducts = [
  { id: '1', nameKm: 'ChatGPT Plus - ១ ខែ', nameEn: 'ChatGPT Plus - 1 Month', price: 9.99, stock: 'IN_STOCK', active: true },
  { id: '2', nameKm: 'ChatGPT Plus - ៣ ខែ', nameEn: 'ChatGPT Plus - 3 Months', price: 24.99, stock: 'IN_STOCK', active: true },
  { id: '3', nameKm: 'Netflix Premium - ១ ខែ', nameEn: 'Netflix Premium - 1 Month', price: 5.99, stock: 'IN_STOCK', active: true },
  { id: '4', nameKm: 'Spotify Premium - ១ ខែ', nameEn: 'Spotify Premium - 1 Month', price: 3.99, stock: 'LOW_STOCK', active: true },
]

export default function AdminProductsPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-white font-khmer">គ្រប់គ្រងផលិតផល</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-neon text-sm">
          + បន្ថែមផលិតផល
        </button>
      </div>

      {/* ទម្រង់បន្ថែមផលិតផល */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="card-gaming p-6"
        >
          <h3 className="text-neon font-semibold mb-4 font-khmer">បន្ថែមផលិតផលថ្មី</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/40 font-khmer mb-1.5">ឈ្មោះ (ខ្មែរ)</label>
              <input className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon/50" placeholder="ឈ្មោះផលិតផលជាភាសាខ្មែរ" />
            </div>
            <div>
              <label className="block text-sm text-white/40 mb-1.5">Name (English)</label>
              <input className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon/50" placeholder="Product name in English" />
            </div>
            <div>
              <label className="block text-sm text-white/40 font-khmer mb-1.5">ការពិពណ៌នា (ខ្មែរ)</label>
              <textarea className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon/50 h-20" placeholder="ការពិពណ៌នាជាភាសាខ្មែរ" />
            </div>
            <div>
              <label className="block text-sm text-white/40 mb-1.5">Description (English)</label>
              <textarea className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon/50 h-20" placeholder="Description in English" />
            </div>
            <div>
              <label className="block text-sm text-white/40 font-khmer mb-1.5">តម្លៃ (USD)</label>
              <input type="number" step="0.01" className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon/50" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm text-white/40 font-khmer mb-1.5">ប្រភេទ</label>
              <select className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon/50">
                <option>ជ្រើសរើសប្រភេទ</option>
                <option>ChatGPT</option>
                <option>Streaming</option>
                <option>Design</option>
                <option>Gaming</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="btn-gold text-sm">រក្សាទុក</button>
            <button onClick={() => setShowForm(false)} className="btn-outline-neon text-sm">បោះបង់</button>
          </div>
        </motion.div>
      )}

      {/* តារាងផលិតផល */}
      <div className="card-gaming overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-obsidian-100 border-b border-neon/10">
                <th className="text-left px-4 py-3 text-white/40 font-khmer font-normal">ឈ្មោះ</th>
                <th className="text-left px-4 py-3 text-white/40 font-normal">Name</th>
                <th className="text-left px-4 py-3 text-white/40 font-khmer font-normal">តម្លៃ</th>
                <th className="text-left px-4 py-3 text-white/40 font-khmer font-normal">ស្តុក</th>
                <th className="text-left px-4 py-3 text-white/40 font-khmer font-normal">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody>
              {sampleProducts.map((product) => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-white/70 font-khmer">{product.nameKm}</td>
                  <td className="px-4 py-3 text-white/50">{product.nameEn}</td>
                  <td className="px-4 py-3 text-gold font-bold">${product.price.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      product.stock === 'IN_STOCK' ? 'bg-green-400/10 text-green-400' :
                      product.stock === 'LOW_STOCK' ? 'bg-orange-400/10 text-orange-400' :
                      'bg-red-400/10 text-red-400'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="text-neon hover:text-neon-300 text-xs font-khmer">កែប្រែ</button>
                      <button className="text-red-400 hover:text-red-300 text-xs font-khmer">លុប</button>
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
