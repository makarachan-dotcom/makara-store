'use client'

// ទំព័រប្រភេទផលិតផល
import { useState } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '@/components/home/ProductCard'
import { useTranslation } from '@/hooks/useTranslation'

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

const categoryMap: Record<string, string[]> = {
  'ChatGPT': ['chatgpt'],
  'Streaming': ['netflix', 'spotify', 'youtube'],
  'Design': ['canva', 'adobe'],
  'Gaming': ['discord'],
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { t, locale } = useTranslation()
  const [activeFilter, setActiveFilter] = useState<string>(locale === 'km' ? 'ទាំងអស់' : 'All')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="cyber-grid-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ក្បាល */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-gradient-to-b from-neon to-transparent rounded-full" />
          <h1 className="text-2xl font-display font-bold text-white">
            {t('products')}
          </h1>
        </div>

        {/* តម្រង */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[locale === 'km' ? 'ទាំងអស់' : 'All', 'ChatGPT', 'Streaming', 'Design', 'Gaming'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 text-sm rounded-lg border font-khmer transition-all ${
                activeFilter === filter
                  ? 'bg-neon/10 border-neon/30 text-neon'
                  : 'border-white/10 text-white/40 hover:border-neon/20 hover:text-white/60'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* ក្រឡាចត្រង្គផលិតផល */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {allProducts
            .filter((product) => {
              const allLabel = locale === 'km' ? 'ទាំងអស់' : 'All'
              if (activeFilter === allLabel) return true
              const keywords = categoryMap[activeFilter] || []
              return keywords.some((kw) => product.slug.toLowerCase().includes(kw))
            })
            .map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard {...product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
