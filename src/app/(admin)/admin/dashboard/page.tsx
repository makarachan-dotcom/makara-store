'use client'

// ផ្ទាំងព័ត៌មាន Admin Dashboard - Real Version
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  totalUsers: number
  totalProducts: number
}

interface RecentOrder {
  id: string
  orderNumber: string
  customer: string
  customerEmail?: string
  customerImage?: string | null
  amount: number
  status: string
  createdAt: string
}

const statusColors: Record<string, string> = {
  PENDING: 'text-yellow-400',
  PROCESSING: 'text-blue-400',
  PAYMENT_UPLOADED: 'text-purple-400',
  PAYMENT_VERIFIED: 'text-cyan-400',
  COMPLETED: 'text-green-400',
  CANCELLED: 'text-red-400',
  REFUNDED: 'text-orange-400',
}

const statusLabels: Record<string, string> = {
  PENDING: 'កំពុងរង់ចាំ',
  PROCESSING: 'កំពុងដំណើរការ',
  PAYMENT_UPLOADED: 'បង់ប្រាក់រួច',
  PAYMENT_VERIFIED: 'ផ្ទៀងផ្ទាត់រួច',
  COMPLETED: 'បានបញ្ចប់',
  CANCELLED: 'បានបោះបង់',
  REFUNDED: 'បានសងប្រាក់វិញ',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({ totalOrders: 0, totalRevenue: 0, totalUsers: 0, totalProducts: 0 })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/dashboard')
      const data = await res.json()
      setStats(data.stats || { totalOrders: 0, totalRevenue: 0, totalUsers: 0, totalProducts: 0 })
      setRecentOrders(data.recentOrders || [])
    } catch { /* fetch failed */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchDashboard() }, [fetchDashboard])

  const statCards = [
    { label: 'ការបញ្ជាទិញសរុប', value: String(stats.totalOrders), icon: '🛒', color: 'neon' },
    { label: 'ចំណូលសរុប', value: `$${stats.totalRevenue.toFixed(2)}`, icon: '💰', color: 'gold' },
    { label: 'អតិថិជន', value: String(stats.totalUsers), icon: '👥', color: 'neon' },
    { label: 'ផលិតផលសកម្ម', value: String(stats.totalProducts), icon: '📦', color: 'gold' },
  ]

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
        <h1 className="text-2xl font-display font-bold text-white">ផ្ទាំងព័ត៌មាន</h1>
        <span className="text-sm text-white/30">Admin: chanmakara672@gmail.com</span>
      </div>

      {/* ស្ថិតិ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-gaming p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
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
          {recentOrders.length === 0 ? (
            <p className="text-white/30 text-sm text-center py-8 font-khmer">មិនមានការបញ្ជាទិញថ្មីៗ</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neon/10">
                  <th className="text-left py-3 text-white/40 font-khmer font-normal">លេខ</th>
                  <th className="text-left py-3 text-white/40 font-khmer font-normal">អតិថិជន</th>
                  <th className="text-left py-3 text-white/40 font-khmer font-normal">ចំនួន</th>
                  <th className="text-left py-3 text-white/40 font-khmer font-normal">កាលបរិច្ឆេទ</th>
                  <th className="text-left py-3 text-white/40 font-khmer font-normal">ស្ថានភាព</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 text-neon font-mono text-xs">{order.orderNumber}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        {order.customerImage && (
                          <img src={order.customerImage} alt="" className="w-6 h-6 rounded-full" />
                        )}
                        <div>
                          <p className="text-white/60 text-xs">{order.customer}</p>
                          {order.customerEmail && (
                            <p className="text-white/30 text-xs">{order.customerEmail}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-gold font-bold">${order.amount.toFixed(2)}</td>
                    <td className="py-3 text-white/40 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className={`py-3 ${statusColors[order.status] || 'text-white/40'} font-khmer text-xs`}>
                      {statusLabels[order.status] || order.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
