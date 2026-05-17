'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import { useTranslation } from '@/hooks/useTranslation'
import { useStore } from '@/store/useStore'

export default function Header() {
  const { t, locale, setLocale } = useTranslation()
  const { data: session } = useSession()
  const cartCount = useStore((s) => s.getCartCount())
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 glass border-b border-neon/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* ឡូហ្គោ */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-neon/30 group-hover:ring-neon/60 transition-all">
              <Image
                src="/images/logo.jpg"
                alt="Makara Store"
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
            <span className="font-display font-bold text-lg text-neon hidden sm:block">
              MAKARA
              <span className="text-gold ml-1">STORE</span>
            </span>
          </Link>

          {/* Navigation កណ្តាល (Desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: '/', label: t('home') },
              { href: '/category/all', label: t('products') },
              { href: '/chatgpt-upgrade', label: t('chatgptUpgrade') },
              { href: '/instructions', label: t('instructions') },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm text-white/70 hover:text-neon rounded-lg
                           hover:bg-neon/5 transition-all duration-200 font-khmer"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ផ្នែកស្តាំ */}
          <div className="flex items-center gap-3">
            {/* ស្វែងរក */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-white/60 hover:text-neon transition-colors"
              aria-label="Search"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* ប្តូរភាសា */}
            <button
              onClick={() => setLocale(locale === 'km' ? 'en' : 'km')}
              className="px-3 py-1.5 text-xs font-bold rounded-md border border-neon/30
                         text-neon hover:bg-neon/10 transition-all"
            >
              {locale === 'km' ? 'EN' : 'ខ្មែរ'}
            </button>

            {/* កន្ត្រក */}
            <Link
              href="/cart"
              className="relative p-2 text-white/60 hover:text-neon transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-obsidian
                             text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            {/* ចូលគណនី / User Menu */}
            {session?.user ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neon/20
                             hover:bg-neon/5 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-neon/30 to-gold/30
                                  flex items-center justify-center text-xs font-bold text-white">
                    {session.user.name?.charAt(0)?.toUpperCase() || session.user.email?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm text-white/70 max-w-[100px] truncate font-khmer">
                    {session.user.name || session.user.email?.split('@')[0]}
                  </span>
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-48 z-50 rounded-xl border border-neon/20
                                   bg-obsidian/95 backdrop-blur-xl shadow-2xl overflow-hidden"
                      >
                        {(session.user as { role?: string }).role === 'ADMIN' && (
                          <Link href="/admin/dashboard" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-3 text-sm text-neon/70 hover:bg-neon/10 hover:text-neon transition-colors font-khmer">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Admin Panel
                          </Link>
                        )}
                        <Link href="/account" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-3 text-sm text-white/70 hover:bg-neon/10 hover:text-neon transition-colors font-khmer">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {t('settings')}
                        </Link>
                        <Link href="/purchase-history" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-3 text-sm text-white/70 hover:bg-neon/10 hover:text-neon transition-colors font-khmer">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          {locale === 'km' ? 'ប្រវត្តិទិញ' : 'Orders'}
                        </Link>
                        <div className="border-t border-white/5" />
                        <button
                          onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: '/' }) }}
                          className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-400/70 hover:bg-red-400/10 hover:text-red-400 transition-colors font-khmer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          {locale === 'km' ? 'ចាកចេញ' : 'Logout'}
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:block btn-neon text-sm py-2 px-4"
              >
                {t('login')}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* របារស្វែងរក */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-neon/10 overflow-hidden"
          >
            <div className="max-w-2xl mx-auto px-4 py-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('search')}
                  className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5
                             text-white placeholder-white/30 focus:outline-none focus:border-neon/50
                             font-khmer transition-colors"
                  autoFocus
                />
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neon/50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
