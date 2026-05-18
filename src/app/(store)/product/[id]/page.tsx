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
import { getProductDescription } from '@/lib/product-descriptions'

interface ProductVariant {
  label: string
  labelKm: string
  price: number
  inStock: boolean
}

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
  stockQuantity: number
  isFeatured: boolean
  category?: { slug: string; nameKm: string; nameEn: string }
  metadata?: Record<string, unknown> | null
}

function generateVariants(product: ProductData): ProductVariant[] {
  const n = product.nameEn.toLowerCase()
  if (n.includes('chatgpt') || n.includes('gpt')) {
    return [
      { label: 'Plus Monthly (Direct Charge)', labelKm: 'Plus \u1794\u17d2\u179a\u1785\u17b6\u17c6\u1781\u17c2 (\u1794\u1789\u17d2\u1785\u17bc\u179b\u1795\u17d2\u1791\u17b6\u179b\u17cb)', price: product.price, inStock: product.stockStatus === 'IN_STOCK' },
      { label: 'Plus Monthly (iOS Gift Card)', labelKm: 'Plus \u1794\u17d2\u179a\u1785\u17b6\u17c6\u1781\u17c2 (\u1780\u17b6\u178f\u17a2\u17c6\u178e\u17ad\u1799 iOS)', price: product.price * 1.1, inStock: true },
    ]
  }
  if (n.includes('claude')) {
    return [
      { label: 'Pro Monthly (Direct)', labelKm: 'Pro \u1794\u17d2\u179a\u1785\u17b6\u17c6\u1781\u17c2 (\u1795\u17d2\u1791\u17b6\u179b\u17cb)', price: product.price, inStock: product.stockStatus === 'IN_STOCK' },
      { label: 'Pro Monthly (Account)', labelKm: 'Pro \u1794\u17d2\u179a\u1785\u17b6\u17c6\u1781\u17c2 (\u1782\u178e\u178e\u17b8)', price: product.price * 0.95, inStock: product.stockStatus !== 'OUT_OF_STOCK' },
    ]
  }
  if (n.includes('gemini')) {
    return [{ label: 'Pro Annual (Self-service)', labelKm: 'Pro \u1794\u17d2\u179a\u1785\u17b6\u17c6\u1786\u17d2\u1793\u17b6\u17c6 (\u179f\u17d2\u179c\u17d0\u1799\u179f\u17c1\u179c\u17b6)', price: product.price, inStock: product.stockStatus === 'IN_STOCK' }]
  }
  if (n.includes('grok')) {
    return [{ label: 'SuperGrok Monthly', labelKm: 'SuperGrok \u1794\u17d2\u179a\u1785\u17b6\u17c6\u1781\u17c2', price: product.price, inStock: product.stockStatus === 'IN_STOCK' }]
  }
  if (n.includes('cursor')) {
    return [{ label: 'Pro/Ultra Monthly', labelKm: 'Pro/Ultra \u1794\u17d2\u179a\u1785\u17b6\u17c6\u1781\u17c2', price: product.price, inStock: product.stockStatus === 'IN_STOCK' }]
  }
  return [{ label: 'Standard', labelKm: '\u179f\u17d2\u178f\u1784\u17cb\u178a\u17b6\u179a', price: product.price, inStock: product.stockStatus === 'IN_STOCK' }]
}

function getProductTags(product: ProductData): string[] {
  const n = product.nameEn.toLowerCase()
  if (n.includes('chatgpt') || n.includes('gpt')) return ['ChatGPT', 'OpenAI', 'AI']
  if (n.includes('claude')) return ['Claude', 'Anthropic', 'AI']
  if (n.includes('gemini')) return ['Gemini', 'Google', 'AI']
  if (n.includes('grok')) return ['Grok', 'xAI', 'AI']
  if (n.includes('cursor')) return ['Cursor', 'IDE', 'AI']
  return [product.category?.nameEn || 'Digital', 'AI']
}

