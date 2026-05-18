'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { useStore } from '@/store/useStore'

export default function CheckoutPage() {
  const { t, locale } = useTranslation()
  const { cart, getCartTotal } = useStore()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedMethod, setSelectedMethod] = useState<'bakong' | 'stripe' | null>(null)
  const [privacyAgreed, setPrivacyAgreed] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    const dismissed = localStorage.getItem('makara-privacy-agreed')
    if (dismissed === 'true') setPrivacyAgreed(true)
  }, [])

  const handleDontShowAgain = () => {
    localStorage.setItem('makara-privacy-agreed', 'true')
    setPrivacyAgreed(true)
    setShowPrivacyModal(false)
  }

  const handleContinue = async () => {
    if (!selectedMethod || cart.length === 0) return
    setCreating(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          bank: selectedMethod === 'bakong' ? 'BAKONG_KHQR' : 'STRIPE',
          totalAmount: getCartTotal(),
        }),
      })
      const data = await res.json()
      if (data.order?.id) {
        router.push(selectedMethod === 'bakong'
          ? `/checkout/bakong?orderId=${data.order.id}`
          : `/checkout/stripe?orderId=${data.order.id}`)
      }
    } catch {
      // Error
    } finally {
      setCreating(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  if (!session) return null

  return (
    <div className="cyber-grid-bg min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-gradient-to-b from-gold to-transparent rounded-full" />
          <h1 className="text-2xl font-display font-bold text-white">{t('checkout')}</h1>
        </div>

        {!privacyAgreed && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-gaming p-4 mb-6 border border-yellow-500/20">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div className="flex-1">
                <p className="text-white/70 text-sm font-khmer mb-3">
                  {locale === 'km' ? '\u179f\u17bc\u1798\u17a2\u17b6\u1793\u1782\u17c4\u179b\u1780\u17b6\u179a\u178e\u17cd\u17af\u1780\u1787\u1793\u1797\u17b6\u1796\u1798\u17bb\u1793\u1796\u17c1\u179b\u1794\u1793\u17d2\u178f\u17d4' : 'Please read our privacy policy before proceeding.'}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setShowPrivacyModal(true)} className="text-xs text-neon hover:underline">
                    {locale === 'km' ? '\u17a2\u17b6\u1793\u1782\u17c4\u179b\u1780\u17b6\u179a\u178e\u17cd \u2192' : 'Read Policy \u2192'}
                  </button>
                  <button onClick={() => setPrivacyAgreed(true)} className="btn-neon text-xs px-3 py-1">
                    {locale === 'km' ? '\u1781\u17d2\u1789\u17bb\u17c6\u1799\u179b\u17cb\u1796\u17d2\u179a\u1798' : 'I Agree'}
                  </button>
                  <button onClick={handleDontShowAgain} className="text-xs text-white/40 hover:text-white/60">
                    {locale === 'km' ? "\u1780\u17bb\u17c6\u1794\u1784\u17d2\u17a0\u17b6\u1789\u1798\u17d2\u178f\u1784\u178f\u17c0\u178f" : "Don't show again"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {showPrivacyModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowPrivacyModal(false)}>
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                className="card-gaming p-6 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-neon mb-4">{t('privacyPolicy')}</h3>
                <p className="text-sm text-white/60 mb-4">No Refund Policy: Our services do not allow refunds after a purchase is confirmed.</p>
                <button onClick={() => { setPrivacyAgreed(true); setShowPrivacyModal(false) }} className="btn-gold text-sm w-full">I Agree</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {cart.length === 0 && (
          <div className="card-gaming p-8 text-center">
            <p className="text-white/40 font-khmer mb-4">{locale === 'km' ? '\u1780\u1793\u17d2\u178f\u17d2\u179a\u1780\u179a\u1794\u179f\u17cb\u17a2\u17d2\u1793\u1780\u178f\u178f\u17c1' : 'Your cart is empty'}</p>
            <Link href="/" className="btn-neon text-sm">{locale === 'km' ? '\u1794\u1793\u17d2\u178f\u178f\u17b7\u1789\u178f\u17c6\u1793\u17b7\u1789' : 'Continue Shopping'}</Link>
          </div>
        )}

        {cart.length > 0 && (
          <>
            <div className="card-gaming p-4 mb-6">
              <h3 className="text-sm text-neon font-semibold mb-3 font-khmer">{locale === 'km' ? '\u179f\u1784\u17d2\u1781\u17c1\u1794\u1780\u17b6\u179a\u1794\u1789\u17d2\u1787\u17b6\u178f\u17b7\u1789' : 'Order Summary'}</h3>
              {cart.map((item) => (
                <div key={item.productId} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded overflow-hidden relative">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="40px" />
                    </div>
                    <span className="text-sm text-white/60 font-khmer">{item.name} x{item.quantity}</span>
                  </div>
                  <span className="text-gold font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-3 mt-2 border-t border-neon/10">
                <span className="font-semibold text-white font-khmer">{t('orderTotal')}</span>
                <span className="text-xl font-bold text-gold">${getCartTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm text-neon font-semibold mb-3 font-khmer">{t('paymentMethod')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={() => setSelectedMethod('bakong')}
                  className={`p-5 rounded-xl border-2 transition-all text-left ${selectedMethod === 'bakong' ? 'border-neon bg-neon/5' : 'border-white/10 hover:border-white/20'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center text-xl">\ud83c\uddf0\ud83c\udded</div>
                    <div>
                      <p className="text-white font-bold text-sm">BAKONG KHQR</p>
                      <p className="text-white/40 text-xs font-khmer">{locale === 'km' ? '\u1794\u1784\u17cb\u178f\u17b6\u1798\u1780\u1798\u17d2\u1798\u179c\u17b7\u1792\u17b8\u1792\u1793\u17b6\u1782\u17b6\u179a\u1780\u1798\u17d2\u1796\u17bb\u1787\u17b6' : 'Pay with Cambodia bank apps'}</p>
                    </div>
                  </div>
                  <ul className="space-y-1 text-xs text-white/50"><li>\u2022 ABA, ACLEDA, Wing, TrueMoney...</li><li>\u2022 Upload receipt \u2192 Admin verifies</li></ul>
                </button>
                <div
                  className="p-5 rounded-xl border-2 border-white/5 bg-white/[0.02] text-left relative opacity-50 cursor-not-allowed">
                  <div className="absolute top-2 right-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                      {locale === 'km' ? 'មកឆាប់' : 'Available Soon'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-xl">\ud83d\udcb3</div>
                    <div>
                      <p className="text-white font-bold text-sm">STRIPE</p>
                      <p className="text-white/40 text-xs font-khmer">{locale === 'km' ? '\u1794\u1784\u17cb\u178f\u17b6\u1798\u1780\u17b6\u178f\u17a2\u1793\u17d2\u178f\u179a\u1787\u17b6\u178f\u17b7' : 'Pay with international card'}</p>
                    </div>
                  </div>
                  <ul className="space-y-1 text-xs text-white/50"><li>\u2022 Visa / Mastercard / UnionPay</li><li>\u2022 Instant auto-delivery</li></ul>
                </div>
              </div>
            </div>

            <button onClick={handleContinue} disabled={!selectedMethod || !privacyAgreed || creating}
              className="w-full btn-gold py-3 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed">
              {creating ? (locale === 'km' ? 'កំពុងបង្កើត...' : 'Creating order...') : selectedMethod === 'bakong' ? (locale === 'km' ? 'បន្តាប់ទៅ KHQR \u2192' : 'Continue to KHQR \u2192') : (locale === 'km' ? 'ជ្រើសរើសវិធីបង់ប្រាក់' : 'Select a payment method')}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
