'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

type ResetStep = 'email' | 'verify' | 'reset' | 'success'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<ResetStep>('email')
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [token, setToken] = useState('')

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email) {
      setError('សូមបំពេញអ៊ីមែល។')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.success) {
        setStep('verify')
      } else {
        setError(data.error || 'មានកំហុស។ សូមព្យាយាមម្តងទៀត។')
      }
    } catch {
      setError('មានកំហុសក្នុងការភ្ជាប់។ សូមព្យាយាមម្តងទៀត។')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!verificationCode || verificationCode.length !== 6) {
      setError('សូមបំពេញលេខកូដ 6 ខ្ទង់។')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/verify-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode }),
      })
      const data = await res.json()
      if (data.success) {
        setToken(data.token)
        setStep('reset')
      } else {
        setError(data.error || 'លេខកូដមិនត្រឹមត្រូវ។')
      }
    } catch {
      setError('មានកំហុស។ សូមព្យាយាមម្តងទៀត។')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (newPassword.length < 8) {
      setError('ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ 8 តួអក្សរ។')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('ពាក្យសម្ងាត់មិនត្រូវគ្នា។')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword }),
      })
      const data = await res.json()
      if (data.success) {
        setStep('success')
      } else {
        setError(data.error || 'មានកំហុស។ សូមព្យាយាមម្តងទៀត។')
      }
    } catch {
      setError('មានកំហុស។ សូមព្យាយាមម្តងទៀត។')
    } finally {
      setLoading(false)
    }
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
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {(['email', 'verify', 'reset'] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === s || (['verify', 'reset', 'success'].indexOf(step) > i - 1 && i < ['verify', 'reset', 'success'].indexOf(step) + 1)
                    ? 'bg-neon text-obsidian'
                    : 'bg-white/10 text-white/30'
                }`}>
                  {i + 1}
                </div>
                {i < 2 && <div className={`w-8 h-0.5 ${
                  ['verify', 'reset', 'success'].indexOf(step) > i ? 'bg-neon' : 'bg-white/10'
                }`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Enter email */}
          {step === 'email' && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <h2 className="text-lg font-semibold text-white mb-2 font-khmer text-center">
                {'សង្គ្រោះគណនី'}
              </h2>
              <p className="text-white/40 text-sm text-center font-khmer mb-4">
                {'បញ្ចូលអ៊ីមែលរបស់អ្នកដើម្បីទទួលលេខកូដសង្គ្រោះ'}
              </p>
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
                />
              </div>
              {error && <p className="text-red-400 text-sm font-khmer text-center">{error}</p>}
              <button type="submit" disabled={loading} className="w-full btn-neon disabled:opacity-50">
                {loading ? 'កំពុងផ្ញើ...' : 'ផ្ញើលេខកូដសង្គ្រោះ'}
              </button>
            </form>
          )}

          {/* Step 2: Verify code */}
          {step === 'verify' && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <h2 className="text-lg font-semibold text-white mb-2 font-khmer text-center">
                {'បញ្ចូលលេខកូដផ្ទៀងផ្ទាត់'}
              </h2>
              <p className="text-white/40 text-sm text-center font-khmer mb-4">
                {'យើងបានផ្ញើលេខកូដ 6 ខ្ទង់ទៅអ៊ីមែល'} <span className="text-neon">{email}</span>
              </p>
              <div>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-3
                             text-white text-center text-2xl tracking-[0.5em] font-mono
                             placeholder-white/20 focus:outline-none focus:border-neon/50"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>
              {error && <p className="text-red-400 text-sm font-khmer text-center">{error}</p>}
              <button type="submit" disabled={loading} className="w-full btn-neon disabled:opacity-50">
                {loading ? 'កំពុងផ្ទៀងផ្ទាត់...' : 'ផ្ទៀងផ្ទាត់លេខកូដ'}
              </button>
              <button
                type="button"
                onClick={() => { setStep('email'); setError('') }}
                className="w-full text-sm text-white/30 hover:text-neon transition-colors font-khmer"
              >
                {'ត្រឡប់ក្រោយ'}
              </button>
            </form>
          )}

          {/* Step 3: Reset password */}
          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <h2 className="text-lg font-semibold text-white mb-2 font-khmer text-center">
                {'កំណត់ពាក្យសម្ងាត់ថ្មី'}
              </h2>
              <div>
                <label className="block text-sm text-white/40 font-khmer mb-1.5">{'ពាក្យសម្ងាត់ថ្មី'}</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5
                             text-white placeholder-white/20 focus:outline-none focus:border-neon/50"
                  placeholder="យ៉ាងហោចណាស់ 8 តួអក្សរ"
                  minLength={8}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-white/40 font-khmer mb-1.5">{'បញ្ជាក់ពាក្យសម្ងាត់'}</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5
                             text-white placeholder-white/20 focus:outline-none focus:border-neon/50"
                  placeholder="បញ្ចូលពាក្យសម្ងាត់ម្តងទៀត"
                  minLength={8}
                  required
                />
              </div>
              {error && <p className="text-red-400 text-sm font-khmer text-center">{error}</p>}
              <button type="submit" disabled={loading} className="w-full btn-neon disabled:opacity-50">
                {loading ? 'កំពុងកំណត់...' : 'កំណត់ពាក្យសម្ងាត់ថ្មី'}
              </button>
            </form>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white font-khmer">{'ពាក្យសម្ងាត់បានផ្លាស់ប្តូរដោយជោគជ័យ!'}</h2>
              <p className="text-white/40 text-sm font-khmer">{'អ្នកអាចចូលគណនីដោយប្រើពាក្យសម្ងាត់ថ្មីរបស់អ្នកឥឡូវនេះ។'}</p>
              <Link href="/login" className="btn-neon inline-block text-sm">
                {'ចូលគណនី'}
              </Link>
            </div>
          )}
        </div>

        <Link href="/login" className="block text-center mt-4 text-sm text-white/30 hover:text-neon transition-colors font-khmer">
          {'← ត្រឡប់ទៅទំព័រចូលគណនី'}
        </Link>
      </motion.div>
    </div>
  )
}
