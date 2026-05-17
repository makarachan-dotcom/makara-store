'use client'

// ទំព័រការកំណត់ Admin - Master Toggle, KHQR, Hero Banners
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function AdminSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [telegramUrl, setTelegramUrl] = useState('https://t.me/makara_admin')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-white">ការកំណត់គេហទំព័រ</h1>

      {/* Master Toggle - Maintenance Mode */}
      <div className="card-gaming p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white font-khmer">ធ្វើបច្ចុប្បន្នភាពគេហទំព័រ</h3>
            <p className="text-sm text-white/40 font-khmer mt-1">
              បើក/បិទ របៀបថែទាំ - នឹងបង្ហាញផ្ទាំង &quot;ទំព័រកំពុងធ្វើបច្ចុប្បន្នភាព&quot;
            </p>
          </div>
          <button
            onClick={() => setMaintenanceMode(!maintenanceMode)}
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
              ⚠️ គេហទំព័រកំពុងស្ថិតក្នុង Maintenance Mode - អ្នកប្រើប្រាស់ទាំងអស់នឹងឃើញផ្ទាំងថែទាំ
            </p>
          </motion.div>
        )}
      </div>

      {/* គ្រប់គ្រង KHQR */}
      <div className="card-gaming p-6">
        <h3 className="text-lg font-semibold text-neon font-khmer mb-4">គ្រប់គ្រង KHQR</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['ABA Bank', 'ACLEDA Bank', 'Wing Bank'].map((bank) => (
            <div key={bank} className="border border-neon/10 rounded-xl p-4">
              <p className="text-sm text-white/60 mb-3">{bank}</p>
              <div className="aspect-square bg-obsidian-50 rounded-lg flex items-center justify-center border border-dashed border-neon/20 cursor-pointer hover:border-neon/40 transition-colors">
                <div className="text-center">
                  <svg className="w-8 h-8 mx-auto text-neon/30 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs text-white/30 font-khmer">ផ្ទុករូបភាព KHQR</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* គ្រប់គ្រង Hero Banner */}
      <div className="card-gaming p-6">
        <h3 className="text-lg font-semibold text-neon font-khmer mb-4">គ្រប់គ្រង Hero Banner</h3>
        <div className="border border-dashed border-neon/20 rounded-xl p-8 text-center cursor-pointer hover:border-neon/40 transition-colors">
          <svg className="w-10 h-10 mx-auto text-neon/30 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 4v16m8-8H4" />
          </svg>
          <p className="text-sm text-white/30 font-khmer">បន្ថែម Banner ថ្មី</p>
        </div>
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
        <button className="mt-3 btn-neon text-sm">រក្សាទុក</button>
      </div>
    </div>
  )
}
