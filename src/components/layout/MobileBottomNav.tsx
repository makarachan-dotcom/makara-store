'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'
import { useStore } from '@/store/useStore'

export default function MobileBottomNav() {
  const pathname = usePathname()
  const { t, locale, setLocale } = useTranslation()
  const setChatOpen = useStore((s) => s.setChatOpen)
  const isMobileMenuOpen = useStore((s) => s.isMobileMenuOpen)
  const setMobileMenuOpen = useStore((s) => s.setMobileMenuOpen)
  const cartCount = useStore((s) => s.getCartCount())

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href)

  const menuLinks = [
    { href: '/', label: t('home'), icon: HomeIcon },
    { href: '/category/all', label: t('products'), icon: ProductsIcon },
    { href: '/chatgpt-upgrade', label: t('chatgptUpgrade'), icon: ChatGPTIcon },
    { href: '/instructions', label: t('instructions'), icon: InstructionsIcon },
    { href: '/cart', label: t('cart'), icon: CartIcon, badge: cartCount },
    { href: '/account', label: t('settings'), icon: AccountIcon },
    { href: '/login', label: t('login'), icon: LoginIcon },
    { href: '/favorites', label: t('favorites'), icon: FavoritesIcon },
  ]

  return (
    <>
      {/* Menu Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-20 left-3 right-3 z-50 md:hidden"
            >
              <div className="rounded-2xl border border-neon/20 bg-obsidian/95 backdrop-blur-xl shadow-2xl shadow-neon/5 p-4">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="text-sm font-semibold text-neon font-khmer">{locale === 'km' ? '\u1798\u17b8\u1793\u17bb\u1799' : 'Menu'}</h3>
                  <button
                    onClick={() => setLocale(locale === 'km' ? 'en' : 'km')}
                    className="px-3 py-1 text-xs font-bold rounded-md border border-neon/30
                               text-neon hover:bg-neon/10 transition-all"
                  >
                    {locale === 'km' ? 'EN' : '\u1781\u17d2\u1798\u17c2\u179a'}
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {menuLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all
                        ${isActive(link.href)
                          ? 'bg-neon/10 text-neon'
                          : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                        }`}
                    >
                      <link.icon />
                      <span className="text-[10px] font-khmer leading-tight text-center">{link.label}</span>
                      {link.badge && link.badge > 0 ? (
                        <span className="absolute top-1 right-1 w-4 h-4 bg-gold text-obsidian
                                         text-[9px] font-bold rounded-full flex items-center justify-center">
                          {link.badge}
                        </span>
                      ) : null}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Nav Bar - Liquid Glasses Style */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden pb-safe">
        <div className="px-3 pb-2">
          <div className="flex items-center justify-around h-16 rounded-2xl
                          bg-obsidian/80 backdrop-blur-xl border border-white/10
                          shadow-lg shadow-black/30">
            {/* Home */}
            <motion.div whileTap={{ scale: 0.9 }}>
              <Link href="/" className="flex flex-col items-center gap-1 px-4 py-2 relative">
                {isActive('/') && (
                  <motion.div
                    layoutId="activeNavBg"
                    className="absolute inset-0 bg-gold/15 rounded-xl"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 transition-colors ${isActive('/') ? 'text-gold' : 'text-white/50'}`}>
                  <HomeIcon />
                </span>
                <span className={`relative z-10 text-[10px] font-khmer transition-colors ${isActive('/') ? 'text-gold' : 'text-white/40'}`}>
                  {t('home')}
                </span>
              </Link>
            </motion.div>

            {/* Favorites */}
            <motion.div whileTap={{ scale: 0.9 }}>
              <Link href="/favorites" className="flex flex-col items-center gap-1 px-4 py-2 relative">
                {isActive('/favorites') && (
                  <motion.div
                    layoutId="activeNavBg"
                    className="absolute inset-0 bg-gold/15 rounded-xl"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 transition-colors ${isActive('/favorites') ? 'text-gold' : 'text-white/50'}`}>
                  <FavoritesIcon />
                </span>
                <span className={`relative z-10 text-[10px] font-khmer transition-colors ${isActive('/favorites') ? 'text-gold' : 'text-white/40'}`}>
                  {t('favorites')}
                </span>
              </Link>
            </motion.div>

            {/* LiveChat */}
            <motion.div whileTap={{ scale: 0.9 }}>
              <button
                onClick={() => setChatOpen(true)}
                className="flex flex-col items-center gap-1 px-4 py-2 relative"
              >
                <span className="relative text-white/50">
                  <LiveChatIcon />
                  <span className="absolute -top-1 -right-2 text-[8px] font-bold text-gold">BETA</span>
                </span>
                <span className="text-[10px] font-khmer text-white/40">
                  {t('liveChat')}
                </span>
              </button>
            </motion.div>

            {/* Menu */}
            <motion.div whileTap={{ scale: 0.9 }}>
              <button
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                className="flex flex-col items-center gap-1 px-4 py-2 relative"
              >
                <span className={`relative transition-colors ${isMobileMenuOpen ? 'text-neon' : 'text-white/50'}`}>
                  <MenuIcon />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
                </span>
                <span className={`text-[10px] font-khmer transition-colors ${isMobileMenuOpen ? 'text-neon' : 'text-white/40'}`}>
                  {t('menu')}
                </span>
              </button>
            </motion.div>
          </div>
        </div>
      </nav>

    </>
  )
}

function HomeIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}

function FavoritesIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  )
}

function LiveChatIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function ProductsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  )
}

function ChatGPTIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611l-.772.136a17.932 17.932 0 01-6.126 0l-.772-.136c-1.716-.293-2.3-2.379-1.067-3.611L12.8 15.3" />
    </svg>
  )
}

function InstructionsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
    </svg>
  )
}

function LoginIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}

function AccountIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}
