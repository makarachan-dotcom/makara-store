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
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 pb-32 sm:pb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-neon to-transparent rounded-full" />
            <h1 className="text-xl sm:text-2xl font-display font-bold text-white">{t('cart')}</h1>
          </div>
          <span className="text-white/40 text-sm font-khmer">
            {cart.length} {locale === 'km' ? 'ផលិតផល' : 'items'}
          </span>
        </div>

        <div className="space-y-3">
          {cart.map((item, index) => (
            <motion.div
              key={item.productId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card-gaming p-3 sm:p-4"
            >
              {/* Mobile: stacked layout / Desktop: row layout */}
              <div className="flex items-start gap-3">
                {/* Product Image */}
                <div className="relative w-20 h-20 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm text-white/80 font-khmer line-clamp-2 mb-1">{item.name}</h3>
                  <p className="text-gold font-bold text-base">${item.price.toFixed(2)}</p>

                  {/* Quantity Controls + Delete - Mobile Friendly */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-neon/20 rounded-lg overflow-hidden">
                      <button onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center text-white/60 hover:text-neon hover:bg-neon/5 text-lg font-bold active:bg-neon/10 transition-colors">-</button>
                      <span className="w-10 h-9 sm:h-8 flex items-center justify-center text-white text-sm border-x border-neon/20 font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center text-white/60 hover:text-neon hover:bg-neon/5 text-lg font-bold active:bg-neon/10 transition-colors">+</button>
                    </div>

                    <div className="flex items-center gap-3">
                      <p className="text-gold font-bold text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button onClick={() => removeFromCart(item.productId)}
                        className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-400/10 active:bg-red-400/20 transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* សរុប - Fixed bottom on mobile */}
        <div className="fixed bottom-16 left-0 right-0 sm:relative sm:bottom-auto sm:mt-8 z-40">
          <div className="card-gaming p-4 sm:p-6 mx-3 sm:mx-0 mb-2 sm:mb-0 border-t border-neon/10 sm:border-t-0
                          shadow-[0_-4px_20px_rgba(0,0,0,0.5)] sm:shadow-none backdrop-blur-md sm:backdrop-blur-none">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-white/60 font-khmer text-sm sm:text-base">{t('orderTotal')}</span>
              <span className="text-xl sm:text-2xl font-bold text-gold text-glow-gold">
                ${getCartTotal().toFixed(2)}
              </span>
            </div>
            <Link href="/checkout" className="block w-full btn-gold text-center py-3 sm:py-2 text-base sm:text-sm font-bold rounded-xl">
              {t('checkout')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
