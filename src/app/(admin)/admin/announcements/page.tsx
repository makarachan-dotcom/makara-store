'use client'

// ទំព័រគ្រប់គ្រងការជូនដំណឹង Admin - Real Version with Prisma
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

interface Announcement {
  id: string
  titleKm: string
  titleEn: string
  contentKm: string
  contentEn: string
  type: string
  isActive: boolean
  createdAt: string
}

const emptyForm = { titleKm: '', titleEn: '', contentKm: '', contentEn: '', type: 'INFO' }

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const typeColors: Record<string, string> = {
    INFO: 'bg-blue-400/10 text-blue-400',
    WARNING: 'bg-orange-400/10 text-orange-400',
    PROMOTION: 'bg-green-400/10 text-green-400',
    URGENT: 'bg-red-400/10 text-red-400',
  }

  const fetchAnnouncements = useCallback(async () => {
    try {
      const res = await fetch('/api/announcements')
      const data = await res.json()
      if (!res.ok) {
        setFetchError(data.error || 'Failed to load announcements')
        return
      }
      setFetchError(null)
      setAnnouncements(data.announcements || [])
    } catch {
      setFetchError('Network error - could not load announcements')
      setAnnouncements([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAnnouncements() }, [fetchAnnouncements])

  const handleSave = async () => {
    if (!form.titleKm || !form.titleEn) {
      setSaveError('Please fill in both title fields')
      return
    }
    setSaving(true)
    setSaveError(null)
    try {
      const method = editingId ? 'PUT' : 'POST'
      const body = editingId ? { id: editingId, ...form } : form
      const res = await fetch('/api/announcements', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        setForm(emptyForm)
        setEditingId(null)
        setShowForm(false)
        setSaveError(null)
        fetchAnnouncements()
      } else {
        const data = await res.json().catch(() => ({ error: 'Save failed' }))
        setSaveError(data.error || `Error ${res.status}`)
      }
    } catch {
      setSaveError('Network error - could not save announcement')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (ann: Announcement) => {
    setForm({
      titleKm: ann.titleKm,
      titleEn: ann.titleEn,
      contentKm: ann.contentKm,
      contentEn: ann.contentEn,
      type: ann.type,
    })
    setEditingId(ann.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return
    try {
      const res = await fetch(`/api/announcements?id=${id}`, { method: 'DELETE' })
      if (!res.ok) {
        alert('Failed to delete announcement')
        return
      }
      fetchAnnouncements()
    } catch {
      alert('Network error - could not delete announcement')
    }
  }

  const handleToggleActive = async (ann: Announcement) => {
    try {
      const res = await fetch('/api/announcements', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ann.id, isActive: !ann.isActive }),
      })
      if (!res.ok) {
        alert('Failed to update announcement status')
        return
      }
      fetchAnnouncements()
    } catch {
      alert('Network error - could not update status')
    }
  }

  const handleCancel = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(false)
    setSaveError(null)
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
        <h1 className="text-2xl font-display font-bold text-white font-khmer">ការជូនដំណឹង</h1>
        <button
          onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(!showForm) }}
          className="btn-neon text-sm"
        >
          + បន្ថែមការជូនដំណឹង
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="card-gaming p-6"
        >
          <h3 className="text-neon font-semibold mb-4 font-khmer">
            {editingId ? 'កែប្រែការជូនដំណឹង' : 'ការជូនដំណឹងថ្មី'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/40 font-khmer mb-1.5">ចំណងជើង (ខ្មែរ)</label>
              <input
                value={form.titleKm}
                onChange={(e) => setForm({ ...form, titleKm: e.target.value })}
                className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon/50"
                placeholder="ចំណងជើងជាភាសាខ្មែរ"
              />
            </div>
            <div>
              <label className="block text-sm text-white/40 mb-1.5">Title (English)</label>
              <input
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon/50"
                placeholder="Title in English"
              />
            </div>
            <div>
              <label className="block text-sm text-white/40 font-khmer mb-1.5">មាតិកា (ខ្មែរ)</label>
              <textarea
                value={form.contentKm}
                onChange={(e) => setForm({ ...form, contentKm: e.target.value })}
                className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon/50 h-24"
                placeholder="មាតិកាជាភាសាខ្មែរ"
              />
            </div>
            <div>
              <label className="block text-sm text-white/40 mb-1.5">Content (English)</label>
              <textarea
                value={form.contentEn}
                onChange={(e) => setForm({ ...form, contentEn: e.target.value })}
                className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon/50 h-24"
                placeholder="Content in English"
              />
            </div>
            <div>
              <label className="block text-sm text-white/40 font-khmer mb-1.5">ប្រភេទ</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon/50"
              >
                <option value="INFO">ព័ត៌មាន</option>
                <option value="WARNING">ព្រមាន</option>
                <option value="PROMOTION">ផ្សព្វផ្សាយ</option>
                <option value="URGENT">បន្ទាន់</option>
              </select>
            </div>
          </div>
          {saveError && (
            <p className="text-red-400 text-xs mt-2">{saveError}</p>
          )}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSave}
              disabled={saving || !form.titleKm || !form.titleEn}
              className="btn-gold text-sm disabled:opacity-50"
            >
              {saving ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក'}
            </button>
            <button onClick={handleCancel} className="btn-outline-neon text-sm">បោះបង់</button>
          </div>
        </motion.div>
      )}

      {fetchError && (
        <div className="card-gaming p-4 border border-red-500/20">
          <p className="text-red-400 text-sm">{fetchError}</p>
          <button onClick={fetchAnnouncements} className="text-neon text-xs mt-2 hover:underline">Retry</button>
        </div>
      )}

      {announcements.length === 0 && !fetchError ? (
        <div className="card-gaming p-8 text-center">
          <p className="text-white/30 font-khmer">មិនមានការជូនដំណឹង - សូមបន្ថែមការជូនដំណឹងថ្មី</p>
          <p className="text-white/20 text-sm mt-1">No announcements yet - Add a new one</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((ann) => (
            <div key={ann.id} className="card-gaming p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className={`text-xs px-2 py-0.5 rounded ${typeColors[ann.type] || 'bg-white/10 text-white/60'}`}>{ann.type}</span>
                <div>
                  <p className="text-sm text-white/70 font-khmer">{ann.titleKm}</p>
                  <p className="text-xs text-white/40">{ann.titleEn}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleActive(ann)}
                  className={`w-2 h-2 rounded-full cursor-pointer ${ann.isActive ? 'bg-green-400' : 'bg-red-400'}`}
                  title={ann.isActive ? 'Active - click to deactivate' : 'Inactive - click to activate'}
                />
                <button onClick={() => handleEdit(ann)} className="text-neon text-xs font-khmer hover:underline">កែប្រែ</button>
                <button onClick={() => handleDelete(ann.id)} className="text-red-400 text-xs font-khmer hover:underline">លុប</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
