'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface OrderResult {
  orderNumber: string
  status: string
  deliveryStatus: string | null
  totalAmount: number
  paymentMethod: string
  createdAt: string
  items: Array<{
    productName: string
    productNameKm: string
    quantity: number
    price: number
  }>
  deliveredKeys: string[]
}

const STATUS_LABELS: Record<string, { en: string; km: string; color: string }> = {
  PENDING: { en: 'Pending', km: 'កំពុងរង់ចាំ', color: 'text-yellow-400' },
  PAYMENT_UPLOADED: { en: 'Payment Uploaded', km: 'បង់ប្រាក់រួច', color: 'text-blue-400' },
  PAYMENT_VERIFIED: { en: 'Payment Verified', km: 'ផ្ទៀងផ្ទាត់រួច', color: 'text-cyan-400' },
  PROCESSING: { en: 'Processing', km: 'កំពុងដំណើរការ', color: 'text-orange-400' },
  COMPLETED: { en: 'Delivered', km: 'បានជូនដំណឹង', color: 'text-green-400' },
  CANCELLED: { en: 'Cancelled', km: 'បានលុបចោល', color: 'text-red-400' },
}

export default function OrderLookup({ locale }: { locale: string }) {
  const [orderNumber, setOrderNumber] = useState('')
  const [result, setResult] = useState<OrderResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleLookup = useCallback(async () => {
    if (!orderNumber.trim()) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/orders/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber: orderNumber.trim() }),
      })
      const data = await res.json()
      if (res.ok) {
        setResult(data.order)
      } else {
        setError(
          locale === 'km'
            ? 'រកមិនឃើញការបញ្ជាទិញ។ សូមពិនិត្យលេខបញ្ជាទិញរបស់អ្នក។'
            : 'Order not found. Please check your order number.'
        )
      }
    } catch {
      setError(locale === 'km' ? 'កំហុសបណ្តាញ' : 'Network error')
    } finally {
      setLoading(false)
    }
  }, [orderNumber, locale])

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  return (
    <section className="card-gaming p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-8 bg-gradient-to-b from-neon to-transparent rounded-full" />
        <h2 className="text-xl font-display font-bold text-white font-khmer">
          {locale === 'km' ? 'ពិនិត្យការបញ្ជាទិញ' : 'Check Order'}
        </h2>
      </div>
      <p className="text-white/40 text-sm mb-4 font-khmer">
        {locale === 'km'
          ? 'បញ្ចូលលេខបញ្ជាទិញដើម្បីពិនិត្យមើលស្ថានភាព'
          : 'Enter your order number to check status'}
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          value={orderNumber}
          onChange={(e) => { setOrderNumber(e.target.value); setError('') }}
          onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
          placeholder={locale === 'km' ? 'ORD-XXXXXXXXX...' : 'ORD-XXXXXXXXX...'}
          className="flex-1 bg-obsidian border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:border-neon/50 focus:outline-none font-mono"
        />
        <button
          onClick={handleLookup}
          disabled={loading || !orderNumber.trim()}
          className="btn-neon text-sm px-5 py-2.5 disabled:opacity-40"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            locale === 'km' ? 'ពិនិត្យ' : 'Check'
          )}
        </button>
      </div>

      {error && (
        <p className="text-red-400 text-xs mt-2">{error}</p>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 bg-white/5 rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-neon font-mono text-sm font-bold">{result.orderNumber}</span>
              <span className={`text-xs font-bold ${STATUS_LABELS[result.status]?.color || 'text-white/50'}`}>
                {locale === 'km' ? STATUS_LABELS[result.status]?.km : STATUS_LABELS[result.status]?.en || result.status}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {result.items.map((item, i) => (
                <div key={i} className="flex justify-between text-white/50">
                  <span>{locale === 'km' ? item.productNameKm || item.productName : item.productName} x{item.quantity}</span>
                  <span className="text-gold">${item.price.toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-white/5 pt-2 flex justify-between">
                <span className="text-white/40 font-semibold">{locale === 'km' ? 'សរុប' : 'Total'}</span>
                <span className="text-gold font-bold">${result.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Delivered Keys */}
            {result.deliveredKeys.length > 0 && (
              <div className="mt-3 pt-3 border-t border-white/5">
                <p className="text-green-400 text-xs font-semibold mb-2">
                  {locale === 'km' ? 'Card Key របស់អ្នក:' : 'Your Card Key(s):'}
                </p>
                {result.deliveredKeys.map((key, i) => (
                  <div key={i} className="flex items-center gap-2 bg-green-500/5 rounded-lg px-3 py-2 mb-1">
                    <span className="text-green-400 font-mono text-sm flex-1 select-all">{key}</span>
                    <button
                      onClick={() => handleCopy(key)}
                      className="text-[10px] text-green-400/60 hover:text-green-400 px-2 py-0.5 rounded border border-green-500/20"
                    >
                      {copied ? (locale === 'km' ? 'បានចម្លង' : 'Copied') : (locale === 'km' ? 'ចម្លង' : 'Copy')}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
