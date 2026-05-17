'use client'

// ផ្ទាំង Overlay ចម្បង UE5 - បង្ហាញនៅពេលអ្នកប្រើចូលមើលលើកដំបូង
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store/useStore'
import Image from 'next/image'

export default function CinematicIntro() {
  const { hasSeenIntro, setHasSeenIntro } = useStore()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!hasSeenIntro) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setHasSeenIntro(true)
      }, 3500)
      return () => clearTimeout(timer)
    }
  }, [hasSeenIntro, setHasSeenIntro])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-obsidian"
        >
          {/* ផ្ទៃខាងក្រោយ Grid */}
          <div className="absolute inset-0 cyber-grid-bg opacity-20" />

          {/* បន្ទាត់ Scan */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute inset-x-0 h-32"
              style={{
                background:
                  'linear-gradient(transparent, rgba(0,242,254,0.05), transparent)',
              }}
              animate={{ y: ['-100%', '800%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          {/* មាតិកាកណ្តាល */}
          <div className="relative flex flex-col items-center gap-6">
            {/* ឡូហ្គោ */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
              className="relative"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(0,242,254,0.3)',
                    '0 0 60px rgba(0,242,254,0.6)',
                    '0 0 20px rgba(0,242,254,0.3)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="rounded-full overflow-hidden w-32 h-32 md:w-40 md:h-40"
              >
                <Image
                  src="/images/logo.jpg"
                  alt="Makara Store"
                  width={160}
                  height={160}
                  className="object-cover"
                  priority
                />
              </motion.div>
            </motion.div>

            {/* អត្ថបទ UE5 */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-center"
            >
              <motion.h1
                className="text-2xl md:text-4xl font-display font-bold tracking-wider"
                animate={{
                  textShadow: [
                    '0 0 10px rgba(0,242,254,0.5)',
                    '0 0 30px rgba(0,242,254,0.8)',
                    '0 0 10px rgba(0,242,254,0.5)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-neon">Made with</span>{' '}
                <span className="text-gold">Unreal Engine 5</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                className="mt-3 text-lg md:text-xl text-white/60 font-khmer"
              >
                By{' '}
                <span className="text-gold font-semibold">Makara Store</span>
              </motion.p>
            </motion.div>

            {/* រង្វង់ Pulse */}
            <motion.div
              className="absolute inset-0 -z-10"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-full h-full rounded-full border border-neon/20" />
            </motion.div>
          </div>

          {/* ស៊ុម Corners */}
          <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-neon/40" />
          <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-neon/40" />
          <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-neon/40" />
          <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-neon/40" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
