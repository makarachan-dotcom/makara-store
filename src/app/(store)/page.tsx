'use client'

// ទំព័រដើម - Homepage - Real Version
import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import HeroBanner from '@/components/home/HeroBanner'
import ProductCard from '@/components/home/ProductCard'
import PaymentBanner from '@/components/home/PaymentBanner'
import { useTranslation } from '@/hooks/useTranslation'
import { getProductImage } from '@/lib/product-images'

interface Product {
  id: string
  slug: string
  nameKm: string
  nameEn: string
  price: number
  originalPrice?: number | null
  image: string | null
  stockStatus: string
  isFeatured: boolean
}

export default function HomePage() {
  const { t, locale } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data.products || [])
    } catch { setProducts([]) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products
    const q = searchQuery.toLowerCase()
    return products.filter(
      (p) => p.nameKm.toLowerCase().includes(q) || p.nameEn.toLowerCase().includes(q) || p.slug.includes(q)
    )
  }, [searchQuery, products])

  const featuredProducts = useMemo(() => filteredProducts.filter((p) => p.isFeatured), [filteredProducts])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="cyber-grid-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">
        {/* Hero Banner */}
        <HeroBanner />

        {/* ស្វែងរកផលិតផល */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={locale === 'km' ? 'ស្វែងរកផលិតផល...' : 'Search products...'}
            className="w-full bg-obsidian-50/80 border border-neon/20 rounded-xl px-4 py-3 pl-10
                       text-white placeholder-white/30 focus:outline-none focus:border-neon/50
                       backdrop-blur-sm transition-colors"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* ការជូនដំណឹង */}
        {!searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-xl border border-neon/20 bg-obsidian-50/50 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0 w-2 h-2 bg-neon rounded-full animate-pulse" />
              <p className="text-sm text-white/60 font-khmer truncate">
                {locale === 'km'
                  ? '🎮 សូមស្វាគមន៍មកកាន់ Makara Store! ទិញផលិតផលឌីជីថលជាមួយតម្លៃពិសេស។'
                  : '🎮 Welcome to Makara Store! Buy digital products at special prices.'}
              </p>
            </div>
          </motion.div>
        )}

        {/* ផលិតផលពិសេស */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-neon to-transparent rounded-full" />
              <h2 className="text-xl md:text-2xl font-display font-bold text-white">
                {t('featured')}
                <span className="text-gold ml-2">⚡</span>
              </h2>
            </div>
            <a href="/category/all" className="text-sm text-neon hover:underline font-khmer">
              {locale === 'km' ? 'មើលទាំងអស់ →' : 'View All →'}
            </a>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin" />
            </div>
          ) : featuredProducts.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {featuredProducts.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard {...product} image={getProductImage(product.nameEn || product.slug, product.image)} originalPrice={product.originalPrice ?? undefined} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="text-white/30 text-center py-8 font-khmer">
              {locale === 'km' ? 'មិនមានផលិតផលពិសេស' : 'No featured products yet'}
            </p>
          )}
        </section>

        {/* ផលិតផលទាំងអស់ */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-gold to-transparent rounded-full" />
            <h2 className="text-xl md:text-2xl font-display font-bold text-white">
              {t('products')}
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredProducts.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {filteredProducts.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard {...product} image={getProductImage(product.nameEn || product.slug, product.image)} originalPrice={product.originalPrice ?? undefined} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="text-white/30 text-center py-8 font-khmer">
              {locale === 'km' ? 'មិនមានផលិតផល - សូមបន្ថែមផលិតផលពីផ្ទាំង Admin' : 'No products yet - Add products from Admin panel'}
            </p>
          )}
        </section>

        {/* ការបង់ប្រាក់ដែលទទួលយក */}
        <PaymentBanner />

        {/* ផ្នែក ChatGPT Upgrade */}
        <section className="relative overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-r from-obsidian-50 to-obsidian-100 p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
              <span className="text-gold text-glow-gold">{t('chatgptUpgrade')}</span>
            </h2>
            <p className="text-white/50 font-khmer mb-6 max-w-lg">
              {locale === 'km'
                ? 'ដំឡើង ChatGPT របស់អ្នកទៅកាន់ Plus ជាមួយតម្លៃសមរម្យបំផុត។'
                : 'Upgrade your ChatGPT to Plus at the most affordable price.'}
            </p>
            <a href="/chatgpt-upgrade" className="btn-gold inline-block text-sm">
              {locale === 'km' ? 'ដំឡើងឥឡូវ →' : 'Upgrade Now →'}
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
