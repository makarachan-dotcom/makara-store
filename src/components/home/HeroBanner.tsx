'use client'

// ផ្ទាំង Hero Banner - រូបភាពផ្សព្វផ្សាយសំខាន់
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useTranslation } from '@/hooks/useTranslation'

interface Banner {
  id: string
  imageUrl: string
  titleKm?: string
  titleEn?: string
  linkUrl?: string
}

const defaultBanners: Banner[] = [
  {
    id: '1',
    imageUrl: '/images/logo.jpg',
    titleKm: 'សូមស្វាគមន៍មកកាន់ Makara Store',
    titleEn: 'Welcome to Makara Store',
  },
]

export default function HeroBanner() {
  const { locale } = useTranslation()
  const [current, setCurrent] = useState(0)
  const banners = defaultBanners

  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [banners.length])

  return (
    <section className="relative w-full h-64 md:h-96 lg:h-[28rem] overflow-hidden rounded-2xl">
      {/* ផ្ទៃខាងក្រោយ Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian/20 via-transparent to-obsidian z-10" />

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/80 to-transparent z-10" />
          <Image
            src={banners[current].imageUrl}
            alt="Hero Banner"
            fill
            className="object-cover"
            priority
          />

          {/* អត្ថបទ Overlay */}
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="max-w-7xl mx-auto px-6 w-full">
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="max-w-lg"
              >
                <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
                  <span className="text-neon text-glow-neon">MAKARA</span>
                  <br />
                  <span className="text-gold text-glow-gold">STORE</span>
                </h1>
                <p className="text-white/60 text-sm md:text-base font-khmer mb-6">
                  {locale === 'km'
                    ? banners[current].titleKm
                    : banners[current].titleEn}
                </p>
                <button className="btn-neon text-sm md:text-base">
                  {locale === 'km' ? 'ទិញឥឡូវ' : 'Shop Now'}
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* គ្រាប់មូលចង្អុល */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === current ? 'bg-neon w-6' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      )}

      {/* Decorative Lines */}
      <div className="absolute top-4 left-4 w-16 h-16 border-t border-l border-neon/20 z-20" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-b border-r border-neon/20 z-20" />
    </section>
  )
}
