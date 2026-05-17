'use client'

import { motion } from 'framer-motion'

interface OrderStatusStepsProps {
  currentStatus: string
  locale: string
}

const ORDER_STEPS = [
  {
    status: 'PAYMENT_UPLOADED',
    en: 'Payment Uploaded',
    km: '\u1794\u17b6\u1793\u1795\u17d2\u1791\u17bb\u1780\u1794\u1784\u17d2\u1780\u17b6\u1793\u17cb\u178a\u17c3',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    ),
  },
  {
    status: 'PAYMENT_VERIFIED',
    en: 'Payment Verified',
    km: '\u1794\u17b6\u1793\u1795\u17d2\u1791\u17c0\u1784\u1795\u17d2\u1791\u17b6\u178f\u17cb',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    status: 'PROCESSING',
    en: 'Processing',
    km: '\u1780\u17c6\u1796\u17bb\u1784\u178a\u17c6\u178e\u17be\u179a\u1780\u17b6\u179a',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    status: 'COMPLETED',
    en: 'Completed',
    km: '\u1794\u17b6\u1793\u1794\u1789\u17d2\u1785\u1794\u17cb',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
]

const STATUS_ORDER: Record<string, number> = {
  PENDING: 0,
  PAYMENT_UPLOADED: 1,
  PAYMENT_VERIFIED: 2,
  PROCESSING: 3,
  COMPLETED: 4,
  CANCELLED: -1,
  REFUNDED: -1,
}

export default function OrderStatusSteps({ currentStatus, locale }: OrderStatusStepsProps) {
  const currentIndex = STATUS_ORDER[currentStatus] ?? 0
  const isCancelled = currentStatus === 'CANCELLED' || currentStatus === 'REFUNDED'

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
        <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span className="text-red-400 text-xs font-medium">
          {currentStatus === 'CANCELLED'
            ? (locale === 'km' ? '\u1794\u17b6\u1793\u1794\u17c4\u17c7\u1794\u1784\u17cb' : 'Order Cancelled')
            : (locale === 'km' ? '\u1794\u17b6\u1793\u1794\u1784\u17d2\u179c\u17b7\u179b\u1794\u17d2\u179a\u17b6\u1780\u17cb' : 'Order Refunded')}
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-0 w-full">
      {ORDER_STEPS.map((step, index) => {
        const stepIndex = index + 1
        const isActive = currentIndex >= stepIndex
        const isCurrent = currentIndex === stepIndex

        return (
          <div key={step.status} className="flex items-center flex-1 last:flex-none">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="flex flex-col items-center gap-1.5 min-w-0"
            >
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  isActive
                    ? isCurrent
                      ? 'bg-neon/20 border-neon text-neon shadow-[0_0_12px_rgba(0,242,254,0.3)]'
                      : 'bg-green-500/20 border-green-400 text-green-400'
                    : 'bg-white/5 border-white/20 text-white/30'
                }`}
              >
                {isActive && !isCurrent ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.icon
                )}
              </div>
              <span className={`text-[10px] sm:text-xs text-center leading-tight font-medium truncate max-w-[70px] sm:max-w-none ${
                isActive ? (isCurrent ? 'text-neon' : 'text-green-400') : 'text-white/30'
              }`}>
                {locale === 'km' ? step.km : step.en}
              </span>
            </motion.div>
            {index < ORDER_STEPS.length - 1 && (
              <div className="flex-1 mx-1 sm:mx-2">
                <div className={`h-0.5 rounded-full transition-all duration-500 ${
                  currentIndex > stepIndex ? 'bg-green-400' : 'bg-white/10'
                }`} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
