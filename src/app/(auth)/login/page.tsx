'use client'

// ទំព័រចូលគណនី
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // TODO: NextAuth signIn
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-obsidian cyber-grid-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* ឡូហ្គោ */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-full overflow-hidden ring-2 ring-neon/30 mb-4">
            <Image src="/images/logo.jpg" alt="Makara Store" width={64} height={64} className="object-cover" />
          </div>
          <h1 className="text-2xl font-display font-bold">
            <span className="text-neon">MAKARA</span> <span className="text-gold">STORE</span>
          </h1>
        </div>

        <div className="card-gaming p-6">
          <h2 className="text-lg font-semibold text-white mb-6 font-khmer text-center">ចូលគណនី</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-white/40 font-khmer mb-1.5">អ៊ីមែល</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5
                           text-white placeholder-white/20 focus:outline-none focus:border-neon/50"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-white/40 font-khmer mb-1.5">ពាក្យសម្ងាត់</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5
                           text-white placeholder-white/20 focus:outline-none focus:border-neon/50"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-neon disabled:opacity-50"
            >
              {loading ? 'កំពុងចូល...' : 'ចូល'}
            </button>
          </form>

          {/* ការបែងចែក */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-obsidian-50 text-white/30 text-xs">ឬចូលដោយ</span>
            </div>
          </div>

          {/* OAuth */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-white/10
                               rounded-lg hover:bg-white/5 transition-colors text-sm text-white/70">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>

            <button className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-white/10
                               rounded-lg hover:bg-white/5 transition-colors text-sm text-white/70">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Apple
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-white/30 font-khmer">
            មិនទាន់មានគណនី?{' '}
            <Link href="/register" className="text-neon hover:underline">ចុះឈ្មោះ</Link>
          </p>
        </div>

        <Link href="/" className="block text-center mt-4 text-sm text-white/30 hover:text-neon transition-colors font-khmer">
          ← ត្រឡប់ទៅទំព័រដើម
        </Link>
      </motion.div>
    </div>
  )
}