function getDeliveryType(product: ProductData): { label: string; labelKm: string; color: string } {
  const n = product.nameEn.toLowerCase()
  if (n.includes('cursor') || n.includes('team') || n.includes('max')) {
    return { label: 'Manual Delivery', labelKm: '\u178a\u17b9\u1780\u1787\u1789\u17d2\u1787\u17bc\u1793\u178a\u17c4\u1799\u1795\u17d2\u1791\u17b6\u179b\u17cb', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' }
  }
  return { label: 'Auto Delivery', labelKm: '\u178a\u17b9\u1780\u1787\u1789\u17d2\u1787\u17bc\u1793\u179f\u17d2\u179c\u17d0\u1799\u1794\u17d2\u179a\u179c\u178f\u17d2\u178f\u17b7', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' }
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
  const [selectedVariant, setSelectedVariant] = useState(0)

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
      <div className="cyber-grid-bg min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square rounded-2xl bg-white/5 animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-white/5 rounded-lg animate-pulse w-3/4" />
              <div className="h-6 bg-white/5 rounded-lg animate-pulse w-1/2" />
              <div className="h-32 bg-white/5 rounded-xl animate-pulse" />
              <div className="h-32 bg-white/5 rounded-xl animate-pulse" />
              <div className="h-14 bg-white/5 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
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
  const variants = generateVariants(product)
  const tags = getProductTags(product)
  const delivery = getDeliveryType(product)
  const richDesc = getProductDescription(product.nameEn || product.slug)
  const currentVariant = variants[selectedVariant]
  const totalPrice = currentVariant.price * quantity

  const handleAddToCart = () => {
    if (!session) { router.push('/login'); return }
    addToCart({ productId: product.id, name, price: currentVariant.price, image: productImage, quantity })
  }

  const handleBuyNow = () => {
    if (!session) { router.push('/login'); return }
    addToCart({ productId: product.id, name, price: currentVariant.price, image: productImage, quantity })
    router.push('/checkout')
  }

  return (
    <div className="cyber-grid-bg min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        {/* Back button */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-4">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-white/40 hover:text-neon transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            {locale === 'km' ? '\u178f\u17d2\u179a\u17a1\u1794\u17cb\u1780\u17d2\u179a\u17c4\u1799' : 'Back'}
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Left Column - Product Image */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="relative aspect-square rounded-2xl overflow-hidden card-gaming sticky top-24">
              <Image src={productImage} alt={name} fill className="object-contain p-8 sm:p-12" priority sizes="(max-width: 1024px) 100vw, 50vw" />
              <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold border ${delivery.color}`}>
                {locale === 'km' ? delivery.labelKm : delivery.label}
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="absolute top-3 right-3 px-3 py-1.5 bg-red-500/90 rounded-lg text-white text-sm font-bold">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column - Product Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="space-y-5">
            {/* Product Name & Tags */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-3 leading-tight">{name}</h1>
              <p className="text-white/40 text-sm mb-3">
                {description || (locale === 'km' ? '\u1795\u179b\u17b7\u178f\u1795\u179b\u178c\u17b8\u1787\u17b8\u178f\u179b\u1796\u17b8 Makara Store' : 'Digital product from Makara Store')}
              </p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/50 text-xs">{tag}</span>
                ))}
              </div>
            </div>

            {/* Select Specifications */}
            <div className="card-gaming p-4 sm:p-5">
              <h3 className="text-sm font-semibold text-neon mb-3 font-khmer flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                {locale === 'km' ? '\u1787\u17d2\u179a\u17be\u179f\u179a\u17be\u179f\u179b\u1780\u17d2\u1781\u178e\u17c8' : 'Select Specifications'}
              </h3>
              <div className="space-y-2">
                {variants.map((variant, index) => (
                  <button
                    key={index}
                    onClick={() => { setSelectedVariant(index); setQuantity(1) }}
                    disabled={!variant.inStock}
                    className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      selectedVariant === index
                        ? 'border-neon bg-neon/5 shadow-[0_0_20px_rgba(0,242,254,0.1)]'
                        : variant.inStock
                          ? 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                          : 'border-white/5 bg-white/[0.01] opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${selectedVariant === index ? 'text-white' : 'text-white/70'}`}>
                        {locale === 'km' ? variant.labelKm : variant.label}
                      </p>
                      {!variant.inStock && <p className="text-xs text-red-400 mt-0.5">{locale === 'km' ? '\u17a2\u179f\u17cb\u179f\u17d2\u178f\u17bb\u1780' : 'Out of stock'}</p>}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`text-sm font-bold ${selectedVariant === index ? 'text-gold' : 'text-white/50'}`}>${variant.price.toFixed(2)}</span>
                      {selectedVariant === index ? (
                        <div className="w-5 h-5 rounded-full bg-neon flex items-center justify-center">
                          <svg className="w-3 h-3 text-obsidian" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                      ) : <div className="w-5 h-5 rounded-full border-2 border-white/20" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Stock & Sales Info */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                <span className="text-white/50">{locale === 'km' ? '\u179f\u17d2\u178f\u17bb\u1780' : 'Stock'}: {product.stockQuantity > 0 ? product.stockQuantity : '\u2014'}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                <span className="text-white/50">{locale === 'km' ? '\u1794\u17b6\u1793\u179b\u1780\u17cb' : 'Sold'}: 99+</span>
              </div>
            </div>

            {/* Quantity & Total */}
            <div className="card-gaming p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-white/40 font-khmer">{locale === 'km' ? '\u1785\u17c6\u178e\u17bd\u1793\u1791\u17b7\u1789' : 'Purchase Quantity'}</span>
                <div className="flex items-center border border-neon/20 rounded-lg overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-neon hover:bg-neon/5 transition-colors text-lg">-</button>
                  <span className="w-12 h-9 flex items-center justify-center text-white border-x border-neon/20 text-sm font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-neon hover:bg-neon/5 transition-colors text-lg">+</button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/40 font-khmer">{locale === 'km' ? '\u178f\u1798\u17d2\u179b\u17c3\u179f\u179a\u17bb\u1794' : 'Total Price'}</span>
                <span className="text-2xl font-bold text-gold text-glow-gold">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Buy Now Button */}
            <button
              onClick={handleBuyNow}
              disabled={!currentVariant.inStock}
              className="w-full py-4 rounded-xl font-bold text-base transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
              {locale === 'km' ? '\u1791\u17b7\u1789\u17a5\u17a1\u17bc\u179c' : 'Buy Now'}
            </button>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!currentVariant.inStock}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 border-2 border-neon/30 text-neon hover:bg-neon/5 hover:border-neon/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {t('addToCart')}
            </button>

            {/* Login prompt */}
            {!session && (
              <p className="text-white/40 text-xs font-khmer text-center">
                {locale === 'km' ? '\u179f\u17bc\u1798\u1785\u17bc\u179b\u1782\u178e\u178e\u17b8\u1798\u17bb\u1793\u1796\u17c1\u179b\u1791\u17b7\u1789\u1795\u179b\u17b7\u178f\u1795\u179b' : 'Please log in before purchasing products'}
              </p>
            )}

            {/* Purchase Understanding */}
            <div className="card-gaming p-4 sm:p-5">
              <h3 className="text-sm font-semibold text-neon mb-3 font-khmer flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {locale === 'km' ? '\u1780\u17b6\u179a\u1799\u179b\u17cb\u178a\u17b9\u1784\u17a2\u17c6\u1796\u17b8\u1780\u17b6\u179a\u1791\u17b7\u1789' : 'Purchase Understanding'}
              </h3>
              <div className="bg-white/[0.03] rounded-lg p-3 mb-3 border border-white/5">
                <p className="text-white/70 text-sm font-medium mb-0.5">{locale === 'km' ? '\u1796\u17d0\u178f\u17cc\u1798\u17b6\u1793\u178a\u17b9\u1780\u1787\u1789\u17d2\u1787\u17bc\u1793' : 'Delivery Information'}</p>
                <p className="text-white/40 text-xs">{locale === 'km' ? '\u1794\u1793\u17d2\u1791\u17b6\u1794\u17cb\u1796\u17b8\u1794\u1789\u17d2\u1787\u17b6\u1791\u17b7\u1789 \u17a2\u17d2\u1793\u1780\u1793\u17b9\u1784\u1791\u1791\u17bd\u179b\u1794\u17b6\u1793\u1796\u17d0\u178f\u17cc\u1798\u17b6\u1793\u1782\u178e\u178e\u17b8 \u17ac\u1780\u17bc\u178a\u1795\u179b\u17b7\u178f\u1795\u179b' : 'After ordering, you will receive account info or product code'}</p>
              </div>
              <div className="space-y-2.5">
                {[
                  { km: '\u1780\u17b6\u179a\u1794\u1784\u17cb\u1794\u17d2\u179a\u17b6\u1780\u17cb\u1793\u17b9\u1784\u178f\u17d2\u179a\u17bc\u179c\u1795\u17d2\u1791\u17c0\u1784\u1795\u17d2\u1791\u17b6\u178f\u17cb\u1780\u17d2\u1793\u17bb\u1784\u179a\u1799\u17c8\u1796\u17c1\u179b \u17e1\u17e0 \u1793\u17b6\u1791\u17b8', en: 'Payment will be verified within 10 minutes' },
                  { km: '\u1796\u17c1\u179b\u1798\u17b6\u1793\u1794\u1789\u17d2\u17a0\u17b6 \u1794\u17d2\u179a\u1796\u17d0\u1793\u17d2\u1792\u1793\u17b9\u1784\u1794\u1784\u17d2\u179c\u17b7\u179b\u1794\u17d2\u179a\u17b6\u1780\u17cb\u178a\u17c4\u1799\u179f\u17d2\u179c\u17d0\u1799\u1794\u17d2\u179a\u179c\u178f\u17d2\u178f\u17b7', en: 'System will auto-refund if issues are encountered' },
                  { km: '\u1785\u17bb\u1785 "\u1791\u17b7\u1789\u17a5\u17a1\u17bc\u179c" \u1798\u17b6\u1793\u1793\u17d0\u1799\u1790\u17b6\u17a2\u17d2\u1793\u1780\u1799\u179b\u17cb\u1796\u17d2\u179a\u1798\u179b\u17be\u179b\u1780\u17d2\u1781\u1781\u178e\u17d2\u178c\u179a\u1794\u179f\u17cb\u1799\u17be\u1784', en: 'Clicking "Buy Now" means you agree to our terms and conditions' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-neon/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed">{locale === 'km' ? item.km : item.en}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Introduction Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="mt-8 lg:mt-12">
          <div className="card-gaming p-5 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-5 h-5 text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <h2 className="text-lg font-display font-bold text-white">{locale === 'km' ? '\u1780\u17b6\u179a\u178e\u17c2\u1793\u17b6\u17c6\u1795\u179b\u17b7\u178f\u1795\u179b' : 'Product Introduction'}</h2>
            </div>
            <div className="text-white/60 space-y-5 text-sm leading-relaxed font-khmer">
              {/* Rich Description */}
              <p className="text-blue-400 font-medium">
                {richDesc
                  ? (locale === 'km' ? richDesc.descKm : richDesc.descEn)
                  : (locale === 'km'
                    ? `\u1794\u17d2\u179a\u17be\u1794\u17d2\u179a\u17b6\u179f\u17cb\u179c\u17b7\u1792\u17b8\u1794\u1784\u17cb\u1794\u17d2\u179a\u17b6\u1780\u17cb\u1795\u17d2\u179b\u17bc\u179c\u1780\u17b6\u179a\u178a\u17be\u1798\u17d2\u1794\u17b8\u178a\u17c6\u17a1\u17be\u1784 ${product.nameEn} \u179b\u17be\u1782\u178e\u178e\u17b8\u179a\u1794\u179f\u17cb\u17a2\u17d2\u1793\u1780\u17d4`
                    : `Use official payment methods to upgrade ${product.nameEn} on your account.`)}
              </p>
              <p>{description || (locale === 'km' ? `${product.nameEn} - \u1795\u179b\u17b7\u178f\u1795\u179b\u178c\u17b8\u1787\u17b8\u178f\u179b\u1782\u17bb\u178e\u1797\u17b6\u1796\u1781\u17d2\u1796\u179f\u17cb\u1796\u17b8 Makara Store\u17d4` : `${product.nameEn} - High quality digital product from Makara Store.`)}</p>

              {/* Upgrade Method */}
              {richDesc && (
                <div className="bg-gradient-to-r from-neon/5 to-transparent border-l-2 border-neon/30 pl-4 py-3">
                  <p className="text-neon font-medium text-xs mb-1">{locale === 'km' ? '\u179c\u17b7\u1792\u17b8\u178a\u17c6\u17a1\u17be\u1784' : 'Upgrade Method'}</p>
                  <p className="text-white/70">{locale === 'km' ? richDesc.upgradeMethodKm : richDesc.upgradeMethod}</p>
                </div>
              )}

              {/* Features List */}
              {richDesc && (
                <div>
                  <h4 className="text-white/80 font-semibold mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                    {locale === 'km' ? '\u1798\u17bb\u1781\u1784\u17b6\u179a\u1796\u17b7\u179f\u17c1\u179f' : 'Key Features'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(locale === 'km' ? richDesc.featuresKm : richDesc.features).map((feature, i) => (
                      <div key={i} className="flex items-start gap-2.5 bg-white/[0.02] rounded-lg px-3 py-2.5 border border-white/5">
                        <div className="w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <span className="text-white/60 text-xs">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price & Account Info */}
              <div className="bg-gradient-to-r from-gold/5 to-transparent border-l-2 border-gold/30 pl-4 py-2">
                <p className="text-gold font-medium mb-2">{product.nameEn} (${product.price.toFixed(2)})</p>
                <p className="text-white/50">{locale === 'km' ? '\u1782\u178e\u178e\u17b8\u1790\u17d2\u1798\u17b8/\u1785\u17b6\u179f\u17cb \u179f\u17bb\u1791\u17d2\u1792\u178f\u17c2\u17a2\u17b6\u1785\u1794\u17d2\u179a\u17be\u1794\u17b6\u1793\u17d4' : 'Works with new/old accounts. Can be renewed early.'}</p>
                {richDesc?.priceNote && (
                  <p className="text-white/40 text-xs mt-1">{locale === 'km' ? richDesc.priceNoteKm : richDesc.priceNote}</p>
                )}
              </div>

              {/* Process */}
              <div>
                <p className="text-white/70 font-medium mb-2">{locale === 'km' ? '\u178a\u17c6\u178e\u17be\u179a\u1780\u17b6\u179a\u17d6' : 'Process:'}</p>
                <p className="text-neon">{locale === 'km' ? '\u1787\u17d2\u179a\u17be\u179f\u179a\u17be\u179f\u1795\u179b\u17b7\u178f\u1795\u179b \u2192 \u1794\u1784\u17cb\u1794\u17d2\u179a\u17b6\u1780\u17cb \u2192 \u1795\u17d2\u1791\u17c0\u1784\u1795\u17d2\u1791\u17b6\u178f\u17cb \u2192 \u1791\u1791\u17bd\u179b\u1795\u179b\u17b7\u178f\u1795\u179b \u2192 \u179a\u17b8\u1780\u179a\u17b6\u1799!' : 'Select product \u2192 Pay \u2192 Verify \u2192 Receive product \u2192 Enjoy!'}</p>
              </div>

              {/* Delivery Time */}
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                <h4 className="text-white/80 font-medium mb-2">{locale === 'km' ? '\u1796\u17c1\u179b\u179c\u17c1\u179b\u17b6\u178a\u17b9\u1780\u1787\u1789\u17d2\u1787\u17bc\u1793' : 'Delivery Time'}</h4>
                <p className="text-white/50">
                  {richDesc
                    ? (locale === 'km' ? richDesc.deliveryTimeKm : richDesc.deliveryTime)
                    : (locale === 'km' ? '\u1787\u17b6\u1791\u17bc\u1791\u17c5 \u17e1\u17e0 \u179c\u17b7\u1793\u17b6\u1791\u17b8 ~ \u17e1 \u1793\u17b6\u1791\u17b8 \u178a\u17be\u1798\u17d2\u1794\u17b8\u1794\u1789\u17d2\u1785\u1794\u17cb\u1780\u17b6\u179a\u178a\u17c6\u17a1\u17be\u1784' : 'Generally 10 seconds ~ 1 minute to complete the upgrade')}
                </p>
              </div>

              {/* FAQ */}
              <div>
                <h4 className="text-white/80 font-medium mb-3">{locale === 'km' ? '\u179f\u17c6\u178e\u17bd\u179a\u1791\u17bc\u1791\u17c5' : 'FAQ'}</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-white/60 font-medium text-xs">{locale === 'km' ? '\u179f\u17c6\u178e\u17bd\u179a: \u178f\u17be\u17a2\u17b6\u1785\u1794\u1784\u17d2\u179c\u17b7\u179b\u1794\u17d2\u179a\u17b6\u1780\u17cb\u179c\u17b7\u1789\u1794\u17b6\u1793\u1791\u17c1?' : 'Q: Can I get a refund?'}</p>
                    <p className="text-white/40 text-xs">{locale === 'km' ? '\u1785\u1798\u17d2\u179b\u17be\u1799: \u1794\u1793\u17d2\u1791\u17b6\u1794\u17cb\u1796\u17b8\u1795\u179b\u17b7\u178f\u1795\u179b\u178f\u17d2\u179a\u17bc\u179c\u1794\u17b6\u1793\u1795\u17d2\u178f\u179b\u17cb \u1798\u17b7\u1793\u17a2\u17b6\u1785\u1794\u1784\u17d2\u179c\u17b7\u179b\u1794\u17d2\u179a\u17b6\u1780\u17cb\u179c\u17b7\u1789\u1794\u17b6\u1793\u1791\u17c1\u17d4' : 'A: After the product is delivered, refunds are not available.'}</p>
                  </div>
                  <div>
                    <p className="text-white/60 font-medium text-xs">{locale === 'km' ? '\u179f\u17c6\u178e\u17bd\u179a: \u178f\u17be\u1798\u17b6\u1793\u1780\u17b6\u179a\u1792\u17b6\u1793\u17b6\u1791\u17c1?' : 'Q: Is there a warranty?'}</p>
                    <p className="text-white/40 text-xs">{locale === 'km' ? '\u1785\u1798\u17d2\u179b\u17be\u1799: \u1798\u17b6\u1793\u1780\u17b6\u179a\u1792\u17b6\u1793\u17b6 \u17e2\u17e4 \u1798\u17c9\u17c4\u1784 \u1794\u17be\u1798\u17b6\u1793\u1794\u1789\u17d2\u17a0\u17b6\u1794\u1785\u17d2\u1785\u17c1\u1780\u1791\u17c1\u179f\u17d4' : 'A: 24-hour warranty for technical issues.'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
