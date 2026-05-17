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

                {/* Order ID for reference */}
                <div className="border-t border-white/5 pt-3 mt-3">
                  <p className="text-white/30 text-xs">
                    {locale === 'km' ? 'លេខកូដបញ្ជាទិញ: ' : 'Order ID: '}
                    <span className="text-white/50 font-mono">{order.orderNumber}</span>
                  </p>
                </div>

                {/* Payment confirmed - contact admin message */}
                {(order.status === 'PAYMENT_VERIFIED' || order.status === 'COMPLETED') && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-t border-green-500/20 pt-3 mt-3"
                  >
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                      <div className="w-10 h-10 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-2">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-green-400 text-sm font-semibold font-khmer mb-1">
                        {locale === 'km'
                          ? 'ការបង់ប្រាក់របស់អ្នកត្រូវបានផ្ទៀងផ្ទាត់!'
                          : 'Your payment has been verified!'}
                      </p>
                      <p className="text-white/50 text-xs font-khmer mb-3">
                        {locale === 'km'
                          ? 'សូមទាក់ទង Admin ដើម្បីទទួលផលិតផលរបស់អ្នក។ សូមអរគុណ!'
                          : 'Please contact Admin to receive your order. Thank you!'}
                      </p>
                      <a
                        href="https://t.me/AF4STURF"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-neon/20 to-blue-600/20
                                   border border-neon/30 text-neon text-sm font-semibold px-5 py-2.5
                                   rounded-xl hover:from-neon/30 hover:to-blue-600/30 transition-all font-khmer"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                        </svg>
                        {locale === 'km' ? 'ទាក់ទង Admin' : 'Contact Admin'}
                      </a>
                    </div>
                  </motion.div>
                )}

                {/* Processing status - waiting message */}
                {order.status === 'PROCESSING' && (
                  <div className="border-t border-blue-500/20 pt-3 mt-3">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center">
                      <p className="text-blue-400 text-xs font-khmer">
                        {locale === 'km'
                          ? 'ការបញ្ជាទិញរបស់អ្នកកំពុងដំណើរការ។ សូមរង់ចាំ...'
                          : 'Your order is being processed. Please wait...'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Payment uploaded - waiting for verification */}
                {order.status === 'PAYMENT_UPLOADED' && (
                  <div className="border-t border-orange-500/20 pt-3 mt-3">
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 text-center">
                      <p className="text-orange-400 text-xs font-khmer">
                        {locale === 'km'
                          ? 'បានផ្ទុកបង្កាន់ដៃ។ កំពុងរង់ចាំការផ្ទៀងផ្ទាត់ពី Admin...'
                          : 'Receipt uploaded. Waiting for Admin verification...'}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
