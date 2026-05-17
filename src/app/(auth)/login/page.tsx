'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

type LoginStep = 'idle' | 'authenticating' | 'retrieving' | 'completed'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [loginStep, setLoginStep] = useState<LoginStep>('idle')
  const router = useRouter()

  const stepLabels: Record<LoginStep, { km: string; en: string }> = {
    idle: { km: '', en: '' },
    authenticating: { km: 'កំពុងផ្ទៀងផ្ទាត់...', en: 'Authenticating...' },
    retrieving: { km: 'កំពុងទាញយកទិន្នន័យរបស់អ្នក...', en: 'Retrieving your data...' },
    completed: { km: 'រួចរាល់! កំពុងបញ្ជូន...', en: 'Completed! Redirecting...' },
  }

  useEffect(() => {
    if (loginStep === 'completed') {
      const timer = setTimeout(() => router.push('/'), 800)
      return () => clearTimeout(timer)
    }
  }, [loginStep, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('សូមបំពេញអ៊ីមែល និងពាក្យសម្ងាត់។')
      return
    }

    setLoading(true)
    setLoginStep('authenticating')

    try {
      await new Promise((r) => setTimeout(r, 600))
      setLoginStep('retrieving')

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setLoginStep('idle')
        setError('អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ។')
      } else {
        setLoginStep('completed')
      }
    } catch {
      setLoginStep('idle')
      setError('មានកំហុស។ សូមព្យាយាមម្តងទៀត។')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setError('')
    setLoginStep('authenticating')
    try {
      await new Promise((r) => setTimeout(r, 400))
      setLoginStep('retrieving')
      await signIn('google', { callbackUrl: '/', redirect: true })
    } catch {
      setLoginStep('idle')
      setError('មានកំហុសក្នុងការចូលដោយ Google។')
      setGoogleLoading(false)
    }
  }

  const progressPercent =
    loginStep === 'authenticating' ? 33 :
    loginStep === 'retrieving' ? 66 :
    loginStep === 'completed' ? 100 : 0

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
          <h2 className="text-lg font-semibold text-white mb-6 font-khmer text-center">{'ចូលគណនី'}</h2>

          {/* Loading Progress Bar */}
          <AnimatePresence>
            {loginStep !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div className="relative h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                  <motion.div
                    className={`absolute inset-y-0 left-0 rounded-full ${
                      loginStep === 'completed' ? 'bg-green-400' : 'bg-neon'
                    }`}
                    initial={{ width: '0%' }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
                <div className="flex items-center justify-center gap-2">
                  {loginStep === 'completed' ? (
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-neon animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  <p className={`text-sm font-khmer ${loginStep === 'completed' ? 'text-green-400' : 'text-neon'}`}>
                    {stepLabels[loginStep].km}
                  </p>
                </div>

                {/* Step indicators */}
                <div className="flex items-center justify-between mt-3 px-2">
                  {(['authenticating', 'retrieving', 'completed'] as const).map((step, i) => (
                    <div key={step} className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full transition-colors ${
                        progressPercent >= (i + 1) * 33 ? (loginStep === 'completed' ? 'bg-green-400' : 'bg-neon') : 'bg-white/20'
                      }`} />
                      <span className={`text-[10px] ${
                        progressPercent >= (i + 1) * 33 ? 'text-white/60' : 'text-white/20'
                      }`}>
                        {stepLabels[step].en}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-white/40 font-khmer mb-1.5">{'អ៊ីមែល'}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5
                           text-white placeholder-white/20 focus:outline-none focus:border-neon/50"
                placeholder="your@email.com"
                required
                disabled={loginStep !== 'idle'}
              />
            </div>

            <div>
              <label className="block text-sm text-white/40 font-khmer mb-1.5">{'ពាក្យសម្ងាត់'}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5
                           text-white placeholder-white/20 focus:outline-none focus:border-neon/50"
                placeholder="••••••••"
                required
                disabled={loginStep !== 'idle'}
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm font-khmer text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || loginStep !== 'idle'}
              className="w-full btn-neon disabled:opacity-50"
            >
              {loading ? 'កំពុងចូល...' : 'ចូល'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-obsidian-50 text-white/30 text-xs">{'ឬចូលដោយ'}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              disabled={loading || googleLoading || loginStep !== 'idle'}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-white/10
                               rounded-lg hover:bg-white/5 transition-colors text-sm text-white/70 disabled:opacity-50"
            >
              {googleLoading ? (
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {googleLoading ? 'កំពុងចូល...' : 'Google'}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-white/30 font-khmer">
            {'មិនទាន់មានគណនី?'}{' '}
            <Link href="/register" className="text-neon hover:underline">{'ចុះឈ្មោះ'}</Link>
          </p>
        </div>

        <Link href="/" className="block text-center mt-4 text-sm text-white/30 hover:text-neon transition-colors font-khmer">
          {'← ត្រឡប់ទៅទំព័រដើម'}
        </Link>
      </motion.div>
    </div>
  )
}
