'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'

interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  product?: { nameKm: string; nameEn: string; image: string | null }
}

interface Order {
  id: string
  orderNumber: string
  status: string
  totalAmount: number
  paymentMethod: string | null
  paymentProof: string | null
  createdAt: string
  user: { name: string | null; email: string }
  items: OrderItem[]
  bakongReceipts?: Array<{ receiptImageUrl: string; adminStatus: string }>
}

const bankLabels: Record<string, string> = {
  ABA_BANK: 'ABA Bank',
  ACLEDA_BANK: 'ACLEDA Bank',
  WING_BANK: 'Wing Bank',
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
  const [expandedId, setExpandedId] = useState<string | null>(null)

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
        <div className="space-y-3">
          {filteredOrders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="card-gaming overflow-hidden"
            >
              <button
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                className="w-full px-4 py-3 flex items-center gap-4 hover:bg-white/5 transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-neon font-mono text-xs">{order.orderNumber}</p>
                  <p className="text-white/40 text-xs mt-0.5 truncate">
                    {order.items.map(item => item.product?.nameEn || item.productId).join(', ')}
                  </p>
                </div>
                <div className="text-right flex-shrink-0 hidden sm:block">
                  <p className="text-white/60 text-xs">{order.user?.name || 'N/A'}</p>
                  <p className="text-white/30 text-xs">{order.user?.email}</p>
                </div>
                <div className="text-gold font-bold text-sm flex-shrink-0">
                  ${order.totalAmount.toFixed(2)}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded flex-shrink-0 ${statusColors[order.status] || ''}`}>
                  {order.status}
                </span>
                <svg
                  className={`w-4 h-4 text-white/30 transition-transform flex-shrink-0 ${
                    expandedId === order.id ? 'rotate-180' : ''
                  }`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {expandedId === order.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 py-4 border-t border-white/5 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-obsidian-50 rounded-lg p-3">
                          <p className="text-white/30 text-xs mb-1 font-khmer">{'\u17a2\u178f\u17b7\u1790\u17b7\u1787\u1793'}</p>
                          <p className="text-white text-sm">{order.user?.name || 'N/A'}</p>
                          <p className="text-white/50 text-xs">{order.user?.email}</p>
                        </div>
                        <div className="bg-obsidian-50 rounded-lg p-3">
                          <p className="text-white/30 text-xs mb-1 font-khmer">{'\u179c\u17b7\u1792\u17b8\u1794\u1784\u17cb\u1794\u17d2\u179a\u17b6\u1780\u17cb'}</p>
                          <p className="text-white text-sm">{order.paymentMethod ? bankLabels[order.paymentMethod] || order.paymentMethod : 'N/A'}</p>
                        </div>
                        <div className="bg-obsidian-50 rounded-lg p-3">
                          <p className="text-white/30 text-xs mb-1 font-khmer">{'\u1780\u17b6\u179b\u1794\u179a\u17b7\u1785\u17d2\u1786\u17c1\u1791'}</p>
                          <p className="text-white text-sm">
                            {new Date(order.createdAt).toLocaleString('en-US', {
                              year: 'numeric', month: 'short', day: 'numeric',
                              hour: '2-digit', minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="bg-obsidian-50 rounded-lg p-3">
                        <p className="text-white/30 text-xs mb-2 font-khmer">{'\u1795\u179b\u17b7\u178f\u1795\u179b\u178a\u17c2\u179b\u1794\u17b6\u1793\u1794\u1789\u17d2\u1787\u17b6\u1791\u17b7\u1789'}</p>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                              <span className="text-white/70">
                                {item.product?.nameEn || item.productId}
                              </span>
                              <div className="flex items-center gap-4">
                                <span className="text-white/40">x{item.quantity}</span>
                                <span className="text-gold">${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            </div>
                          ))}
                          <div className="border-t border-white/5 pt-2 flex justify-between">
                            <span className="text-white/50 text-sm font-khmer">{'\u179f\u179a\u17bb\u1794'}</span>
                            <span className="text-gold font-bold">${order.totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Payment Proof / Receipt Image */}
                      {(() => {
                        const receiptUrl = order.paymentProof || order.bakongReceipts?.[0]?.receiptImageUrl
                        if (!receiptUrl) return (
                          <div className="bg-obsidian-50 rounded-lg p-3">
                            <p className="text-white/30 text-xs mb-2 font-khmer">{'បង្កាន់ដៃបង់ប្រាក់'}</p>
                            <div className="bg-white/5 rounded-lg p-6 text-center border border-dashed border-white/10">
                              <p className="text-white/20 text-sm">{'មិនមានរូបភាពបង្កាន់ដៃ'}</p>
                              <p className="text-white/10 text-xs mt-1">{'No receipt image uploaded'}</p>
                            </div>
                          </div>
                        )
                        return (
                          <div className="bg-obsidian-50 rounded-lg p-3">
                            <p className="text-white/30 text-xs mb-2 font-khmer">{'បង្កាន់ដៃបង់ប្រាក់'}</p>
                            <a href={receiptUrl} target="_blank" rel="noopener noreferrer" className="block">
                              <img
                                src={receiptUrl}
                                alt="Payment receipt"
                                className="max-w-sm w-full rounded-lg border border-white/10 hover:border-neon/30 transition-colors cursor-pointer"
                              />
                            </a>
                            <p className="text-white/20 text-[10px] mt-1">{'ចុចលើរូបភាពដើម្បីពង្រីក'}</p>
                          </div>
                        )
                      })()}

                      <div className="flex items-center gap-3">
                        <span className="text-white/40 text-xs font-khmer">{'\u1780\u17c2\u179f\u1798\u17d2\u179a\u17bd\u179b\u179f\u17d2\u1790\u17b6\u1793\u1797\u17b6\u1796:'}</span>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          disabled={updatingId === order.id}
                          className="bg-obsidian-50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white/70
                                     focus:outline-none focus:border-neon/30 disabled:opacity-50"
                        >
                          {allStatuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        {updatingId === order.id && (
                          <div className="w-4 h-4 border-2 border-neon border-t-transparent rounded-full animate-spin" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
