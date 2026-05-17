'use client'

// របារ Navigation ខាងក្រោម (Mobile) - ផ្ទុយពី Desktop Navigation
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'
import { useStore } from '@/store/useStore'

const navItems = [
  {
    key: 'home' as const,
    href: '/',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    key: 'favorites' as const,
    href: '/favorites',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    key: 'liveChat' as const,
    href: '#chat',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    key: 'menu' as const,
    href: '/category/all',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
  },
  {
    key: 'login' as const,
    href: '/login',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
]

export default function MobileBottomNav() {
  const pathname = usePathname()
  const { t } = useTranslation()
  const setChatOpen = useStore((s) => s.setChatOpen)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass border-t border-neon/10">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = item.href === '/'
            ? pathname === '/'
            : pathname?.startsWith(item.href)
          const isChat = item.key === 'liveChat'

          return (
            <motion.div key={item.key} whileTap={{ scale: 0.9 }}>
              {isChat ? (
                <button
                  onClick={() => setChatOpen(true)}
                  className="flex flex-col items-center gap-1 px-3 py-1"
                >
                  <span className={`transition-colors ${isActive ? 'text-neon' : 'text-white/50'}`}>
                    {item.icon}
                  </span>
                  <span className={`text-xs font-khmer transition-colors ${isActive ? 'text-neon' : 'text-white/40'}`}>
                    {t(item.key)}
                  </span>
                </button>
              ) : (
                <Link
                  href={item.href}
                  className="flex flex-col items-center gap-1 px-3 py-1"
                >
                  <span className={`transition-colors ${isActive ? 'text-neon' : 'text-white/50'}`}>
                    {item.icon}
                  </span>
                  <span className={`text-xs font-khmer transition-colors ${isActive ? 'text-neon' : 'text-white/40'}`}>
                    {t(item.key)}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 w-12 h-0.5 bg-neon rounded-full"
                    />
                  )}
                </Link>
              )}
            </motion.div>
          )
        })}
      </div>
    </nav>
  )
}
