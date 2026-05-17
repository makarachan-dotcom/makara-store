'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'

interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
}

interface Order {
  id: string
  orderNumber: string
  status: string
  totalAmount: number
  createdAt: string
  user: { name: string | null; email: string }
  items: OrderItem[]
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-400/10 text-yellow-400',
  PROCESSING: 'bg-blue-400/10 text-blue-400',
  PAYMENT_UPLOADED: 'bg-purple-400/10 text-purple-400',
  PAYMENT_VERIFIED: 'bg-cyan-400/10 text-cyan-400',
  COMPLETED: 'bg-green-400/10 text-green-400',
  CANCELLED: 'bg-red-400/10 text-red-400',
  REFUNDED: 'bg-orange-400/10 text-orange-400',
}

const allStatuses = ['PENDING', 'PROCESSING', 'PAYMENT_UPLOADED', 'PAYMENT_VERIFIED', 'COMPLETED', 'CANCELLED', 'REFUNDED']

export default function AdminOrdersPage() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      setOrders(data.orders || [])
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId)
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      })
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        )
      } else {
        alert('Failed to update order status')
      }
    } catch {
      alert('Network error - could not update order status')
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredOrders = filter === 'ALL' ? orders : orders.filter((o) => o.status === filter)

  if (!session?.user?.email || session.user.email !== 'chanmakara672@gmail.com') {
    return (
      <div className="text-center py-16">
        <p className="text-red-400">Admin access required</p>
      </div>
    )
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
        <h1 className="text-2xl font-display font-bold text-white font-khmer">គ្រប់គ្រងការបញ្ជាទិញ</h1>
        <span className="text-white/40 text-sm">{orders.length} orders</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {['ALL', ...allStatuses].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
              filter === f
                ? 'bg-neon/10 border-neon/30 text-neon'
                : 'border-white/10 text-white/40 hover:border-neon/20'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-white/30 font-khmer">មិនមានការបញ្ជាទិញ</p>
        </div>
      ) : (
        <div className="card-gaming overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-obsidian-100 border-b border-neon/10">
                  <th className="text-left px-4 py-3 text-white/40 font-normal">Order #</th>
                  <th className="text-left px-4 py-3 text-white/40 font-normal">Customer</th>
                  <th className="text-left px-4 py-3 text-white/40 font-normal">Amount</th>
                  <th className="text-left px-4 py-3 text-white/40 font-normal">Date</th>
                  <th className="text-left px-4 py-3 text-white/40 font-normal">Status</th>
                  <th className="text-left px-4 py-3 text-white/40 font-normal">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3 text-neon font-mono text-xs">{order.orderNumber}</td>
                    <td className="px-4 py-3">
                      <p className="text-white/60 text-xs">{order.user?.name || 'N/A'}</p>
                      <p className="text-white/30 text-xs">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gold font-bold">${order.totalAmount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-white/40 text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${statusColors[order.status] || ''}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        disabled={updatingId === order.id}
                        className="bg-obsidian-50 border border-white/10 rounded px-2 py-1 text-xs text-white/70
                                   focus:outline-none focus:border-neon/30 disabled:opacity-50"
                      >
                        {allStatuses.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
