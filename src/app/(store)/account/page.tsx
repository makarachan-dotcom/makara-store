'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { t, locale } = useTranslation()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

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
            {locale === 'km' ? '\u1780\u17b6\u179a\u1780\u17c6\u178e\u178f\u17cb\u200b\u1782\u178e\u178e\u17b8' : 'Account Settings'}
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
                    {locale === 'km' ? '\u1798\u17b7\u1793\u1791\u17b6\u1793\u17cb\u1785\u17bc\u179b' : 'Not logged in'}
                  </h2>
                  <Link href="/login" className="text-sm text-neon hover:underline">
                    {locale === 'km' ? '\u1785\u17bc\u179b\u200b\u1798\u1780\u200b\u1782\u178e\u178e\u17b8' : 'Login to your account'}
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
            href="/cart"
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
                {locale === 'km' ? '\u1798\u17be\u179b\u200b\u1780\u17b6\u179a\u200b\u1794\u1789\u17d2\u1787\u17b6\u200b\u1791\u17b7\u1789\u200b\u179a\u1794\u179f\u17cb\u200b\u17a2\u17d2\u1793\u1780' : 'View your order history'}
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
                {locale === 'km' ? '\u1795\u179b\u17b7\u178f\u1795\u179b\u200b\u178a\u17c2\u179b\u200b\u17a2\u17d2\u1793\u1780\u200b\u1785\u17bc\u179b\u1785\u17b7\u178f\u17d2\u178f' : 'Products you saved'}
              </p>
            </div>
            <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          {/* Privacy Policy */}
          <Link
            href="/privacy-policy"
            className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors"
          >
            <span className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </span>
            <div className="flex-1">
              <p className="text-white font-khmer">{t('privacyPolicy')}</p>
              <p className="text-xs text-white/40 font-khmer">
                {locale === 'km' ? '\u17a2\u17b6\u1793\u200b\u1782\u17c4\u179b\u1780\u17b6\u179a\u178e\u17cd\u200b\u17af\u1780\u1787\u1793\u200b\u1797\u17b6\u1796\u200b\u179a\u1794\u179f\u17cb\u200b\u1799\u17be\u1784' : 'Read our privacy policy'}
              </p>
            </div>
            <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          {/* Instructions */}
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
                {locale === 'km' ? '\u179f\u17c1\u1785\u1780\u17d2\u178f\u17b8\u200b\u178e\u17c2\u1793\u17b6\u17c6\u200b\u1780\u17b6\u179a\u200b\u1794\u17d2\u179a\u17be\u200b\u1794\u17d2\u179a\u17b6\u179f\u17cb' : 'How to use our services'}
              </p>
            </div>
            <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          {/* Contact Admin */}
          <a
            href="https://t.me/makarastore"
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
              <p className="text-xs text-white/40 font-khmer">Telegram</p>
            </div>
            <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </motion.div>

        {/* Logout Button */}
        {session?.user && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
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
            transition={{ delay: 0.3 }}
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
