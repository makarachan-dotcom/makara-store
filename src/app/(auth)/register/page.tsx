'use client'

// ទំព័រចុះឈ្មោះ
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) return
    setLoading(true)
    // TODO: API register
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-obsidian cyber-grid-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-full overflow-hidden ring-2 ring-neon/30 mb-4">
            <Image src="/images/logo.jpg" alt="Makara Store" width={64} height={64} className="object-cover" />
          </div>
          <h1 className="text-2xl font-display font-bold">
            <span className="text-neon">MAKARA</span> <span className="text-gold">STORE</span>
          </h1>
        </div>

        <div className="card-gaming p-6">
          <h2 className="text-lg font-semibold text-white mb-6 font-khmer text-center">ចុះឈ្មោះ</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-white/40 font-khmer mb-1.5">ឈ្មោះ</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5
                           text-white placeholder-white/20 focus:outline-none focus:border-neon/50"
                placeholder="ឈ្មោះរបស់អ្នក"
                required
              />
            </div>

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
                minLength={8}
              />
            </div>

            <div>
              <label className="block text-sm text-white/40 font-khmer mb-1.5">បញ្ជាក់ពាក្យសម្ងាត់</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5
                           text-white placeholder-white/20 focus:outline-none focus:border-neon/50"
                placeholder="••••••••"
                required
              />
              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-red-400 text-xs mt-1 font-khmer">ពាក្យសម្ងាត់មិនត្រូវគ្នា</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || password !== confirmPassword}
              className="w-full btn-neon disabled:opacity-50"
            >
              {loading ? 'កំពុងចុះឈ្មោះ...' : 'ចុះឈ្មោះ'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/30 font-khmer">
            មានគណនីរួចហើយ?{' '}
            <Link href="/login" className="text-neon hover:underline">ចូល</Link>
          </p>
        </div>

        <Link href="/" className="block text-center mt-4 text-sm text-white/30 hover:text-neon transition-colors font-khmer">
          ← ត្រឡប់ទៅទំព័រដើម
        </Link>
      </motion.div>
    </div>
  )
}
