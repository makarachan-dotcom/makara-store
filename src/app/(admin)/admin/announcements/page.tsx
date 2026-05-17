'use client'

// ទំព័រគ្រប់គ្រងការជូនដំណឹង Admin - ភាសាពីរ
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function AdminAnnouncementsPage() {
  const [showForm, setShowForm] = useState(false)
  const [announcements] = useState([
    { id: '1', titleKm: 'ការផ្សព្វផ្សាយពិសេស!', titleEn: 'Special Promotion!', type: 'PROMOTION', active: true },
    { id: '2', titleKm: 'ការថែទាំប្រព័ន្ធ', titleEn: 'System Maintenance', type: 'WARNING', active: false },
  ])

  const typeColors: Record<string, string> = {
    INFO: 'bg-blue-400/10 text-blue-400',
    WARNING: 'bg-orange-400/10 text-orange-400',
    PROMOTION: 'bg-green-400/10 text-green-400',
    URGENT: 'bg-red-400/10 text-red-400',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-white font-khmer">ការជូនដំណឹង</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-neon text-sm">
          + បន្ថែមការជូនដំណឹង
        </button>
      </div>

      {/* ទម្រង់បន្ថែម - ភាសាពីរ */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="card-gaming p-6"
        >
          <h3 className="text-neon font-semibold mb-4 font-khmer">ការជូនដំណឹងថ្មី</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/40 font-khmer mb-1.5">ចំណងជើង (ខ្មែរ)</label>
              <input className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon/50" placeholder="ចំណងជើងជាភាសាខ្មែរ" />
            </div>
            <div>
              <label className="block text-sm text-white/40 mb-1.5">Title (English)</label>
              <input className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon/50" placeholder="Title in English" />
            </div>
            <div>
              <label className="block text-sm text-white/40 font-khmer mb-1.5">មាតិកា (ខ្មែរ)</label>
              <textarea className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon/50 h-24" placeholder="មាតិកាជាភាសាខ្មែរ" />
            </div>
            <div>
              <label className="block text-sm text-white/40 mb-1.5">Content (English)</label>
              <textarea className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon/50 h-24" placeholder="Content in English" />
            </div>
            <div>
              <label className="block text-sm text-white/40 font-khmer mb-1.5">ប្រភេទ</label>
              <select className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon/50">
                <option value="INFO">ព័ត៌មាន</option>
                <option value="WARNING">ព្រមាន</option>
                <option value="PROMOTION">ផ្សព្វផ្សាយ</option>
                <option value="URGENT">បន្ទាន់</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="btn-gold text-sm">រក្សាទុក</button>
            <button onClick={() => setShowForm(false)} className="btn-outline-neon text-sm">បោះបង់</button>
          </div>
        </motion.div>
      )}

      {/* បញ្ជីការជូនដំណឹង */}
      <div className="space-y-3">
        {announcements.map((ann) => (
          <div key={ann.id} className="card-gaming p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className={`text-xs px-2 py-0.5 rounded ${typeColors[ann.type]}`}>{ann.type}</span>
              <div>
                <p className="text-sm text-white/70 font-khmer">{ann.titleKm}</p>
                <p className="text-xs text-white/40">{ann.titleEn}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${ann.active ? 'bg-green-400' : 'bg-red-400'}`} />
              <button className="text-neon text-xs font-khmer hover:underline">កែប្រែ</button>
              <button className="text-red-400 text-xs font-khmer hover:underline">លុប</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
