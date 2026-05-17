'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'

const PIN_LENGTH = 6

export default function AdminVerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard'

  const [pin, setPin] = useState<string[]>(Array(PIN_LENGTH).fill(''))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newPin = [...pin]
    newPin[index] = value.slice(-1)
    setPin(newPin)
    setError('')

    if (value && index < PIN_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, PIN_LENGTH)
    if (!pasteData) return

    const newPin = [...pin]
    for (let i = 0; i < pasteData.length; i++) {
      newPin[i] = pasteData[i]
    }
    setPin(newPin)

    const nextIndex = Math.min(pasteData.length, PIN_LENGTH - 1)
    inputRefs.current[nextIndex]?.focus()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const fullPin = pin.join('')
    if (fullPin.length !== PIN_LENGTH) {
      setError('សូមបញ្ចូលលេខកូដ PIN ទាំង 6 ខ្ទង់')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: fullPin }),
      })

      if (res.ok) {
        setVerified(true)
        setTimeout(() => {
          router.push(callbackUrl)
        }, 800)
      } else {
        const data = await res.json()
        setError(data.error === 'Invalid PIN' ? 'លេខកូដ PIN មិនត្រឹមត្រូវ' : 'មានកំហុស។ សូមព្យាយាមម្តងទៀត។')
        setPin(Array(PIN_LENGTH).fill(''))
        inputRefs.current[0]?.focus()
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
            <Image src="/images/logo.jpg" alt="Admin" width={64} height={64} className="object-cover" />
          </div>
          <h1 className="text-2xl font-display font-bold">
            <span className="text-neon">ADMIN</span> <span className="text-gold">VERIFICATION</span>
          </h1>
        </div>

        <div className="card-gaming p-6">
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-neon/10 border border-neon/20
                            flex items-center justify-center">
              <svg className="w-6 h-6 text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-white font-khmer">ផ្ទៀងផ្ទាត់អត្តសញ្ញាណ</h2>
            <p className="text-sm text-white/40 font-khmer mt-1">
              បញ្ចូលលេខកូដ PIN 6 ខ្ទង់ដើម្បីចូលផ្ទាំងគ្រប់គ្រង
            </p>
          </div>

          {verified ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-400/10 border border-green-400/20
                              flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-green-400 font-khmer">ផ្ទៀងផ្ទាត់ជោគជ័យ! កំពុងបញ្ជូន...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={loading}
                    className="w-12 h-14 text-center text-xl font-mono font-bold
                               bg-obsidian-50 border border-neon/20 rounded-lg
                               text-neon focus:outline-none focus:border-neon/60
                               focus:shadow-[0_0_10px_rgba(0,255,200,0.15)]
                               disabled:opacity-50 transition-all"
                  />
                ))}
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm font-khmer text-center mb-4"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={loading || pin.some(d => !d)}
                className="w-full btn-neon disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span className="font-khmer">កំពុងផ្ទៀងផ្ទាត់...</span>
                  </span>
                ) : (
                  <span className="font-khmer">បញ្ជាក់</span>
                )}
              </button>
            </form>
          )}
        </div>

        <a href="/" className="block text-center mt-4 text-sm text-white/30 hover:text-neon transition-colors font-khmer">
          &larr; ត្រឡប់ទៅគេហទំព័រ
        </a>
      </motion.div>
    </div>
  )
}
