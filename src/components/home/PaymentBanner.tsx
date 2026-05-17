'use client'

import { useTranslation } from '@/hooks/useTranslation'

const paymentMethods = [
  {
    name: 'KHQR',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <rect x="7" y="7" width="4" height="4" rx="1" fill="currentColor" />
        <rect x="13" y="7" width="4" height="4" rx="1" fill="currentColor" />
        <rect x="7" y="13" width="4" height="4" rx="1" fill="currentColor" />
        <rect x="14" y="14" width="2" height="2" fill="currentColor" />
      </svg>
    ),
    color: 'text-red-400',
  },
  {
    name: 'Wing Bank',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 12l3-4 2 3 3-5 2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 15h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    color: 'text-yellow-400',
  },
  {
    name: 'ACleda Bank',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M3 21h18M5 21V7l7-4 7 4v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="9" y="10" width="2" height="3" rx="0.5" stroke="currentColor" strokeWidth="1" />
        <rect x="13" y="10" width="2" height="3" rx="0.5" stroke="currentColor" strokeWidth="1" />
        <rect x="10" y="16" width="4" height="5" rx="0.5" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
    color: 'text-blue-400',
  },
  {
    name: 'ABA Bank',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 9h20" stroke="currentColor" strokeWidth="1.5" />
        <rect x="5" y="13" width="6" height="3" rx="1" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
    color: 'text-sky-400',
  },
]

export default function PaymentBanner() {
  const { locale } = useTranslation()

  const items = paymentMethods.map((method) => (
    <div
      key={method.name}
      className="flex items-center gap-2 px-4 whitespace-nowrap"
    >
      <span className={method.color}>{method.icon}</span>
      <span className="text-white/70 text-sm font-khmer">{method.name}</span>
    </div>
  ))

  return (
    <div className="relative overflow-hidden rounded-xl border border-neon/10 bg-obsidian-50/50 py-3">
      <div className="flex items-center gap-2 mb-2 px-4">
        <span className="text-gold text-sm">💳</span>
        <p className="text-xs text-gold font-khmer font-semibold">
          {locale === 'km'
            ? 'ការបង់ប្រាក់ដែលយើងទទួលយក'
            : 'Accepted Payment Methods'}
        </p>
      </div>
      <div className="payment-scroll-container overflow-hidden">
        <div className="payment-scroll flex items-center">
          {items}
          {items}
        </div>
      </div>
    </div>
  )
}
