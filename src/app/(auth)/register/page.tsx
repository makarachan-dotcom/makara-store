'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (password !== confirmPassword) {
      setError('\u1796\u17b6\u1780\u17d2\u1799\u179f\u1798\u17d2\u1784\u17b6\u178f\u17cb\u1798\u17b7\u1793\u178f\u17d2\u179a\u17bc\u179c\u1782\u17d2\u1793\u17b6')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '\u1798\u17b6\u1793\u1780\u17c6\u17a0\u17bb\u179f\u17d4 \u179f\u17bc\u1798\u1796\u17d2\u1799\u17b6\u1799\u17b6\u1798\u1798\u17d2\u178f\u1784\u1791\u17c0\u178f\u17d4')
        return
      }

      setSuccess(true)
      setTimeout(async () => {
        await signIn('credentials', {
          email,
          password,
          callbackUrl: '/',
        })
      }, 1000)
    } catch {
      setError('\u1798\u17b6\u1793\u1780\u17c6\u17a0\u17bb\u179f\u17d4 \u179f\u17bc\u1798\u1796\u17d2\u1799\u17b6\u1799\u17b6\u1798\u1798\u17d2\u178f\u1784\u1791\u17c0\u178f\u17d4')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/' })
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
          <h2 className="text-lg font-semibold text-white mb-6 font-khmer text-center">{'\u1785\u17bb\u17c7\u1788\u17d2\u1798\u17c4\u17c7'}</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-white/40 font-khmer mb-1.5">{'\u1788\u17d2\u1798\u17c4\u17c7'}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5
                           text-white placeholder-white/20 focus:outline-none focus:border-neon/50"
                placeholder={'\u1788\u17d2\u1798\u17c4\u17c7\u179a\u1794\u179f\u17cb\u17a2\u17d2\u1793\u1780'}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-white/40 font-khmer mb-1.5">{'\u17a2\u17ca\u17b8\u1798\u17c2\u179b'}</label>
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
              <label className="block text-sm text-white/40 font-khmer mb-1.5">{'\u1796\u17b6\u1780\u17d2\u1799\u179f\u1798\u17d2\u1784\u17b6\u178f\u17cb'}</label>
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
              <label className="block text-sm text-white/40 font-khmer mb-1.5">{'\u1794\u1789\u17d2\u1787\u17b6\u1780\u17cb\u1796\u17b6\u1780\u17d2\u1799\u179f\u1798\u17d2\u1784\u17b6\u178f\u17cb'}</label>
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
                <p className="text-red-400 text-xs mt-1 font-khmer">{'\u1796\u17b6\u1780\u17d2\u1799\u179f\u1798\u17d2\u1784\u17b6\u178f\u17cb\u1798\u17b7\u1793\u178f\u17d2\u179a\u17bc\u179c\u1782\u17d2\u1793\u17b6'}</p>
              )}
            </div>

            {error && (
              <p className="text-red-400 text-sm font-khmer text-center">{error}</p>
            )}
            {success && (
              <p className="text-green-400 text-sm font-khmer text-center">
                {'\u1782\u178e\u1793\u17b8\u178f\u17d2\u179a\u17bc\u179c\u1794\u17b6\u1793\u1794\u1784\u17d2\u1780\u17be\u178f! \u1780\u17c6\u1796\u17bb\u1784\u1785\u17bc\u179b...'}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || (!!password && !!confirmPassword && password !== confirmPassword)}
              className="w-full btn-neon disabled:opacity-50"
            >
              {loading ? '\u1780\u17c6\u1796\u17bb\u1784\u1785\u17bb\u17c7\u1788\u17d2\u1798\u17c4\u17c7...' : '\u1785\u17bb\u17c7\u1788\u17d2\u1798\u17c4\u17c7'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-obsidian-50 text-white/30 text-xs">{'\u17ac\u1785\u17bb\u17c7\u1788\u17d2\u1798\u17c4\u17c7\u178a\u17c4\u1799'}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-white/10
                               rounded-lg hover:bg-white/5 transition-colors text-sm text-white/70 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? '\u1780\u17c6\u1796\u17bb\u1784\u1785\u17bc\u179b...' : 'Google'}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-white/30 font-khmer">
            {'\u1798\u17b6\u1793\u1782\u178e\u1793\u17b8\u179a\u17bd\u1785\u17a0\u17be\u1799?'}{' '}
            <Link href="/login" className="text-neon hover:underline">{'\u1785\u17bc\u179b'}</Link>
          </p>
        </div>

        <Link href="/" className="block text-center mt-4 text-sm text-white/30 hover:text-neon transition-colors font-khmer">
          {'\u2190 \u178f\u17d2\u179a\u17a1\u1794\u17cb\u1791\u17c5\u1791\u17c6\u1796\u17d0\u179a\u178a\u17be\u1798'}
        </Link>
      </motion.div>
    </div>
  )
}
