'use client'

// កាត ផលិតផល - រចនាប័ទ្ម Gaming
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { useStore } from '@/store/useStore'
import { getProductImage } from '@/lib/product-images'

interface ProductCardProps {
  id: string
  slug: string
  nameKm: string
  nameEn: string
  price: number
  originalPrice?: number
  image: string
  stockStatus: string
  isFeatured?: boolean
}

export default function ProductCard({
  id,
  slug,
  nameKm,
  nameEn,
  price,
  originalPrice,
  image,
  stockStatus,
  isFeatured,
}: ProductCardProps) {
  const { t, locale } = useTranslation()
  const addToCart = useStore((s) => s.addToCart)
  const toggleFavorite = useStore((s) => s.toggleFavorite)
  const isFavorite = useStore((s) => s.isFavorite)
  const name = locale === 'km' ? nameKm : nameEn
  const resolvedImage = getProductImage(nameEn || slug, image)
  const favorited = isFavorite(id)

  const statusColors: Record<string, string> = {
    IN_STOCK: 'text-green-400',
    OUT_OF_STOCK: 'text-red-400',
    LOW_STOCK: 'text-orange-400',
    PRE_ORDER: 'text-neon',
  }

  const statusText: Record<string, string> = {
    IN_STOCK: t('inStock'),
    OUT_OF_STOCK: t('outOfStock'),
    LOW_STOCK: t('lowStock'),
    PRE_ORDER: t('preOrder'),
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (stockStatus === 'OUT_OF_STOCK') return
    addToCart({
      productId: id,
      name,
      price,
      image: resolvedImage,
      quantity: 1,
    })
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(id)
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/product/${slug}`} className="block card-gaming group">
        {/* រូបភាព */}
        <div className="relative aspect-square overflow-hidden bg-obsidian-100">
          <Image
            src={resolvedImage}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Badge ពិសេស */}
          {isFeatured && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-gold/90 rounded text-obsidian text-xs font-bold">
              {t('featured')}
            </div>
          )}

          {/* Discount Badge */}
          {originalPrice && originalPrice > price && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-red-500/90 rounded text-white text-xs font-bold">
              -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
            </div>
          )}

          {/* Favorite Heart Button */}
          <button
            onClick={handleToggleFavorite}
            className="absolute bottom-2 right-2 z-10 w-10 h-10 flex items-center justify-center
                       rounded-full bg-obsidian/60 backdrop-blur-sm border border-white/10
                       hover:border-red-400/40 transition-all duration-200"
          >
            <svg
              className={`w-6 h-6 transition-colors duration-200 ${
                favorited ? 'text-red-500 fill-red-500' : 'text-white/50 hover:text-red-400'
              }`}
              fill={favorited ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Overlay ប៊ូតុង */}
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
            <button
              onClick={handleAddToCart}
              disabled={stockStatus === 'OUT_OF_STOCK'}
              className="w-full btn-neon text-xs py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {stockStatus === 'OUT_OF_STOCK' ? t('outOfStock') : t('addToCart')}
            </button>
          </div>
        </div>

        {/* ព័ត៌មាន */}
        <div className="p-3">
          <h3 className="text-sm text-white/80 font-khmer line-clamp-2 mb-2 group-hover:text-neon transition-colors">
            {name}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-gold font-bold text-lg">${price.toFixed(2)}</span>
              {originalPrice && originalPrice > price && (
                <span className="text-white/30 text-xs line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className={`text-xs ${statusColors[stockStatus] || 'text-white/40'}`}>
              {statusText[stockStatus] || stockStatus}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
