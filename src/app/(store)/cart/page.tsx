'use client'

// ទំព័រកន្ត្រក
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { useStore } from '@/store/useStore'

export default function CartPage() {
  const { t, locale } = useTranslation()
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useStore()

  if (cart.length === 0) {
    return (
      <div className="cyber-grid-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="w-20 h-20 mx-auto text-white/10 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          <p className="text-white/30 font-khmer mb-4">
            {locale === 'km' ? 'កន្ត្រករបស់អ្នកទទេ' : 'Your cart is empty'}
          </p>
          <Link href="/" className="btn-neon text-sm">{t('home')}</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cyber-grid-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-gradient-to-b from-neon to-transparent rounded-full" />
          <h1 className="text-2xl font-display font-bold text-white">{t('cart')}</h1>
        </div>

        <div className="space-y-4">
          {cart.map((item, index) => (
            <motion.div
              key={item.productId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card-gaming p-4 flex items-center gap-4"
            >
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm text-white/80 font-khmer truncate">{item.name}</h3>
                <p className="text-gold font-bold">${item.price.toFixed(2)}</p>
              </div>

              <div className="flex items-center border border-neon/20 rounded-lg overflow-hidden">
                <button onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                  className="px-2 py-1 text-white/60 hover:text-neon text-sm">-</button>
                <span className="px-3 py-1 text-white text-sm border-x border-neon/20">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="px-2 py-1 text-white/60 hover:text-neon text-sm">+</button>
              </div>

              <p className="text-gold font-bold text-sm w-20 text-right">
                ${(item.price * item.quantity).toFixed(2)}
              </p>

              <button onClick={() => removeFromCart(item.productId)}
                className="text-red-400/60 hover:text-red-400 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </motion.div>
          ))}
        </div>

        {/* សរុប */}
        <div className="mt-8 card-gaming p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/60 font-khmer">{t('orderTotal')}</span>
            <span className="text-2xl font-bold text-gold text-glow-gold">
              ${getCartTotal().toFixed(2)}
            </span>
          </div>
          <Link href="/checkout" className="block w-full btn-gold text-center">
            {t('checkout')}
          </Link>
        </div>
      </div>
    </div>
  )
}
