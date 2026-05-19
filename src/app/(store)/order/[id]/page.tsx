'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'

interface OrderDetails {
  id: string
  orderNumber: string
  status: string
  paymentMethod: string
  totalAmount: number
  deliveryType: string
  createdAt: string
  updatedAt: string
  items: Array<{
    id: string
    productName: string
    quantity: number
    unitPrice: number
  }>
  cardKey?: string
  receiptStatus?: string
}

const statusSteps = [
  { key: 'PENDING', label: 'Order Placed', labelKm: '\u1794\u17B6\u1793\u1794\u1789\u17D2\u1787\u17B6\u1791\u17B7\u1789' },
  { key: 'PAYMENT_UPLOADED', label: 'Payment Uploaded', labelKm: '\u1794\u1784\u17CB\u1794\u17D2\u179A\u17B6\u1780\u17CB\u179A\u17BD\u1785' },
  { key: 'PAYMENT_VERIFIED', label: 'Payment Verified', labelKm: '\u1795\u17D2\u1791\u17C0\u1784\u1795\u17D2\u1791\u17B6\u178F\u17CB\u179A\u17BD\u1785' },
  { key: 'COMPLETED', label: 'Delivered', labelKm: '\u1794\u17B6\u1793\u1787\u17BC\u1793\u178A\u17C6\u178E\u17B9\u1784' },
]

const statusOrder = ['PENDING', 'PROCESSING', 'PAYMENT_UPLOADED', 'PAYMENT_VERIFIED', 'COMPLETED']

