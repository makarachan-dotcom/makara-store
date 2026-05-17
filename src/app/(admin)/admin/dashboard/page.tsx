'use client'

// ផ្ទាំងព័ត៌មាន Admin Dashboard
import { motion } from 'framer-motion'

const stats = [
  { label: 'ការបញ្ជាទិញសរុប', value: '156', change: '+12%', icon: '🛒', color: 'neon' },
  { label: 'ចំណូលសរុប', value: '$2,847', change: '+8%', icon: '💰', color: 'gold' },
  { label: 'អតិថិជនសកម្ម', value: '89', change: '+5%', icon: '👥', color: 'neon' },
  { label: 'ផលិតផលសកម្ម', value: '24', change: '+2', icon: '📦', color: 'gold' },
]

const recentOrders = [
  { id: 'ORD-001', customer: 'User A', amount: '$9.99', status: 'កំពុងរង់ចាំ', statusColor: 'text-yellow-400' },
  { id: 'ORD-002', customer: 'User B', amount: '$24.99', status: 'បានបញ្ចប់', statusColor: 'text-green-400' },
  { id: 'ORD-003', customer: 'User C', amount: '$5.99', status: 'កំពុងដំណើរការ', statusColor: 'text-neon' },
  { id: 'ORD-004', customer: 'User D', amount: '$14.99', status: 'កំពុងរង់ចាំ', statusColor: 'text-yellow-400' },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-white">ផ្ទាំងព័ត៌មាន</h1>
        <span className="text-sm text-white/30">Admin: chanmakara672@gmail.com</span>
      </div>

      {/* ស្ថិតិ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-gaming p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded">{stat.change}</span>
            </div>
            <p className={`text-2xl font-bold ${stat.color === 'gold' ? 'text-gold' : 'text-neon'}`}>
              {stat.value}
            </p>
            <p className="text-xs text-white/40 mt-1 font-khmer">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ការបញ្ជាទិញថ្មីៗ */}
      <div className="card-gaming p-5">
        <h3 className="text-lg font-semibold text-neon mb-4 font-khmer">ការបញ្ជាទិញថ្មីៗ</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neon/10">
                <th className="text-left py-3 text-white/40 font-khmer font-normal">លេខ</th>
                <th className="text-left py-3 text-white/40 font-khmer font-normal">អតិថិជន</th>
                <th className="text-left py-3 text-white/40 font-khmer font-normal">ចំនួន</th>
                <th className="text-left py-3 text-white/40 font-khmer font-normal">ស្ថានភាព</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 text-neon font-mono text-xs">{order.id}</td>
                  <td className="py-3 text-white/60">{order.customer}</td>
                  <td className="py-3 text-gold font-bold">{order.amount}</td>
                  <td className={`py-3 ${order.statusColor} font-khmer text-xs`}>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
