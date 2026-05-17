'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'
import { useStore } from '@/store/useStore'

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { t, locale } = useTranslation()
  const theme = useStore((s) => s.theme)
  const setTheme = useStore((s) => s.setTheme)
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  const faqItems = [
    {
      q: locale === 'km' ? 'តើ MakaraStore លក់អ្វីខ្លះ?' : 'What does MakaraStore sell?',
      a: locale === 'km'
        ? 'MakaraStore លក់គណនីឌីជីថល ដូចជា ChatGPT Plus, Netflix Premium, Spotify Premium, Canva Pro និងផលិតផលឌីជីថលផ្សេងៗទៀត។'
        : 'MakaraStore sells digital accounts such as ChatGPT Plus, Netflix Premium, Spotify Premium, Canva Pro and other digital products.',
    },
    {
      q: locale === 'km' ? 'តើខ្ញុំបង់ប្រាក់យ៉ាងម៉េច?' : 'How do I make a payment?',
      a: locale === 'km'
        ? 'អ្នកអាចបង់ប្រាក់តាម ABA Bank, ACLEDA Bank ឬ Wing Bank។ សូមផ្ទុករូបភាពបង្កាន់ដៃបន្ទាប់ពីផ្ទេរប្រាក់។'
        : 'You can pay via ABA Bank, ACLEDA Bank, or Wing Bank. Please upload your receipt image after transferring.',
    },
    {
      q: locale === 'km' ? 'តើខ្ញុំអាចទទួលបានការសងប្រាក់វិញទេ?' : 'Can I get a refund?',
      a: locale === 'km'
        ? 'ទេ ផលិតផលឌីជីថលមិនអាចសងប្រាក់វិញបានទេ។ សូមអានគោលការណ៍ឯកជនភាពរបស់យើងសម្រាប់ព័ត៌មានបន្ថែម។'
        : 'No, digital products are non-refundable. Please read our privacy policy for more information.',
    },
    {
      q: locale === 'km' ? 'តើការបញ្ជាទិញយកពេលប៉ុន្មាន?' : 'How long does an order take?',
      a: locale === 'km'
        ? 'បន្ទាប់ពីការបង់ប្រាក់ត្រូវបានផ្ទៀងផ្ទាត់ គណនីរបស់អ្នកនឹងត្រូវបានផ្ញើក្នុងរយៈពេល ១-២៤ ម៉ោង។'
        : 'After payment is verified, your account will be delivered within 1-24 hours.',
    },
    {
      q: locale === 'km' ? 'តើខ្ញុំអាចទាក់ទងផ្នែកជំនួយយ៉ាងម៉េច?' : 'How can I contact support?',
      a: locale === 'km'
        ? 'អ្នកអាចទាក់ទងយើងតាម Telegram @AF4STURF ឬប្រើមុខងារជជែក AI នៅក្នុងគេហទំព័រ។'
        : 'You can contact us via Telegram @AF4STURF or use the AI chat feature on the website.',
    },
  ]

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="cyber-grid-bg min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-1 h-8 bg-gradient-to-b from-neon to-transparent rounded-full" />
          <h1 className="text-2xl font-display font-bold text-white">
            {locale === 'km' ? 'ការកំណត់​គណនី' : 'Account Settings'}
          </h1>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-neon/20 bg-obsidian-50/50 backdrop-blur-sm p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon/30 to-blue-600/30 border border-neon/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              {session?.user ? (
                <>
                  <h2 className="text-lg font-semibold text-white">{session.user.name || session.user.email}</h2>
                  <p className="text-sm text-white/50">{session.user.email}</p>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold text-white/70">
                    {locale === 'km' ? 'មិនទាន់ចូល' : 'Not logged in'}
                  </h2>
                  <Link href="/login" className="text-sm text-neon hover:underline">
                    {locale === 'km' ? 'ចូល​មក​គណនី' : 'Login to your account'}
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Menu Options */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/10 bg-obsidian-50/50 backdrop-blur-sm overflow-hidden divide-y divide-white/5"
        >
          {/* Order History */}
          <Link
            href="/purchase-history"
            className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors"
          >
            <span className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </span>
            <div className="flex-1">
              <p className="text-white font-khmer">{t('orderHistory')}</p>
              <p className="text-xs text-white/40 font-khmer">
                {locale === 'km' ? 'មើល​ការ​បញ្ជា​ទិញ​របស់​អ្នក' : 'View your order history'}
              </p>
            </div>
            <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          {/* Favorites */}
          <Link
            href="/favorites"
            className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors"
          >
            <span className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </span>
            <div className="flex-1">
              <p className="text-white font-khmer">{t('favorites')}</p>
              <p className="text-xs text-white/40 font-khmer">
                {locale === 'km' ? 'ផលិតផល​ដែល​អ្នក​ចូលចិត្ត' : 'Products you saved'}
              </p>
            </div>
            <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        {/* Device Login Info */}
        {session?.user && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl border border-white/10 bg-obsidian-50/50 backdrop-blur-sm p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-5 h-5 text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="text-white font-semibold font-khmer">
                {locale === 'km' ? 'ឧបករណ៍ដែលបានចូល' : 'Device Login'}
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-neon/10">
                <div className="w-10 h-10 rounded-lg bg-neon/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">
                    {locale === 'km' ? 'ឧបករណ៍បច្ចុប្បន្ន' : 'Current Device'}
                  </p>
                  <p className="text-xs text-white/40">
                    {locale === 'km' ? 'កំពុងប្រើប្រាស់' : 'Currently active'}
                  </p>
                </div>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Appearance Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-white/10 bg-obsidian-50/50 backdrop-blur-sm p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            <h3 className="text-white font-semibold font-khmer">{t('appearance')}</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {([
              { mode: 'dark' as const, label: locale === 'km' ? 'ងងឹត' : 'Dark', icon: '🌙' },
              { mode: 'light' as const, label: locale === 'km' ? 'ភ្លឺ' : 'Light', icon: '☀️' },
              { mode: 'gaming' as const, label: locale === 'km' ? 'ហ្គេម' : 'Gaming', icon: '🎮' },
            ]).map((opt) => (
              <button
                key={opt.mode}
                onClick={() => setTheme({ mode: opt.mode })}
                className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl border transition-all ${
                  theme.mode === opt.mode
                    ? 'border-neon/40 bg-neon/10 text-neon'
                    : 'border-white/10 bg-white/5 text-white/50 hover:text-white/70'
                }`}
              >
                <span>{opt.icon}</span>
                <span className="text-sm font-khmer">{opt.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Privacy & Security */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl border border-white/10 bg-obsidian-50/50 backdrop-blur-sm overflow-hidden divide-y divide-white/5"
        >
          <div className="px-6 py-4">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h3 className="text-white font-semibold font-khmer">
                {locale === 'km' ? 'ឯកជនភាព និងសុវត្ថិភាព' : 'Privacy & Security'}
              </h3>
            </div>
          </div>

          <Link
            href="/privacy-policy"
            className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors"
          >
            <span className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            <div className="flex-1">
              <p className="text-white font-khmer">{t('privacyPolicy')}</p>
              <p className="text-xs text-white/40 font-khmer">
                {locale === 'km' ? 'អាន​គោលការណ៍​ឯកជនភាព​របស់​យើង' : 'Read our privacy policy'}
              </p>
            </div>
            <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <Link
            href="/instructions"
            className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors"
          >
            <span className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </span>
            <div className="flex-1">
              <p className="text-white font-khmer">{t('instructions')}</p>
              <p className="text-xs text-white/40 font-khmer">
                {locale === 'km' ? 'សេចក្ដី​ណែនាំ​ការ​ប្រើ​ប្រាស់' : 'How to use our services'}
              </p>
            </div>
            <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          {/* Contact Admin */}
          <a
            href="https://t.me/AF4STURF"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors"
          >
            <span className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </span>
            <div className="flex-1">
              <p className="text-white font-khmer">{t('contactAdmin')}</p>
              <p className="text-xs text-white/40 font-khmer">Telegram @AF4STURF</p>
            </div>
            <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </motion.div>

        {/* FAQ MakaraStore */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-white/10 bg-obsidian-50/50 backdrop-blur-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-white font-semibold font-khmer">
                FAQ MakaraStore
              </h3>
            </div>
          </div>

          <div className="divide-y divide-white/5">
            {faqItems.map((item, i) => (
              <div key={i}>
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center gap-3 px-6 py-4 hover:bg-white/5 transition-colors text-left"
                >
                  <div className="flex-1">
                    <p className="text-sm text-white font-khmer">{item.q}</p>
                  </div>
                  <svg
                    className={`w-4 h-4 text-white/30 transition-transform ${faqOpen === i ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {faqOpen === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-4 text-sm text-white/50 font-khmer leading-relaxed">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Logout Button */}
        {session?.user && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl
                         border border-red-500/20 bg-red-500/5 hover:bg-red-500/10
                         transition-all text-red-400 hover:text-red-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-semibold font-khmer">{t('logout')}</span>
            </button>
          </motion.div>
        )}

        {/* Login Button (when not logged in) */}
        {!session?.user && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl
                         border border-neon/20 bg-neon/5 hover:bg-neon/10
                         transition-all text-neon hover:text-neon"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span className="font-semibold font-khmer">{t('login')}</span>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}
