'use client'

// ក្បាលគេហទំព័រ - Navigation ចម្បង
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'
import { useStore } from '@/store/useStore'

export default function Header() {
  const { t, locale, setLocale } = useTranslation()
  const cartCount = useStore((s) => s.getCartCount())
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

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

            {/* ចូលគណនី */}
            <Link
              href="/login"
              className="hidden sm:block btn-neon text-sm py-2 px-4"
            >
              {t('login')}
            </Link>
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
