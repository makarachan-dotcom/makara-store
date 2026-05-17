'use client'

// ផ្ទាំង Maintenance - បង្ហាញពេល Admin បិទគេហទំព័រ
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function MaintenanceScreen() {
  return (
    <div className="fixed inset-0 z-[9998] bg-obsidian flex items-center justify-center cyber-grid-bg">
      {/* បន្ទាត់ Scan */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute inset-x-0 h-40"
          style={{
            background: 'linear-gradient(transparent, rgba(0,242,254,0.04), transparent)',
          }}
          animate={{ y: ['-100%', '800%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="text-center px-6">
        {/* ឡូហ្គោ */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto rounded-full overflow-hidden ring-4 ring-neon/30">
            <Image src="/images/logo.jpg" alt="Makara Store" width={96} height={96} className="object-cover" />
          </div>
        </motion.div>

        {/* រូបតំណាង Maintenance */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="mb-6"
        >
          <svg className="w-16 h-16 mx-auto text-neon/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </motion.div>

        {/* អត្ថបទ */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl md:text-4xl font-display font-bold text-neon mb-4"
        >
          ទំព័រកំពុងធ្វើបច្ចុប្បន្នភាព
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/40 font-khmer text-lg mb-2"
        >
          Website Updating Status
        </motion.p>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-white/30 font-khmer text-sm max-w-md mx-auto"
        >
          យើងកំពុងធ្វើបច្ចុប្បន្នភាពគេហទំព័រ។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។
        </motion.p>

        {/* របារ Loading */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 max-w-xs mx-auto"
        >
          <div className="h-1 bg-obsidian-50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-neon to-gold rounded-full"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: '40%' }}
            />
          </div>
        </motion.div>
      </div>

      {/* ស៊ុម Corners */}
      <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-neon/20" />
      <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-neon/20" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-neon/20" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-neon/20" />
    </div>
  )
}
