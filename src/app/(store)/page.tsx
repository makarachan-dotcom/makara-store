'use client'

// ទំព័រដើម - Homepage
import { motion } from 'framer-motion'
import HeroBanner from '@/components/home/HeroBanner'
import ProductCard from '@/components/home/ProductCard'
import PaymentBanner from '@/components/home/PaymentBanner'
import { useTranslation } from '@/hooks/useTranslation'

// ទិន្នន័យគំរូ (នឹងត្រូវជំនួសដោយ API)
const sampleProducts = [
  {
    id: '1',
    slug: 'chatgpt-plus-1month',
    nameKm: 'ChatGPT Plus - ១ ខែ',
    nameEn: 'ChatGPT Plus - 1 Month',
    price: 9.99,
    originalPrice: 20.00,
    image: '/images/logo.jpg',
    stockStatus: 'IN_STOCK',
    isFeatured: true,
  },
  {
    id: '2',
    slug: 'chatgpt-plus-3months',
    nameKm: 'ChatGPT Plus - ៣ ខែ',
    nameEn: 'ChatGPT Plus - 3 Months',
    price: 24.99,
    originalPrice: 60.00,
    image: '/images/logo.jpg',
    stockStatus: 'IN_STOCK',
    isFeatured: true,
  },
  {
    id: '3',
    slug: 'netflix-premium',
    nameKm: 'Netflix Premium - ១ ខែ',
    nameEn: 'Netflix Premium - 1 Month',
    price: 5.99,
    image: '/images/logo.jpg',
    stockStatus: 'IN_STOCK',
    isFeatured: false,
  },
  {
    id: '4',
    slug: 'spotify-premium',
    nameKm: 'Spotify Premium - ១ ខែ',
    nameEn: 'Spotify Premium - 1 Month',
    price: 3.99,
    image: '/images/logo.jpg',
    stockStatus: 'LOW_STOCK',
    isFeatured: false,
  },
  {
    id: '5',
    slug: 'youtube-premium',
    nameKm: 'YouTube Premium - ១ ខែ',
    nameEn: 'YouTube Premium - 1 Month',
    price: 4.99,
    image: '/images/logo.jpg',
    stockStatus: 'IN_STOCK',
    isFeatured: false,
  },
  {
    id: '6',
    slug: 'canva-pro',
    nameKm: 'Canva Pro - ១ ខែ',
    nameEn: 'Canva Pro - 1 Month',
    price: 6.99,
    originalPrice: 12.99,
    image: '/images/logo.jpg',
    stockStatus: 'IN_STOCK',
    isFeatured: true,
  },
  {
    id: '7',
    slug: 'adobe-creative',
    nameKm: 'Adobe Creative Cloud - ១ ខែ',
    nameEn: 'Adobe Creative Cloud - 1 Month',
    price: 14.99,
    image: '/images/logo.jpg',
    stockStatus: 'PRE_ORDER',
    isFeatured: false,
  },
  {
    id: '8',
    slug: 'discord-nitro',
    nameKm: 'Discord Nitro - ១ ខែ',
    nameEn: 'Discord Nitro - 1 Month',
    price: 4.49,
    image: '/images/logo.jpg',
    stockStatus: 'IN_STOCK',
    isFeatured: false,
  },
]

export default function HomePage() {
  const { t, locale } = useTranslation()

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

        {/* ការជូនដំណឹង */}
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

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {sampleProducts
              .filter((p) => p.isFeatured)
              .map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard {...product} />
                </motion.div>
              ))}
          </motion.div>
        </section>

        {/* ផលិតផលទាំងអស់ */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-gold to-transparent rounded-full" />
            <h2 className="text-xl md:text-2xl font-display font-bold text-white">
              {t('products')}
            </h2>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {sampleProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard {...product} />
              </motion.div>
            ))}
          </motion.div>
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
