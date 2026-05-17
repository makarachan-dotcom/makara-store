'use client'

// Layout ផ្ទាំងគ្រប់គ្រង Admin - តែ chanmakara672@gmail.com ប៉ុណ្ណោះ
import { ReactNode, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { SessionProvider, signOut } from 'next-auth/react'

const adminLinks = [
  { href: '/admin/dashboard', label: 'ផ្ទាំងព័ត៌មាន', labelEn: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'គ្រប់គ្រងផលិតផល', labelEn: 'Products', icon: '📦' },
  { href: '/admin/orders', label: 'គ្រប់គ្រងការបញ្ជាទិញ', labelEn: 'Orders', icon: '🛒' },
  { href: '/admin/receipts', label: 'គ្រប់គ្រងបង្កាន់ដៃ', labelEn: 'Receipts', icon: '🧾' },
  { href: '/admin/announcements', label: 'ការជូនដំណឹង', labelEn: 'Announcements', icon: '📢' },
  { href: '/admin/settings', label: 'ការកំណត់', labelEn: 'Settings', icon: '⚙️' },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Verify page renders as standalone (no sidebar)
  if (pathname === '/admin/verify') {
    return <SessionProvider>{children}</SessionProvider>
  }

  return (
    <SessionProvider>
    <div className="min-h-screen bg-obsidian flex">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 md:hidden bg-obsidian-100 border-b border-neon/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="text-white/60 hover:text-neon transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-display font-bold text-sm text-neon">ADMIN</span>
        </div>
        <Link href="/" className="text-white/30 hover:text-neon text-xs transition-colors font-khmer">
          ត្រឡប់ទៅគេហទំព័រ
        </Link>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <aside className={`
        fixed md:relative z-50 md:z-auto
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        ${sidebarOpen ? 'w-64' : 'md:w-16 w-64'}
        transition-all duration-300 h-full md:h-auto
        bg-obsidian-100 border-r border-neon/10 flex flex-col
        top-0 bottom-0
      `}>
        {/* ឡូហ្គោ */}
        <div className="p-4 border-b border-neon/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-neon/30 flex-shrink-0">
              <Image src="/images/logo.jpg" alt="Admin" width={32} height={32} className="object-cover" />
            </div>
            {(sidebarOpen || mobileSidebarOpen) && (
              <span className="font-display font-bold text-sm text-neon">ADMIN</span>
            )}
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden text-white/30 hover:text-neon transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-neon/10 text-neon border border-neon/20'
                    : 'text-white/50 hover:text-white/70 hover:bg-white/5'
                }`}
              >
                <span className="flex-shrink-0">{link.icon}</span>
                {(sidebarOpen || mobileSidebarOpen) && <span className="font-khmer">{link.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* ប៊ូតុង Toggle (Desktop only) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden md:block p-4 border-t border-neon/10 text-white/30 hover:text-neon transition-colors"
        >
          <svg className={`w-5 h-5 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>

        {/* ត្រឡប់ទៅគេហទំព័រ */}
        <div className="p-3 border-t border-neon/10 space-y-2">
          <Link href="/" className="flex items-center gap-2 text-white/30 hover:text-neon text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {(sidebarOpen || mobileSidebarOpen) && <span className="font-khmer">ត្រឡប់ទៅគេហទំព័រ</span>}
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 text-red-400/50 hover:text-red-400 text-sm transition-colors w-full"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {(sidebarOpen || mobileSidebarOpen) && <span className="font-khmer">ចាកចេញ</span>}
          </button>
        </div>
      </aside>

      {/* មាតិកាចម្បង */}
      <main className="flex-1 overflow-auto pt-14 md:pt-0">
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
    </SessionProvider>
  )
}
