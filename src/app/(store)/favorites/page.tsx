'use client'

// ទំព័រចំណូលចិត្ត
import { motion } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'

export default function FavoritesPage() {
  const { t, locale } = useTranslation()

  return (
    <div className="cyber-grid-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-gradient-to-b from-neon to-transparent rounded-full" />
          <h1 className="text-2xl font-display font-bold text-white">{t('favorites')}</h1>
        </div>

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
      </div>
    </div>
  )
}
