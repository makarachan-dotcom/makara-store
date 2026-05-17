'use client'

// ទំព័រគ្រប់គ្រងបង្កាន់ដៃ Admin - Manual Override
import { useState } from 'react'
import { motion } from 'framer-motion'

const receipts = [
  { id: 'REC-001', orderId: 'ORD-001', customer: 'user@example.com', amount: 9.99, aiStatus: 'AI_APPROVED', adminStatus: 'PENDING' },
  { id: 'REC-002', orderId: 'ORD-003', customer: 'demo@example.com', amount: 5.99, aiStatus: 'AI_REJECTED', adminStatus: 'PENDING' },
  { id: 'REC-003', orderId: 'ORD-004', customer: 'john@example.com', amount: 6.99, aiStatus: 'AI_APPROVED', adminStatus: 'PENDING' },
]

export default function AdminReceiptsPage() {
  const [adjustAmount, setAdjustAmount] = useState<Record<string, string>>({})

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-white font-khmer">គ្រប់គ្រងបង្កាន់ដៃ</h1>

      <div className="space-y-4">
        {receipts.map((receipt, i) => (
          <motion.div
            key={receipt.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-gaming p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-neon font-mono text-sm">{receipt.id}</span>
                  <span className="text-white/30 text-xs">→ {receipt.orderId}</span>
                </div>
                <p className="text-sm text-white/50 mb-1">{receipt.customer}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    receipt.aiStatus === 'AI_APPROVED' ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'
                  }`}>
                    {receipt.aiStatus === 'AI_APPROVED' ? 'AI: អនុម័ត' : 'AI: បដិសេធ'}
                  </span>
                  <span className="text-gold font-bold">${receipt.amount.toFixed(2)}</span>
                </div>
              </div>

              {/* រូបភាពបង្កាន់ដៃ */}
              <div className="w-20 h-20 bg-obsidian-50 rounded-lg border border-neon/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Admin Override */}
            <div className="mt-4 pt-4 border-t border-neon/10">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-xs text-white/30 font-khmer mb-1">កែប្រែចំនួនទឹកប្រាក់</label>
                  <input
                    type="number"
                    step="0.01"
                    value={adjustAmount[receipt.id] || ''}
                    onChange={(e) => setAdjustAmount({ ...adjustAmount, [receipt.id]: e.target.value })}
                    className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-3 py-2 text-sm
                               text-white focus:outline-none focus:border-neon/50"
                    placeholder={receipt.amount.toFixed(2)}
                  />
                </div>
                <button className="btn-neon text-xs mt-5 py-2">អនុម័ត</button>
                <button className="bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-xs mt-5 hover:bg-red-500/30 transition-colors">បដិសេធ</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