export default function OrderTrackingPage() {
  const { locale } = useTranslation()
  const params = useParams()
  const orderId = params.id as string
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`)
      if (!res.ok) {
        setError(locale === 'km' ? '\u179A\u1780\u1798\u17B7\u1793\u1783\u17BE\u1789\u1780\u17B6\u179A\u1794\u1789\u17D2\u1787\u17B6\u1791\u17B7\u1789' : 'Order not found')
        return
      }
      const data = await res.json()
      setOrder(data.order || data)
    } catch {
      setError(locale === 'km' ? '\u1780\u17C6\u17A0\u17BB\u179F\u1794\u1789\u17D2\u1787\u17B6\u179A\u17B7\u1780' : 'Network error')
    } finally {
      setLoading(false)
    }
  }, [orderId, locale])

  useEffect(() => { fetchOrder() }, [fetchOrder])

  // Auto-poll for pending orders
  useEffect(() => {
    if (!order || order.status === 'COMPLETED' || order.status === 'CANCELLED') return
    const interval = setInterval(fetchOrder, 15000)
    return () => clearInterval(interval)
  }, [order, fetchOrder])

  if (loading) {
    return (
      <div className="cyber-grid-bg min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="cyber-grid-bg min-h-screen flex items-center justify-center">
        <div className="card-gaming p-6 text-center max-w-md">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-white/50 mb-4">{error || 'Order not found'}</p>
          <Link href="/" className="btn-neon text-sm">
            {locale === 'km' ? '\u178F\u17D2\u179A\u17A1\u1794\u17CB\u1791\u17C5\u1791\u17C6\u1796\u17D0\u179A\u178A\u17BE\u1798' : 'Back to Home'}
          </Link>
        </div>
      </div>
    )
  }

  const currentStepIdx = statusOrder.indexOf(order.status)
  const isCancelled = order.status === 'CANCELLED' || order.status === 'REFUNDED'

  return (
    <div className="cyber-grid-bg min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          {order.status === 'COMPLETED' ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          ) : isCancelled ? (
            <div className="w-20 h-20 mx-auto bg-red-500/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          ) : (
            <div className="w-20 h-20 mx-auto bg-neon/5 rounded-full flex items-center justify-center mb-4">
              <div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <h1 className="text-2xl font-display font-bold text-white mb-1">
            {order.status === 'COMPLETED'
              ? (locale === 'km' ? '\u1780\u17B6\u179A\u1794\u1789\u17D2\u1787\u17B6\u1791\u17B7\u1789\u1794\u17B6\u1793\u1794\u1789\u17D2\u1785\u1794\u17CB!' : 'Order Delivered!')
              : isCancelled
                ? (locale === 'km' ? '\u1780\u17B6\u179A\u1794\u1789\u17D2\u1787\u17B6\u1791\u17B7\u1789\u178F\u17D2\u179A\u17BC\u179C\u1794\u17B6\u1793\u1794\u17C4\u17C7\u1794\u1784\u17CB' : 'Order Cancelled')
                : (locale === 'km' ? '\u1780\u17C6\u1796\u17BB\u1784\u178A\u17C6\u178E\u17BE\u179A\u1780\u17B6\u179A...' : 'Processing...')}
          </h1>
          <p className="text-neon font-mono text-sm">{order.orderNumber}</p>
        </div>

        {/* Progress Tracker */}
        {!isCancelled && (
          <div className="card-gaming p-6 mb-6">
            <div className="flex items-center justify-between">
              {statusSteps.map((step, i) => {
                const isCompleted = currentStepIdx >= statusOrder.indexOf(step.key)
                const isCurrent = order.status === step.key
                return (
                  <div key={step.key} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                        isCompleted
                          ? 'border-neon bg-neon/10 text-neon'
                          : isCurrent
                            ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                            : 'border-white/10 text-white/20'
                      }`}>
                        {isCompleted && !isCurrent ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          i + 1
                        )}
                      </div>
                      <span className={`text-xs mt-1 text-center whitespace-nowrap ${isCompleted ? 'text-neon' : 'text-white/20'}`}>
                        {locale === 'km' ? step.labelKm : step.label}
                      </span>
                    </div>
                    {i < statusSteps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 mt-[-20px] ${isCompleted && statusOrder.indexOf(statusSteps[i + 1].key) <= currentStepIdx ? 'bg-neon/30' : 'bg-white/5'}`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Order Details */}
        <div className="card-gaming p-6 mb-6">
          <h3 className="text-neon font-semibold text-sm mb-4">
            {locale === 'km' ? '\u1796\u17D0\u178F\u17CC\u1798\u17B6\u1793\u1780\u17B6\u179A\u1794\u1789\u17D2\u1787\u17B6\u1791\u17B7\u1789' : 'Order Details'}
          </h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="text-white text-sm">{item.productName}</p>
                  <p className="text-white/30 text-xs">{locale === 'km' ? '\u1785\u17C6\u1793\u17BD\u1793' : 'Qty'}: {item.quantity}</p>
                </div>
                <span className="text-gold font-bold text-sm">${(item.unitPrice * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-white/5 pt-3 flex justify-between">
              <span className="text-white/50 text-sm font-semibold">{locale === 'km' ? '\u179F\u179A\u17BB\u1794' : 'Total'}</span>
              <span className="text-gold font-bold">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="card-gaming p-6 mb-6">
          <h3 className="text-neon font-semibold text-sm mb-3">
            {locale === 'km' ? '\u1796\u17D0\u178F\u17CC\u1798\u17B6\u1793\u1780\u17B6\u179A\u1794\u1784\u17CB\u1794\u17D2\u179A\u17B6\u1780\u17CB' : 'Payment Info'}
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/40">{locale === 'km' ? '\u179C\u17B7\u1792\u17B8\u1794\u1784\u17CB\u1794\u17D2\u179A\u17B6\u1780\u17CB' : 'Method'}</span>
              <span className="text-white">
                {order.paymentMethod === 'BAKONG' ? '🇰🇭 Bakong KHQR' : '💳 Stripe'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">{locale === 'km' ? '\u1794\u17D2\u179A\u1797\u17C1\u1791\u1780\u17B6\u179A\u1787\u17BC\u1793\u178A\u17C6\u178E\u17B9\u1784' : 'Delivery'}</span>
              <span className="text-white">{order.deliveryType === 'AUTO' ? 'Auto-Delivery' : 'Manual'}</span>
            </div>
          </div>
        </div>

        {/* Card Key (for auto-delivery) */}
        {order.cardKey && order.status === 'COMPLETED' && (
          <div className="card-gaming p-6 mb-6 border border-green-500/20">
            <h3 className="text-green-400 font-semibold text-sm mb-3">
              {locale === 'km' ? 'កូនសោ Card Key របស់អ្នក' : 'Your Card Key'}
            </h3>
            <div className="bg-green-500/5 rounded-lg p-4 text-center">
              <p className="text-green-400 font-mono text-lg tracking-widest select-all">{order.cardKey}</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(order.cardKey || '')
                }}
                className="mt-3 px-4 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs rounded-lg border border-green-500/20 transition-colors"
              >
                {locale === 'km' ? 'ចម្លងកូនសោ' : 'Copy Key'}
              </button>
              <p className="text-white/30 text-xs mt-2">
                {locale === 'km' ? 'ប្រើកូនសោនេះនៅ Self-Service Portal ដើម្បីដំឡើងផលិតផល' : 'Use this key at the Self-Service Portal to activate your product'}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Link href="/" className="flex-1 btn-neon text-sm text-center py-3">
            {locale === 'km' ? '\u178F\u17D2\u179A\u17A1\u1794\u17CB\u1791\u17C5\u1791\u17C6\u1796\u17D0\u179A\u178A\u17BE\u1798' : 'Back to Home'}
          </Link>
          {order.cardKey && order.status === 'COMPLETED' && (
            <Link href="/chatgpt-upgrade" className="flex-1 btn-gold text-sm text-center py-3">
              {locale === 'km' ? 'ប្រើ Card Key' : 'Use Card Key'}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
