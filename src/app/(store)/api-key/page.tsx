'use client'

// ទំព័រ API Key - មកដល់ឆាប់ៗ
import { motion } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'

export default function ApiKeyPage() {
  const { t, locale } = useTranslation()

  return (
    <div className="cyber-grid-bg min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-gradient-to-b from-neon to-transparent rounded-full" />
          <h1 className="text-2xl font-display font-bold text-white">{t('apiKey')}</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-gaming p-8 text-center relative overflow-hidden"
        >
          {/* Badge "មកដល់ឆាប់ៗ" */}
          <div className="absolute top-4 right-4">
            <motion.span
              animate={{ boxShadow: ['0 0 10px rgba(0,242,254,0.3)', '0 0 20px rgba(0,242,254,0.6)', '0 0 10px rgba(0,242,254,0.3)'] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block px-4 py-1.5 bg-neon/10 border border-neon/30 rounded-full text-neon text-xs font-bold"
            >
              {t('availableSoon')}
            </motion.span>
          </div>

          <div className="py-12">
            {/* រូបតំណាង API */}
            <motion.div
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-neon/20 to-gold/20 
                         border border-neon/20 flex items-center justify-center"
            >
              <svg className="w-12 h-12 text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </motion.div>

            <h2 className="text-2xl font-display font-bold text-white mb-3">API Key Hub</h2>
            <p className="text-white/40 font-khmer max-w-md mx-auto mb-2">
              {locale === 'km'
                ? 'មជ្ឈមណ្ឌល API Key សម្រាប់ការពង្រីកអាជីវកម្ម B2B នឹងមកដល់ឆាប់ៗនេះ។'
                : 'The API Key Hub for B2B expansion will be available soon.'}
            </p>
            <p className="text-neon/60 font-khmer text-sm">
              ({t('availableSoon')})
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
