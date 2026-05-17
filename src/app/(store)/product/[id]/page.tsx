'use client'

// ទំព័រព័ត៌មានផលិតផល
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { useStore } from '@/store/useStore'
import { getProductImage } from '@/lib/product-images'

interface ProductData {
  id: string
  slug: string
  nameKm: string
  nameEn: string
  descriptionKm?: string
  descriptionEn?: string
  price: number
  originalPrice?: number | null
  image: string | null
  images: string[]
  stockStatus: string
  isFeatured: boolean
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { t, locale } = useTranslation()
  const addToCart = useStore((s) => s.addToCart)
  const router = useRouter()
  const { data: session } = useSession()
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchProduct = useCallback(async () => {
    try {
      const res = await fetch(`/api/products/${params.id}`)
      if (!res.ok) {
        setError(true)
        return
      }
      const data = await res.json()
      setProduct(data.product)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => { fetchProduct() }, [fetchProduct])

  if (loading) {
    return (
      <div className="cyber-grid-bg min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="cyber-grid-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50 font-khmer mb-4">
            {locale === 'km' ? 'រកមិនឃើញផលិតផល' : 'Product not found'}
          </p>
          <Link href="/" className="btn-neon text-sm">
            {locale === 'km' ? 'ត្រឡប់ទៅទំព័រដើម' : 'Back to Home'}
          </Link>
        </div>
      </div>
    )
  }

  const name = locale === 'km' ? product.nameKm : product.nameEn
  const description = locale === 'km' ? product.descriptionKm : product.descriptionEn
  const productImage = getProductImage(product.nameEn || product.slug, product.image)

  const handleAddToCart = () => {
    if (!session) {
      router.push('/login')
      return
    }
    addToCart({
      productId: product.id,
      name,
      price: product.price,
      image: productImage,
      quantity,
    })
  }

  const handleBuyNow = () => {
    if (!session) {
      router.push('/login')
      return
    }
    addToCart({
      productId: product.id,
      name,
      price: product.price,
      image: productImage,
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
              src={productImage}
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
            {description && (
              <div className="border-t border-neon/10 pt-4">
                <p className="text-white/50 font-khmer leading-relaxed text-sm">
                  {description}
                </p>
              </div>
            )}

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

            {/* Login prompt */}
            {!session && (
              <p className="text-white/40 text-xs font-khmer text-center">
                {locale === 'km'
                  ? 'សូមចូលគណនីមុនពេលទិញផលិតផល'
                  : 'Please log in before purchasing products'}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
