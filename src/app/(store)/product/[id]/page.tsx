'use client'

// ទំព័រព័ត៌មានផលិតផល
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTranslation } from '@/hooks/useTranslation'
import { useStore } from '@/store/useStore'

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { t, locale } = useTranslation()
  const addToCart = useStore((s) => s.addToCart)
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)

  // ទិន្នន័យគំរូ (នឹងត្រូវជំនួសដោយ API)
  const product = {
    id: params.id,
    slug: params.id,
    nameKm: 'ChatGPT Plus - ១ ខែ',
    nameEn: 'ChatGPT Plus - 1 Month',
    descriptionKm: 'ដំឡើង ChatGPT របស់អ្នកទៅកាន់ Plus សម្រាប់រយៈពេល ១ ខែ។ អ្នកនឹងទទួលបានលទ្ធភាពចូលប្រើ GPT-4, DALL-E 3 និងមុខងារផ្សេងៗទៀត។',
    descriptionEn: 'Upgrade your ChatGPT to Plus for 1 month. You will get access to GPT-4, DALL-E 3, and other features.',
    price: 9.99,
    originalPrice: 20.00,
    image: '/images/logo.jpg',
    images: ['/images/logo.jpg'],
    stockStatus: 'IN_STOCK',
    isFeatured: true,
  }

  const name = locale === 'km' ? product.nameKm : product.nameEn
  const description = locale === 'km' ? product.descriptionKm : product.descriptionEn

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name,
      price: product.price,
      image: product.image,
      quantity,
    })
  }

  const handleBuyNow = () => {
    addToCart({
      productId: product.id,
      name,
      price: product.price,
      image: product.image,
      quantity,
    })
    router.push('/checkout')
  }

  return (
    <div className="cyber-grid-bg min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* រូបភាព */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative aspect-square rounded-2xl overflow-hidden card-gaming"
          >
            <Image
              src={product.image}
              alt={name}
              fill
              className="object-cover"
              priority
            />
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="absolute top-4 right-4 px-3 py-1.5 bg-red-500/90 rounded-lg text-white text-sm font-bold">
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </div>
            )}
          </motion.div>

          {/* ព័ត៌មាន */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
                {name}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gold text-glow-gold">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-white/30 text-lg line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* ស្ថានភាពស្តុក */}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                product.stockStatus === 'IN_STOCK' ? 'bg-green-400' : 'bg-red-400'
              }`} />
              <span className="text-sm text-white/60 font-khmer">
                {product.stockStatus === 'IN_STOCK' ? t('inStock') : t('outOfStock')}
              </span>
            </div>

            {/* ការពិពណ៌នា */}
            <div className="border-t border-neon/10 pt-4">
              <p className="text-white/50 font-khmer leading-relaxed text-sm">
                {description}
              </p>
            </div>

            {/* ចំនួន */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-white/40 font-khmer">
                {locale === 'km' ? 'ចំនួន:' : 'Quantity:'}
              </span>
              <div className="flex items-center border border-neon/20 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-white/60 hover:text-neon hover:bg-neon/5 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 text-white border-x border-neon/20 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-white/60 hover:text-neon hover:bg-neon/5 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* ប៊ូតុងទិញ */}
            <div className="flex gap-3">
              <button onClick={handleAddToCart} className="flex-1 btn-neon">
                {t('addToCart')}
              </button>
              <button onClick={handleBuyNow} className="flex-1 btn-gold">
                {t('buyNow')}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
