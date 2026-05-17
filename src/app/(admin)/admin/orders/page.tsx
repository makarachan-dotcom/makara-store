'use client'

// ទំព័រគ្រប់គ្រងការបញ្ជាទិញ Admin
import { motion } from 'framer-motion'

const orders = [
  { id: 'ORD-001', customer: 'user@example.com', items: 'ChatGPT Plus - 1M', amount: 9.99, status: 'PENDING', receipt: 'PENDING', date: '2026-05-17' },
  { id: 'ORD-002', customer: 'test@example.com', items: 'ChatGPT Plus - 3M', amount: 24.99, status: 'COMPLETED', receipt: 'ADMIN_APPROVED', date: '2026-05-16' },
  { id: 'ORD-003', customer: 'demo@example.com', items: 'Netflix Premium', amount: 5.99, status: 'PAYMENT_UPLOADED', receipt: 'AI_APPROVED', date: '2026-05-16' },
  { id: 'ORD-004', customer: 'john@example.com', items: 'Canva Pro', amount: 6.99, status: 'PROCESSING', receipt: 'PENDING', date: '2026-05-15' },
]

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-400/10 text-yellow-400',
  PROCESSING: 'bg-blue-400/10 text-blue-400',
  PAYMENT_UPLOADED: 'bg-purple-400/10 text-purple-400',
  COMPLETED: 'bg-green-400/10 text-green-400',
  CANCELLED: 'bg-red-400/10 text-red-400',
}

const receiptColors: Record<string, string> = {
  PENDING: 'text-yellow-400',
  AI_APPROVED: 'text-neon',
  AI_REJECTED: 'text-red-400',
  ADMIN_APPROVED: 'text-green-400',
  ADMIN_REJECTED: 'text-red-400',
}

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-white font-khmer">គ្រប់គ្រងការបញ្ជាទិញ</h1>

      {/* តម្រង */}
      <div className="flex flex-wrap gap-2">
        {['ទាំងអស់', 'កំពុងរង់ចាំ', 'កំពុងដំណើរការ', 'បានបញ្ចប់', 'បានបោះបង់'].map((f, i) => (
          <button key={f} className={`px-3 py-1.5 text-xs rounded-lg border font-khmer transition-all ${
            i === 0 ? 'bg-neon/10 border-neon/30 text-neon' : 'border-white/10 text-white/40 hover:border-neon/20'
          }`}>
            {f}
          </button>
        ))}
      </div>

      {/* តារាង */}
      <div className="card-gaming overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-obsidian-100 border-b border-neon/10">
                <th className="text-left px-4 py-3 text-white/40 font-normal">លេខ</th>
                <th className="text-left px-4 py-3 text-white/40 font-normal">អតិថិជន</th>
                <th className="text-left px-4 py-3 text-white/40 font-normal">ផលិតផល</th>
                <th className="text-left px-4 py-3 text-white/40 font-normal">ចំនួន</th>
                <th className="text-left px-4 py-3 text-white/40 font-normal">ស្ថានភាព</th>
                <th className="text-left px-4 py-3 text-white/40 font-normal">បង្កាន់ដៃ</th>
                <th className="text-left px-4 py-3 text-white/40 font-normal">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-3 text-neon font-mono text-xs">{order.id}</td>
                  <td className="px-4 py-3 text-white/50 text-xs">{order.customer}</td>
                  <td className="px-4 py-3 text-white/60 font-khmer">{order.items}</td>
                  <td className="px-4 py-3 text-gold font-bold">${order.amount.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-xs ${receiptColors[order.receipt]}`}>{order.receipt}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="text-neon hover:text-neon-300 text-xs font-khmer">មើល</button>
                      <button className="text-gold hover:text-gold-300 text-xs font-khmer">អនុម័ត</button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
