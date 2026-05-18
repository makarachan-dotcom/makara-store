'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface Variant {
  label: string
  labelKm: string
  price: number
  inStock: boolean
  stockCount?: number
}

interface SelectSpecificationsProps {
  variants: Variant[]
  selectedVariant: number
  onSelect: (index: number) => void
  locale: string
  totalSold?: number
}

export default function SelectSpecifications({
  variants,
  selectedVariant,
  onSelect,
  locale,
  totalSold,
}: SelectSpecificationsProps) {
  const currentVariant = variants[selectedVariant]
  const availableCount = variants.filter(v => v.inStock).length

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-transparent backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neon/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              {locale === 'km' ? 'ជ្រើសរើសលក្ខណៈ' : 'Select Specifications'}
            </h3>
            <p className="text-[11px] text-white/30">
              {locale === 'km'
                ? `${availableCount}/${variants.length} ជម្រើសមាន`
                : `${availableCount}/${variants.length} available`}
            </p>
          </div>
        </div>
      </div>

      {/* Variants */}
      <div className="px-4 pb-3 space-y-2">
        {variants.map((variant, index) => {
          const isSelected = selectedVariant === index
          return (
            <motion.button
              key={index}
              onClick={() => variant.inStock && onSelect(index)}
              disabled={!variant.inStock}
              whileTap={variant.inStock ? { scale: 0.98 } : undefined}
              className={`relative w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 text-left group ${
                isSelected
                  ? 'border-neon/60 bg-gradient-to-r from-neon/[0.08] to-neon/[0.02] shadow-[0_0_24px_rgba(0,242,254,0.08)]'
                  : variant.inStock
                    ? 'border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.04]'
                    : 'border-white/[0.03] bg-white/[0.01] opacity-40 cursor-not-allowed'
              }`}
            >
              {/* Selection indicator line */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    exit={{ scaleY: 0 }}
                    className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-neon"
                  />
                )}
              </AnimatePresence>

              <div className="flex-1 min-w-0 pl-1">
                <p className={`text-sm font-medium truncate transition-colors ${
                  isSelected ? 'text-white' : 'text-white/60 group-hover:text-white/80'
                }`}>
                  {locale === 'km' ? variant.labelKm : variant.label}
                </p>
                {!variant.inStock ? (
                  <p className="text-[11px] text-red-400/80 mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400/60" />
                    {locale === 'km' ? 'អស់ស្តុក' : 'Out of stock'}
                  </p>
                ) : variant.stockCount !== undefined && variant.stockCount <= 10 ? (
                  <p className="text-[11px] text-yellow-400/80 mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/60" />
                    {locale === 'km' ? `នៅសល់ ${variant.stockCount}` : `${variant.stockCount} left`}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`text-sm font-bold tabular-nums transition-colors ${
                  isSelected ? 'text-gold' : 'text-white/40'
                }`}>
                  ${variant.price.toFixed(2)}
                </span>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isSelected
                    ? 'bg-neon shadow-[0_0_8px_rgba(0,242,254,0.4)]'
                    : 'border-2 border-white/15'
                }`}>
                  {isSelected && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-3 h-3 text-obsidian"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </motion.svg>
                  )}
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Stock & Sales Summary */}
      <div className="px-5 pb-4 pt-1 flex items-center gap-4 border-t border-white/[0.04]">
        <div className="flex items-center gap-1.5 text-[11px] text-white/30">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span>
            {locale === 'km' ? 'ស្តុក' : 'Stock'}: {currentVariant?.stockCount ?? (currentVariant?.inStock ? '99+' : '0')}
          </span>
        </div>
        {totalSold !== undefined && (
          <div className="flex items-center gap-1.5 text-[11px] text-white/30">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>
              {locale === 'km' ? 'បានលក់' : 'Sold'}: {totalSold > 99 ? '99+' : totalSold}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
