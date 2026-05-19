'use client'

// ទំព័រសេចក្ដីណែនាំ
import { motion } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'

export default function InstructionsPage() {
  const { t, locale } = useTranslation()

  const telegramUrl = 'https://t.me/AF4STURF'

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

          {/* ជំហានទី ៤ - Auto Delivery */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-gaming p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-sm">4</span>
              <h3 className="text-lg font-semibold text-white font-khmer">
                {locale === 'km' ? 'ទទួលផលិតផលស្វ័យប្រវត្តិ' : 'Auto-Delivery'}
              </h3>
            </div>
            <p className="text-white/50 font-khmer text-sm leading-relaxed pl-11">
              {locale === 'km'
                ? 'បន្ទាប់ពី Admin បានផ្ទៀងផ្ទាត់ការបង់ប្រាក់ អ្នកនឹងទទួលបាន Card Key ដោយស្វ័យប្រវត្តិ។ ប្រើ Card Key នៅលើ Self-Service Portal ដើម្បីដំឡើងផលិតផល។'
                : 'After Admin verifies payment, you will receive a Card Key automatically. Use the Card Key on the Self-Service Portal to activate your product.'}
            </p>
          </motion.div>

          {/* ទំនាក់ទំនងជំនួយ */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card-gaming p-8 text-center"
          >
            <svg className="w-16 h-16 mx-auto text-gold/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
            <p className="text-white/30 font-khmer mb-6">
              {locale === 'km'
                ? 'មានសំណួរ? ទាក់ទង Admin តាម Telegram'
                : 'Need help? Contact Admin via Telegram'}
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
          </motion.div>
        </div>
      </div>
    </div>
  )
}
