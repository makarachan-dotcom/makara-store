'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store/useStore'
import Image from 'next/image'

export default function CinematicIntro() {
  const { hasSeenIntro, setHasSeenIntro } = useStore()
  const [isVisible, setIsVisible] = useState(false)

  const dismiss = useCallback(() => {
    setIsVisible(false)
    setHasSeenIntro(true)
  }, [setHasSeenIntro])

  useEffect(() => {
    if (!hasSeenIntro) {
      setIsVisible(true)
      const timer = setTimeout(dismiss, 2000)
      return () => clearTimeout(timer)
    }
  }, [hasSeenIntro, dismiss])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-obsidian cursor-pointer"
          onClick={dismiss}
        >
          <div className="absolute inset-0 cyber-grid-bg opacity-20" />

          <div className="relative flex flex-col items-center gap-6">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
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

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-center"
            >
              <h1 className="text-2xl md:text-4xl font-display font-bold tracking-wider">
                <span className="text-neon">Made with</span>{' '}
                <span className="text-gold">Unreal Engine 5</span>
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                className="mt-3 text-lg md:text-xl text-white/60 font-khmer"
              >
                By{' '}
                <span className="text-gold font-semibold">Makara Store</span>
              </motion.p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5, 1] }}
              transition={{ delay: 0.8, duration: 1, repeat: Infinity }}
              className="text-white/30 text-xs mt-4 font-khmer"
            >
              Tap anywhere to skip
            </motion.p>
          </div>

          <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-neon/40" />
          <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-neon/40" />
          <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-neon/40" />
          <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-neon/40" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
