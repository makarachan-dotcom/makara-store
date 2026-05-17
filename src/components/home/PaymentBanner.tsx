'use client'

import { useTranslation } from '@/hooks/useTranslation'

const paymentMethods = [
  {
    name: 'KHQR',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="#EF4444" strokeWidth="1.5" />
        <rect x="7" y="7" width="4" height="4" rx="1" fill="#EF4444" />
        <rect x="13" y="7" width="4" height="4" rx="1" fill="#EF4444" />
        <rect x="7" y="13" width="4" height="4" rx="1" fill="#EF4444" />
        <rect x="14" y="14" width="2" height="2" fill="#EF4444" />
      </svg>
    ),
  },
  {
    name: 'Wing Bank',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" fill="#3B82F6" fillOpacity="0.15" stroke="#3B82F6" strokeWidth="1.5" />
        <path d="M7 12l3-4 2 3 3-5 2 6" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 15h10" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'ACleda Bank',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M5 21V7l7-4 7 4v14" fill="#EAB308" fillOpacity="0.15" stroke="#EAB308" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 21h18" stroke="#EAB308" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="9" y="10" width="2" height="3" rx="0.5" fill="#EAB308" fillOpacity="0.4" stroke="#EAB308" strokeWidth="1" />
        <rect x="13" y="10" width="2" height="3" rx="0.5" fill="#EAB308" fillOpacity="0.4" stroke="#EAB308" strokeWidth="1" />
        <rect x="10" y="16" width="4" height="5" rx="0.5" fill="#EAB308" fillOpacity="0.4" stroke="#EAB308" strokeWidth="1" />
      </svg>
    ),
  },
  {
    name: 'ABA Bank',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="4" width="20" height="16" rx="2" fill="#06B6D4" fillOpacity="0.15" stroke="#06B6D4" strokeWidth="1.5" />
        <path d="M2 9h20" stroke="#06B6D4" strokeWidth="1.5" />
        <rect x="5" y="13" width="6" height="3" rx="1" fill="#06B6D4" fillOpacity="0.4" stroke="#06B6D4" strokeWidth="1" />
      </svg>
    ),
  },
]

export default function PaymentBanner() {
  const { locale } = useTranslation()

  const items = paymentMethods.map((method, index) => (
    <div
      key={`${method.name}-${index}`}
      className="flex items-center gap-2 px-6 whitespace-nowrap"
    >
      {method.icon}
      <span className="text-white/80 text-sm font-khmer font-medium">{method.name}</span>
    </div>
  ))

  return (
    <div className="relative overflow-hidden rounded-xl border border-neon/10 bg-obsidian-50/50 py-3">
      <div className="flex items-center gap-2 mb-2 px-4">
        <span className="text-gold text-sm">{'\uD83D\uDCB3'}</span>
        <p className="text-xs text-gold font-khmer font-semibold">
          {locale === 'km'
            ? '\u1780\u17b6\u179a\u1794\u1784\u17cb\u1794\u17d2\u179a\u17b6\u1780\u17cb\u178a\u17c2\u179b\u1799\u17be\u1784\u1791\u1791\u17bd\u179b\u1799\u1780'
            : 'Accepted Payment Methods'}
        </p>
      </div>
      <div className="payment-scroll-container overflow-hidden">
        <div className="payment-scroll flex items-center">
          {items}
          {items}
          {items}
        </div>
      </div>
    </div>
  )
}
