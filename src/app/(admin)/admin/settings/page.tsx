'use client'

// ទំព័រការកំណត់ Admin - Real Version with DB persistence
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [updateStatus, setUpdateStatus] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [telegramUrl, setTelegramUrl] = useState('https://t.me/AF4STURF')
  const [uploadingBank, setUploadingBank] = useState<string | null>(null)
  const [uploadBankError, setUploadBankError] = useState<string | null>(null)
  const khqrRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      setSettings(data.settings || {})
      setTelegramUrl(data.settings?.telegramUrl || 'https://t.me/AF4STURF')
    } catch { /* fetch failed */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchSettings() }, [fetchSettings])

  const saveSetting = async (key: string, value: string) => {
    setSaving(true)
    setSaveError(null)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Save failed' }))
        setSaveError(data.error || `Error ${res.status}`)
        setTimeout(() => setSaveError(null), 5000)
        return
      }
      fetchSettings()
    } catch {
      setSaveError('Network error - could not save')
      setTimeout(() => setSaveError(null), 5000)
    }
    finally { setSaving(false) }
  }

  const maintenanceMode = settings.maintenanceMode === 'true'

  const toggleMaintenance = async () => {
    await saveSetting('maintenanceMode', maintenanceMode ? 'false' : 'true')
  }

  const handleUpdateWebsite = async () => {
    setUpdateStatus('updating')
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lastUpdated: new Date().toISOString() }),
      })
      setUpdateStatus('success')
      setTimeout(() => setUpdateStatus(null), 3000)
    } catch {
      setUpdateStatus('error')
      setTimeout(() => setUpdateStatus(null), 3000)
    }
  }

  const handleKhqrUpload = async (bank: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingBank(bank)
    setUploadBankError(null)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) {
        setUploadBankError(data.error || 'Upload failed')
        return
      }
      if (data.url) {
        await saveSetting(`khqr${bank}`, data.url)
      }
    } catch {
      setUploadBankError('Network error - could not upload image')
    } finally {
      setUploadingBank(null)
      const ref = khqrRefs.current[bank]
      if (ref) ref.value = ''
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
      <h1 className="text-2xl font-display font-bold text-white">ការកំណត់គេហទំព័រ</h1>

      {saveError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
        >
          <p className="text-red-400 text-sm">{saveError}</p>
        </motion.div>
      )}

      {/* Update Website Button */}
      <div className="card-gaming p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gold font-khmer">ធ្វើបច្ចុប្បន្នភាពគេហទំព័រ</h3>
            <p className="text-sm text-white/40 font-khmer mt-1">
              ចុចប៊ូតុងខាងក្រោមដើម្បីធ្វើបច្ចុប្បន្នភាពគេហទំព័រ
            </p>
            {settings.lastUpdated && (
              <p className="text-xs text-white/20 mt-2">
                Last updated: {new Date(settings.lastUpdated).toLocaleString()}
              </p>
            )}
          </div>
          <button
            onClick={handleUpdateWebsite}
            disabled={updateStatus === 'updating'}
            className="btn-gold text-sm px-6 py-3 disabled:opacity-50"
          >
            {updateStatus === 'updating' ? 'កំពុងធ្វើបច្ចុប្បន្នភាព...' :
             updateStatus === 'success' ? 'បានធ្វើបច្ចុប្បន្នភាពរួច!' :
             updateStatus === 'error' ? 'កំហុស!' :
             '🔄 ធ្វើបច្ចុប្បន្នភាពគេហទំព័រ'}
          </button>
        </div>
        {updateStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
          >
            <p className="text-green-400 text-sm font-khmer">
              គេហទំព័រត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ!
            </p>
          </motion.div>
        )}
      </div>

      {/* Master Toggle - Maintenance Mode */}
      <div className="card-gaming p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white font-khmer">របៀបថែទាំ (Maintenance Mode)</h3>
            <p className="text-sm text-white/40 font-khmer mt-1">
              បើក/បិទ របៀបថែទាំ - នឹងបង្ហាញផ្ទាំង &quot;ទំព័រកំពុងធ្វើបច្ចុប្បន្នភាព&quot;
            </p>
          </div>
          <button
            onClick={toggleMaintenance}
            disabled={saving}
            className={`relative w-14 h-7 rounded-full transition-all ${
              maintenanceMode
                ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                : 'bg-obsidian-50 border border-neon/20'
            }`}
          >
            <motion.div
              animate={{ x: maintenanceMode ? 28 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`absolute top-1 w-5 h-5 rounded-full ${
                maintenanceMode ? 'bg-white' : 'bg-neon/60'
              }`}
            />
          </button>
        </div>
        {maintenanceMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
          >
            <p className="text-red-400 text-sm font-khmer">
              គេហទំព័រកំពុងស្ថិតក្នុង Maintenance Mode - អ្នកប្រើប្រាស់ទាំងអស់នឹងឃើញផ្ទាំងថែទាំ
            </p>
          </motion.div>
        )}
      </div>

      {/* គ្រប់គ្រង KHQR */}
      <div className="card-gaming p-6">
        <h3 className="text-lg font-semibold text-neon font-khmer mb-4">គ្រប់គ្រង KHQR</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[{ key: 'ABA', label: 'ABA Bank' }, { key: 'ACLEDA', label: 'ACLEDA Bank' }, { key: 'WING', label: 'Wing Bank' }].map((bank) => (
            <div key={bank.key} className="border border-neon/10 rounded-xl p-4">
              <p className="text-sm text-white/60 mb-3">{bank.label}</p>
              <div
                onClick={() => !uploadingBank && khqrRefs.current[bank.key]?.click()}
                className={`aspect-square bg-obsidian-50 rounded-lg flex items-center justify-center border border-dashed border-neon/20 cursor-pointer hover:border-neon/40 transition-colors overflow-hidden ${uploadingBank === bank.key ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {settings[`khqr${bank.key}`] ? (
                  <img src={settings[`khqr${bank.key}`]} alt={bank.label} className="w-full h-full object-contain" />
                ) : (
                  <div className="text-center">
                    {uploadingBank === bank.key ? (
                      <>
                        <div className="w-8 h-8 mx-auto border-2 border-neon border-t-transparent rounded-full animate-spin mb-2" />
                        <p className="text-xs text-neon/50 font-khmer">កំពុងផ្ទុក...</p>
                      </>
                    ) : (
                      <>
                        <svg className="w-8 h-8 mx-auto text-neon/30 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-xs text-white/30 font-khmer">ផ្ទុករូបភាព KHQR</p>
                      </>
                    )}
                  </div>
                )}
              </div>
              <input
                ref={(el) => { khqrRefs.current[bank.key] = el }}
                type="file" accept="image/*"
                onChange={(e) => handleKhqrUpload(bank.key, e)}
                className="hidden"
              />
            </div>
          ))}
        </div>
        {uploadBankError && (
          <p className="text-red-400 text-xs mt-3">{uploadBankError}</p>
        )}
      </div>

      {/* Telegram URL */}
      <div className="card-gaming p-6">
        <h3 className="text-lg font-semibold text-neon font-khmer mb-4">តំណ Telegram Admin</h3>
        <input
          type="url"
          value={telegramUrl}
          onChange={(e) => setTelegramUrl(e.target.value)}
          className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5
                     text-white focus:outline-none focus:border-neon/50"
        />
        <button
          onClick={() => saveSetting('telegramUrl', telegramUrl)}
          disabled={saving}
          className="mt-3 btn-neon text-sm disabled:opacity-50"
        >
          {saving ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក'}
        </button>
      </div>
    </div>
  )
}
