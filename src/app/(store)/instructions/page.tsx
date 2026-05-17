'use client'

// ទំព័រសេចក្ដីណែនាំ
import { motion } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'

export default function InstructionsPage() {
  const { t, locale } = useTranslation()

  // ប្រសិនបើមិនមាន video URL សម្រាប់ Admin កំណត់
  // បង្ហាញប៊ូតុង fallback ទៅ Telegram Admin
  const hasVideoUrl = false
  const telegramUrl = 'https://t.me/makara_admin'

  return (
    <div className="cyber-grid-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-gradient-to-b from-neon to-transparent rounded-full" />
          <h1 className="text-2xl font-display font-bold text-white">{t('instructions')}</h1>
        </div>

        <div className="space-y-6">
          {/* ជំហានទី ១ */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-gaming p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-neon/20 flex items-center justify-center text-neon font-bold text-sm">1</span>
              <h3 className="text-lg font-semibold text-white font-khmer">
                {locale === 'km' ? 'ជ្រើសរើសផលិតផល' : 'Select Product'}
              </h3>
            </div>
            <p className="text-white/50 font-khmer text-sm leading-relaxed pl-11">
              {locale === 'km'
                ? 'រុករកទំព័រដើម ឬប្រភេទផលិតផល រួចជ្រើសរើសផលិតផលដែលអ្នកចង់ទិញ។'
                : 'Browse the homepage or product categories and select the product you want to buy.'}
            </p>
          </motion.div>

          {/* ជំហានទី ២ */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-gaming p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-neon/20 flex items-center justify-center text-neon font-bold text-sm">2</span>
              <h3 className="text-lg font-semibold text-white font-khmer">
                {locale === 'km' ? 'បន្ថែមទៅកន្ត្រក និង Checkout' : 'Add to Cart & Checkout'}
              </h3>
            </div>
            <p className="text-white/50 font-khmer text-sm leading-relaxed pl-11">
              {locale === 'km'
                ? 'បន្ថែមផលិតផលទៅកន្ត្រក រួចចូលទៅទំព័របង់ប្រាក់។'
                : 'Add the product to your cart and proceed to the checkout page.'}
            </p>
          </motion.div>

          {/* ជំហានទី ៣ */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-gaming p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-neon/20 flex items-center justify-center text-neon font-bold text-sm">3</span>
              <h3 className="text-lg font-semibold text-white font-khmer">
                {locale === 'km' ? 'បង់ប្រាក់ និង ផ្ទុកបង្កាន់ដៃ' : 'Pay & Upload Receipt'}
              </h3>
            </div>
            <p className="text-white/50 font-khmer text-sm leading-relaxed pl-11">
              {locale === 'km'
                ? 'ជ្រើសរើសធនាគារ (ABA, ACLEDA, Wing) ស្កែន KHQR រួចផ្ទុករូបថតបង្កាន់ដៃ។'
                : 'Select a bank (ABA, ACLEDA, Wing), scan KHQR, and upload your receipt photo.'}
            </p>
          </motion.div>

          {/* វីដេអូណែនាំ */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-gaming p-8 text-center"
          >
            {hasVideoUrl ? (
              <div className="aspect-video bg-obsidian-100 rounded-xl">
                <p className="text-white/30 pt-20">Video Player</p>
              </div>
            ) : (
              <div>
                <svg className="w-16 h-16 mx-auto text-gold/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p className="text-white/30 font-khmer mb-6">
                  {locale === 'km'
                    ? 'វីដេអូណែនាំកំពុងរៀបចំ...'
                    : 'Instruction video coming soon...'}
                </p>
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.751-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.12.098.153.229.168.327.016.098.035.322.02.496z"/>
                  </svg>
                  {t('telegramAdmin')}
                </a>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
