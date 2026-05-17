'use client'

// ទំព័រចំណូលចិត្ត
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '@/components/home/ProductCard'
import { useTranslation } from '@/hooks/useTranslation'
import { useStore } from '@/store/useStore'

const allProducts = [
  { id: '1', slug: 'chatgpt-plus-1month', nameKm: 'ChatGPT Plus - ១ ខែ', nameEn: 'ChatGPT Plus - 1 Month', price: 9.99, originalPrice: 20.00, image: '/images/logo.jpg', stockStatus: 'IN_STOCK', isFeatured: true },
  { id: '2', slug: 'chatgpt-plus-3months', nameKm: 'ChatGPT Plus - ៣ ខែ', nameEn: 'ChatGPT Plus - 3 Months', price: 24.99, originalPrice: 60.00, image: '/images/logo.jpg', stockStatus: 'IN_STOCK', isFeatured: true },
  { id: '3', slug: 'netflix-premium', nameKm: 'Netflix Premium - ១ ខែ', nameEn: 'Netflix Premium - 1 Month', price: 5.99, image: '/images/logo.jpg', stockStatus: 'IN_STOCK', isFeatured: false },
  { id: '4', slug: 'spotify-premium', nameKm: 'Spotify Premium - ១ ខែ', nameEn: 'Spotify Premium - 1 Month', price: 3.99, image: '/images/logo.jpg', stockStatus: 'LOW_STOCK', isFeatured: false },
  { id: '5', slug: 'youtube-premium', nameKm: 'YouTube Premium - ១ ខែ', nameEn: 'YouTube Premium - 1 Month', price: 4.99, image: '/images/logo.jpg', stockStatus: 'IN_STOCK', isFeatured: false },
  { id: '6', slug: 'canva-pro', nameKm: 'Canva Pro - ១ ខែ', nameEn: 'Canva Pro - 1 Month', price: 6.99, originalPrice: 12.99, image: '/images/logo.jpg', stockStatus: 'IN_STOCK', isFeatured: true },
  { id: '7', slug: 'adobe-creative', nameKm: 'Adobe Creative Cloud - ១ ខែ', nameEn: 'Adobe Creative Cloud - 1 Month', price: 14.99, image: '/images/logo.jpg', stockStatus: 'PRE_ORDER', isFeatured: false },
  { id: '8', slug: 'discord-nitro', nameKm: 'Discord Nitro - ១ ខែ', nameEn: 'Discord Nitro - 1 Month', price: 4.49, image: '/images/logo.jpg', stockStatus: 'IN_STOCK', isFeatured: false },
]

export default function FavoritesPage() {
  const { t, locale } = useTranslation()
  const favorites = useStore((s) => s.favorites)

  const favoriteProducts = useMemo(
    () => allProducts.filter((p) => favorites.includes(p.id)),
    [favorites]
  )

  return (
    <div className="cyber-grid-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-gradient-to-b from-neon to-transparent rounded-full" />
          <h1 className="text-2xl font-display font-bold text-white">{t('favorites')}</h1>
          {favoriteProducts.length > 0 && (
            <span className="text-white/40 text-sm">({favoriteProducts.length})</span>
          )}
        </div>

        {favoriteProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <svg className="w-20 h-20 text-white/10 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p className="text-white/30 font-khmer">
              {locale === 'km' ? 'មិនទាន់មានផលិតផលចំណូលចិត្តទេ' : 'No favorite products yet'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {favoriteProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ProductCard {...product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
