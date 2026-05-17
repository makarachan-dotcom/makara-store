'use client'

// ទំព័រប្រភេទផលិតផល - Real Version with Prisma
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '@/components/home/ProductCard'
import { useTranslation } from '@/hooks/useTranslation'

interface Category {
  id: string
  slug: string
  nameKm: string
  nameEn: string
}

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
  category?: Category | null
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { t, locale } = useTranslation()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/admin/categories'),
      ])
      const productsData = await productsRes.json()
      const categoriesData = await categoriesRes.json()
      setProducts(productsData.products || [])
      setCategories(categoriesData.categories || [])
    } catch {
      setProducts([])
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    if (params.slug && params.slug !== 'all') {
      setActiveFilter(params.slug)
    }
  }, [fetchData, params.slug])

  const filteredProducts = activeFilter === 'all'
    ? products
    : products.filter((p) => p.category?.slug === activeFilter)

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
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 text-sm rounded-lg border font-khmer transition-all ${
              activeFilter === 'all'
                ? 'bg-neon/10 border-neon/30 text-neon'
                : 'border-white/10 text-white/40 hover:border-neon/20 hover:text-white/60'
            }`}
          >
            {locale === 'km' ? 'ទាំងអស់' : 'All'}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.slug)}
              className={`px-4 py-2 text-sm rounded-lg border font-khmer transition-all ${
                activeFilter === cat.slug
                  ? 'bg-neon/10 border-neon/30 text-neon'
                  : 'border-white/10 text-white/40 hover:border-neon/20 hover:text-white/60'
              }`}
            >
              {locale === 'km' ? cat.nameKm : cat.nameEn}
            </button>
          ))}
        </div>

        {/* ក្រឡាចត្រង្គផលិតផល */}
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
                <ProductCard {...product} image={product.image || '/images/logo.jpg'} originalPrice={product.originalPrice ?? undefined} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-white/30 text-center py-8 font-khmer">
            {locale === 'km' ? 'មិនមានផលិតផលក្នុងប្រភេទនេះ' : 'No products in this category'}
          </p>
        )}
      </div>
    </div>
  )
}
