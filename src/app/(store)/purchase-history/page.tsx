'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import OrderStatusSteps from '@/components/orders/OrderStatusSteps'

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
  currency: string
  paymentMethod: string | null
  createdAt: string
  items: OrderItem[]
}

const statusColors: Record<string, string> = {
  PENDING: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  PROCESSING: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  PAYMENT_UPLOADED: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  PAYMENT_VERIFIED: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  COMPLETED: 'text-green-400 bg-green-400/10 border-green-400/20',
  CANCELLED: 'text-red-400 bg-red-400/10 border-red-400/20',
  REFUNDED: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
}

const statusLabels: Record<string, { km: string; en: string }> = {
  PENDING: { km: 'កំពុងរង់ចាំ', en: 'Pending' },
  PROCESSING: { km: 'កំពុងដំណើរការ', en: 'Processing' },
  PAYMENT_UPLOADED: { km: 'បានផ្ទុកបង្កាន់ដៃ', en: 'Payment Uploaded' },
  PAYMENT_VERIFIED: { km: 'បានផ្ទៀងផ្ទាត់', en: 'Payment Verified' },
  COMPLETED: { km: 'បានបញ្ចប់', en: 'Completed' },
  CANCELLED: { km: 'បានបោះបង់', en: 'Cancelled' },
  REFUNDED: { km: 'បានបង្វិលប្រាក់', en: 'Refunded' },
}

export default function PurchaseHistoryPage() {
  const { data: session, status: authStatus } = useSession()
  const { locale } = useTranslation()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

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
    if (session?.user) fetchOrders()
    else setLoading(false)
  }, [session, fetchOrders])

  if (authStatus === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="cyber-grid-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50 font-khmer mb-4">
            {locale === 'km' ? 'សូមចូលគណនីដើម្បីមើលប្រវត្តិការទិញ' : 'Please login to view your purchase history'}
          </p>
          <Link href="/login" className="btn-neon text-sm">
            {locale === 'km' ? 'ចូលគណនី' : 'Login'}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cyber-grid-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-gradient-to-b from-neon to-transparent rounded-full" />
          <h1 className="text-2xl font-display font-bold text-white">
            {locale === 'km' ? 'ប្រវត្តិការទិញ' : 'Purchase History'}
          </h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto text-white/10 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-white/30 font-khmer">
              {locale === 'km' ? 'មិនមានការបញ្ជាទិញនៅឡើយ' : 'No orders yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card-gaming p-4 sm:p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white font-semibold text-sm">{order.orderNumber}</p>
                    <p className="text-white/40 text-xs mt-1">
                      {new Date(order.createdAt).toLocaleDateString(locale === 'km' ? 'km-KH' : 'en-US', {
                        year: 'numeric', month: 'long', day: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[order.status] || 'text-white/50'}`}>
                    {statusLabels[order.status]?.[locale] || order.status}
                  </span>
                </div>

                {/* Step-by-step status */}
                <div className="border-t border-white/5 pt-3">
                  <OrderStatusSteps currentStatus={order.status} locale={locale} />
                </div>

                <div className="border-t border-white/5 pt-3 mt-3 space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-white/60">
                        {item.product
                          ? (locale === 'km' ? item.product.nameKm : item.product.nameEn)
                          : item.productId}
                        {' '}x{item.quantity}
                      </span>
                      <span className="text-gold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/5 pt-3 mt-3 flex justify-between">
                  <span className="text-white/60 font-khmer text-sm">
                    {locale === 'km' ? '\u179f\u179a\u17bb\u1794' : 'Total'}
                  </span>
                  <span className="text-gold font-bold">${order.totalAmount.toFixed(2)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
