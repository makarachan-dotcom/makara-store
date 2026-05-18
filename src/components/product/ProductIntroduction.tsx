'use client'

import { useState, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ProductDescriptionData {
  descEn: string
  descKm: string
  features: string[]
  featuresKm: string[]
  upgradeMethod: string
  upgradeMethodKm: string
  deliveryTime: string
  deliveryTimeKm: string
  priceNote?: string
  priceNoteKm?: string
}

interface ProductIntroductionProps {
  productName: string
  price: number
  description?: string
  richDesc: ProductDescriptionData | null
  locale: string
  videoUrl?: string | null
}

const LazyVideo = lazy(() =>
  Promise.resolve({
    default: ({ src }: { src: string }) => (
      <video
        src={src}
        controls
        playsInline
        preload="none"
        className="w-full h-full object-contain"
      />
    ),
  })
)

export default function ProductIntroduction({
  productName,
  price,
  description,
  richDesc,
  locale,
  videoUrl,
}: ProductIntroductionProps) {
  const [activeTab, setActiveTab] = useState<'intro' | 'features' | 'video' | 'faq' | 'warranty'>(
    'intro'
  )

  const tabs = [
    { id: 'intro' as const, label: locale === 'km' ? 'ការណែនាំ' : 'Introduction', icon: '📋' },
    { id: 'features' as const, label: locale === 'km' ? 'មុខងារ' : 'Features', icon: '⚡' },
    ...(videoUrl
      ? [{ id: 'video' as const, label: locale === 'km' ? 'វីដេអូ' : 'Tutorial', icon: '🎬' }]
      : []),
    { id: 'faq' as const, label: locale === 'km' ? 'សំណួរ' : 'FAQ', icon: '💬' },
    { id: 'warranty' as const, label: locale === 'km' ? 'ធានា' : 'Warranty', icon: '🛡' },
  ]

  const faqItems = locale === 'km'
    ? [
        { q: 'ត្រូវការពេលប៉ុន្មានដើម្បីទទួលបានផលិតផល?', a: richDesc?.deliveryTimeKm || 'ជាធម្មតា ក្នុងរយៈពេល 10 វិនាទី ទៅ 10 នាទី។' },
        { q: 'តើខ្ញុំអាចស្នើសុំការសងប្រាក់វិញបានទេ?', a: 'ផលិតផលឌីជីថលមិនអាចសងប្រាក់វិញបានទេ បន្ទាប់ពីដឹកជញ្ជូនរួច។' },
        { q: 'ចុះបើមានបញ្ហា?', a: 'សូមទាក់ទងក្រុមគាំទ្ររបស់យើងតាម Telegram ភ្លាមៗ។' },
      ]
    : [
        { q: 'How long does delivery take?', a: richDesc?.deliveryTime || 'Typically 10 seconds to 10 minutes.' },
        { q: 'Can I request a refund?', a: 'Digital products are non-refundable once delivered.' },
        { q: 'What if something goes wrong?', a: 'Contact our support team via Telegram immediately.' },
      ]

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-transparent">
      {/* Header with tabs */}
      <div className="border-b border-white/[0.06]">
        <div className="flex items-center gap-3 px-5 pt-5 pb-0">
          <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-base font-display font-bold text-white">
            {locale === 'km' ? 'ការណែនាំផលិតផល' : 'Product Introduction'}
          </h2>
        </div>

        {/* Tab navigation - scrollable on mobile */}
        <div className="flex gap-1 px-5 mt-4 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-2.5 text-xs font-medium rounded-t-lg transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.id
                  ? 'text-white bg-white/[0.06]'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span>{tab.icon}</span>
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="product-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="p-5 sm:p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* Description */}
              <div className="space-y-3">
                <p className="text-blue-400 font-medium text-sm leading-relaxed">
                  {richDesc
                    ? (locale === 'km' ? richDesc.descKm : richDesc.descEn)
                    : (locale === 'km'
                      ? `ប្រើប្រាស់វិធីបង់ប្រាក់ផ្លូវការដើម្បីដំឡើង ${productName} លើគណនីរបស់អ្នក។`
                      : `Use official payment methods to upgrade ${productName} on your account.`)}
                </p>
                <p className="text-white/50 text-sm leading-relaxed">
                  {description || (locale === 'km'
                    ? `${productName} - ផលិតផលឌីជីថលគុណភាពខ្ពស់ពី Makara Store។`
                    : `${productName} - High quality digital product from Makara Store.`)}
                </p>
              </div>

              {/* Upgrade method */}
              {richDesc && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-neon/[0.04] border border-neon/10">
                  <div className="w-8 h-8 rounded-lg bg-neon/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-neon text-xs font-semibold mb-1">
                      {locale === 'km' ? 'វិធីដំឡើង' : 'Upgrade Method'}
                    </p>
                    <p className="text-white/60 text-sm">
                      {locale === 'km' ? richDesc.upgradeMethodKm : richDesc.upgradeMethod}
                    </p>
                  </div>
                </div>
              )}

              {/* Price & delivery info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-gold/[0.04] border border-gold/10">
                  <p className="text-gold text-xs font-semibold mb-1">
                    {locale === 'km' ? 'តម្លៃ' : 'Price'}
                  </p>
                  <p className="text-white font-bold text-lg">${price.toFixed(2)}</p>
                  {richDesc?.priceNote && (
                    <p className="text-white/40 text-[11px] mt-1">
                      {locale === 'km' ? richDesc.priceNoteKm : richDesc.priceNote}
                    </p>
                  )}
                </div>
                {richDesc && (
                  <div className="p-4 rounded-xl bg-blue-500/[0.04] border border-blue-500/10">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <p className="text-blue-400 text-xs font-semibold">
                        {locale === 'km' ? 'ពេលវេលាដឹកជញ្ជូន' : 'Delivery Time'}
                      </p>
                    </div>
                    <p className="text-white font-bold text-sm">
                      {locale === 'km' ? richDesc.deliveryTimeKm : richDesc.deliveryTime}
                    </p>
                  </div>
                )}
              </div>

              {/* Process steps */}
              <div>
                <p className="text-white/70 font-semibold text-sm mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-white/[0.06] flex items-center justify-center text-[10px]">📝</span>
                  {locale === 'km' ? 'ដំណើរការ' : 'Process'}
                </p>
                <div className="space-y-2">
                  {(locale === 'km'
                    ? ['ជ្រើសរើសគម្រោង និងបង់ប្រាក់', 'ប្រព័ន្ធផ្ទៀងផ្ទាត់ការបង់ប្រាក់', 'ទទួលបានផលិតផលភ្លាមៗ']
                    : ['Select plan and make payment', 'System verifies payment', 'Receive product instantly']
                  ).map((step, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-neon/20 to-neon/5 flex items-center justify-center flex-shrink-0">
                        <span className="text-neon text-[10px] font-bold">{i + 1}</span>
                      </div>
                      <p className="text-white/50 text-xs">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'features' && (
            <motion.div
              key="features"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {richDesc ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(locale === 'km' ? richDesc.featuresKm : richDesc.features).map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-gold/20 hover:bg-gold/[0.02] transition-colors group"
                    >
                      <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-gold/20 transition-colors">
                        <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-white/55 text-xs leading-relaxed group-hover:text-white/70 transition-colors">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/30 text-sm">
                    {locale === 'km' ? 'មិនមានព័ត៌មានលម្អិត' : 'No detailed features available'}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'video' && videoUrl && (
            <motion.div
              key="video"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/[0.06]">
                <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin" />
                  </div>
                }>
                  <LazyVideo src={videoUrl} />
                </Suspense>
              </div>
              <p className="text-white/30 text-xs text-center mt-3">
                {locale === 'km' ? 'វីដេអូបង្ហាញពីវិធីប្រើប្រាស់ផលិតផល' : 'Video tutorial showing how to use the product'}
              </p>
            </motion.div>
          )}

          {activeTab === 'faq' && (
            <motion.div
              key="faq"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {faqItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-400 text-xs font-bold">Q</span>
                    </div>
                    <p className="text-white/80 text-sm font-medium">{item.q}</p>
                  </div>
                  <div className="flex items-start gap-3 mt-3 ml-9">
                    <p className="text-white/50 text-xs leading-relaxed">{item.a}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'warranty' && (
            <motion.div
              key="warranty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* After-sales guarantee */}
              <div className="p-4 rounded-xl bg-green-500/[0.04] border border-green-500/10">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <p className="text-green-400 text-sm font-semibold">
                    {locale === 'km' ? 'ការធានាក្រោយការលក់' : 'After-Sales Guarantee'}
                  </p>
                </div>
                <ul className="space-y-2">
                  {(locale === 'km'
                    ? [
                        'ដំណើរការបញ្ជាទិញក្នុងរយៈពេល 10 នាទី',
                        'ការគាំទ្រតាម Telegram 24/7',
                        'ការសងប្រាក់វិញប្រសិនបើមានបញ្ហាផ្ទៀងផ្ទាត់',
                      ]
                    : [
                        'Order processed within 10 minutes',
                        '24/7 Telegram support available',
                        'Refund if verification issues arise',
                      ]
                  ).map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-white/50">
                      <svg className="w-3.5 h-3.5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Not covered */}
              <div className="p-4 rounded-xl bg-red-500/[0.04] border border-red-500/10">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-red-400 text-sm font-semibold">
                    {locale === 'km' ? 'មិនស្ថិតក្នុងវិសាលភាពធានា' : 'Not Covered'}
                  </p>
                </div>
                <ul className="space-y-2">
                  {(locale === 'km'
                    ? [
                        'ការបិទគណនីដោយសារការប្រើប្រាស់ខុស',
                        'បញ្ហាទាក់ទងនឹងការគ្រប់គ្រងហានិភ័យរបស់វេទិកា',
                        'ផលិតផលឌីជីថលមិនអាចសងប្រាក់វិញបន្ទាប់ពីដឹកជញ្ជូន',
                      ]
                    : [
                        'Account bans due to misuse',
                        'Platform-level risk control issues',
                        'Digital products are non-refundable after delivery',
                      ]
                  ).map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-white/50">
                      <svg className="w-3.5 h-3.5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Important notes */}
              <div className="p-4 rounded-xl bg-yellow-500/[0.04] border border-yellow-500/10">
                <p className="text-yellow-400/80 text-xs leading-relaxed">
                  {locale === 'km'
                    ? '📌 សូមរក្សាព័ត៌មានគណនីរបស់អ្នកឱ្យមានសុវត្ថិភាព។ កុំចែករំលែកទិន្នន័យចូលគណនីរបស់អ្នកជាមួយអ្នកដទៃ។ ប្រសិនបើមានបញ្ហា សូមទាក់ទងក្រុមគាំទ្ររបស់យើងភ្លាមៗ។'
                    : '📌 Keep your account information secure. Do not share your login credentials with others. If you encounter any issues, contact our support team immediately.'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
