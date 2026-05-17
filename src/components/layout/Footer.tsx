'use client'

// ជើងគេហទំព័រ
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from '@/hooks/useTranslation'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-neon/10 bg-obsidian-100 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* ឡូហ្គោ និង ការពិពណ៌នា */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-neon/30">
                <Image src="/images/logo.jpg" alt="Makara Store" width={40} height={40} className="object-cover" />
              </div>
              <span className="font-display font-bold text-lg">
                <span className="text-neon">MAKARA</span>
                <span className="text-gold ml-1">STORE</span>
              </span>
            </div>
            <p className="text-white/40 text-sm font-khmer leading-relaxed">
              {t('siteName')} - Premium Digital Store
            </p>
          </div>

          {/* តំណភ្ជាប់រហ័ស */}
          <div>
            <h3 className="text-neon font-semibold mb-4 font-khmer">{t('products')}</h3>
            <ul className="space-y-2">
              {[
                { href: '/category/all', label: t('products') },
                { href: '/chatgpt-upgrade', label: t('chatgptUpgrade') },
                { href: '/favorites', label: t('favorites') },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/40 hover:text-neon text-sm transition-colors font-khmer">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ជំនួយ */}
          <div>
            <h3 className="text-neon font-semibold mb-4 font-khmer">{t('menu')}</h3>
            <ul className="space-y-2">
              {[
                { href: '/instructions', label: t('instructions') },
                { href: '/privacy-policy', label: t('privacyPolicy') },
                { href: '/api-key', label: t('apiKey') },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/40 hover:text-neon text-sm transition-colors font-khmer">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ទំនាក់ទំនង */}
          <div>
            <h3 className="text-neon font-semibold mb-4 font-khmer">{t('contactAdmin')}</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://t.me/makara_admin" target="_blank" rel="noopener noreferrer"
                   className="text-white/40 hover:text-gold text-sm transition-colors">
                  Telegram
                </a>
              </li>
              <li>
                <a href="mailto:chanmakara672@gmail.com"
                   className="text-white/40 hover:text-gold text-sm transition-colors">
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* បន្ទាត់ខាងក្រោម */}
        <div className="mt-8 pt-6 border-t border-neon/5 text-center">
          <p className="text-white/20 text-xs">
            &copy; {new Date().getFullYear()} Makara Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
