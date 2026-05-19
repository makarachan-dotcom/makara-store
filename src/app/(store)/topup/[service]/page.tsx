'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'

const SERVICE_INFO: Record<string, { name: string; nameKm: string; icon: string }> = {
  chatgpt: { name: 'ChatGPT Plus', nameKm: 'ChatGPT Plus', icon: '\uD83E\uDD16' },
  claude: { name: 'Claude Pro', nameKm: 'Claude Pro', icon: '\uD83E\uDDE0' },
  gemini: { name: 'Gemini Pro', nameKm: 'Gemini Pro', icon: '\u2728' },
}

type Step = 'verify' | 'security' | 'confirm' | 'result'
type TaskStatus = 'idle' | 'queued' | 'processing' | 'success' | 'failed'

export default function TopupServicePage() {
  const { locale } = useTranslation()
  const params = useParams()
  const service = params.service as string
  const info = SERVICE_INFO[service]

  const [step, setStep] = useState<Step>('verify')
  const [cardKey, setCardKey] = useState('')
  const [cardValid, setCardValid] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [verifyError, setVerifyError] = useState('')

  const [accessToken, setAccessToken] = useState('')
  const [securityConfirmed, setSecurityConfirmed] = useState(false)

  const [taskStatus, setTaskStatus] = useState<TaskStatus>('idle')
  const [taskMessage, setTaskMessage] = useState('')
  const [taskId, setTaskId] = useState('')

  const [stockAvailable, setStockAvailable] = useState<number | null>(null)

  useEffect(() => {
    if (!service) return
    fetch(`/api/topup/${service}/query-stock`)
      .then(res => res.json())
      .then(data => setStockAvailable(data.available ?? 0))
      .catch(() => setStockAvailable(0))
  }, [service])

  const handleVerifyKey = async () => {
    if (!cardKey.trim()) return
    setVerifying(true)
    setVerifyError('')
    try {
      const res = await fetch('/api/topup/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardKey: cardKey.trim(), service }),
      })
      const data = await res.json()
      if (data.valid) {
        setCardValid(true)
        setStep('security')
      } else {
        setVerifyError(data.error || (locale === 'km' ? 'Card Key \u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C' : 'Invalid Card Key'))
      }
    } catch {
      setVerifyError(locale === 'km' ? '\u1780\u17C6\u17A0\u17BB\u179F\u1794\u1789\u17D2\u1787\u17B6\u179A\u17B7\u1780' : 'Network error')
    } finally {
      setVerifying(false)
    }
  }

  const handleSecurityCheck = () => {
    if (!accessToken.trim()) return
    setSecurityConfirmed(true)
    setStep('confirm')
  }

  const handleExecuteUpgrade = async () => {
    setTaskStatus('queued')
    setStep('result')
    try {
      const res = await fetch(`/api/topup/${service}/upgrade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardKey: cardKey.trim(), accessToken: accessToken.trim() }),
      })
      const data = await res.json()
      if (data.taskId) {
        setTaskId(data.taskId)
        setTaskStatus('processing')
      } else {
        setTaskStatus('failed')
        setTaskMessage(data.error || 'Failed to start upgrade')
      }
    } catch {
      setTaskStatus('failed')
      setTaskMessage('Network error')
    }
  }

  const pollTaskStatus = useCallback(async () => {
    if (!taskId) return
    try {
      const res = await fetch(`/api/topup/${service}/check-task?taskId=${taskId}`)
      const data = await res.json()
      if (data.status === 'success') {
        setTaskStatus('success')
        setTaskMessage(data.message || 'Upgrade completed successfully!')
      } else if (data.status === 'failed') {
        setTaskStatus('failed')
        setTaskMessage(data.message || 'Upgrade failed')
      }
    } catch {
      // Will retry
    }
  }, [taskId, service])

  useEffect(() => {
    if (taskStatus !== 'processing') return
    const interval = setInterval(pollTaskStatus, 5000)
    return () => clearInterval(interval)
  }, [taskStatus, pollTaskStatus])

  if (!info) {
    return (
      <div className="cyber-grid-bg min-h-screen flex items-center justify-center">
        <div className="card-gaming p-6 text-center">
          <p className="text-white/50 mb-4">Service not found</p>
          <Link href="/topup" className="btn-neon text-sm">Back to Top-Up</Link>
        </div>
      </div>
    )
  }

  const steps = [
    { id: 'verify', label: locale === 'km' ? '\u1795\u17D2\u1791\u17C0\u1784\u1795\u17D2\u1791\u17B6\u178F\u17CB Card Key' : 'Verify Card Key', num: 1 },
    { id: 'security', label: locale === 'km' ? '\u1796\u17B7\u1793\u17B7\u178F\u17D2\u1799\u179F\u17BB\u179C\u178F\u17D2\u1790\u17B7\u1797\u17B6\u1796' : 'Security Check', num: 2 },
    { id: 'confirm', label: locale === 'km' ? '\u1794\u1789\u17D2\u1787\u17B6\u1780\u17CB\u1780\u17B6\u179A\u1794\u17D2\u179A\u178F\u17B7\u1794\u178F\u17D2\u178F\u17B7' : 'Confirm Execute', num: 3 },
    { id: 'result', label: locale === 'km' ? '\u179B\u1791\u17D2\u1792\u1795\u179B' : 'Result', num: 4 },
  ]

  return (
    <div className="cyber-grid-bg min-h-screen">
      <div className="max-w-xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/topup" className="text-white/30 hover:text-neon transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <span className="text-2xl">{info.icon}</span>
          <h1 className="text-xl font-display font-bold text-white">{info.name} Top-Up</h1>
        </div>

        {/* Service Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {Object.entries(SERVICE_INFO).map(([key, svc]) => (
            <Link key={key} href={`/topup/${key}`}
              className={`px-4 py-2 rounded-lg text-xs whitespace-nowrap transition-all ${key === service ? 'bg-neon/10 text-neon border border-neon/30' : 'text-white/40 hover:text-white/60 border border-white/5'}`}>
              {svc.icon} {svc.name}
            </Link>
          ))}
          <Link href="/topup" className="px-4 py-2 rounded-lg text-xs whitespace-nowrap text-white/40 hover:text-white/60 border border-white/5">
            {locale === 'km' ? '\u1796\u17B7\u1793\u17B7\u178F\u17D2\u1799\u179F\u17D2\u178F\u17BB\u1780' : 'Check Stock'}
          </Link>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, i) => {
            const stepIdx = steps.findIndex(st => st.id === step)
            const isActive = i <= stepIdx
            return (
              <div key={s.id} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${isActive ? 'border-neon bg-neon/10 text-neon' : 'border-white/10 text-white/20'}`}>
                  {s.num}
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${i < stepIdx ? 'bg-neon/30' : 'bg-white/5'}`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Stock Info */}
        {stockAvailable !== null && (
          <div className={`card-gaming p-3 mb-6 text-center text-xs ${stockAvailable > 0 ? 'border-green-500/20' : 'border-red-500/20'}`}>
            {stockAvailable > 0
              ? <span className="text-green-400">{locale === 'km' ? `\u1798\u17B6\u1793\u179F\u17D2\u178F\u17BB\u1780: ${stockAvailable}` : `In Stock: ${stockAvailable} available`}</span>
              : <span className="text-red-400">{locale === 'km' ? '\u17A2\u179F\u17CB\u179F\u17D2\u178F\u17BB\u1780 - \u179F\u17BC\u1798\u179B\u17D2\u1794\u1784\u1798\u17D2\u178F\u1784\u178F\u17C0\u178F\u1796\u17C1\u179B\u1780\u17D2\u179A\u17C4\u1799' : 'Out of Stock - Please try again later'}</span>
            }
          </div>
        )}

        {/* Step 1: Verify Card Key */}
        {step === 'verify' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-gaming p-6">
            <h3 className="text-neon font-semibold mb-4">
              {locale === 'km' ? '\u1794\u1789\u17D2\u1785\u17BC\u179B Card Key \u179A\u1794\u179F\u17CB\u17A2\u17D2\u1793\u1780' : 'Enter your Card Key'}
            </h3>
            <input
              type="text"
              value={cardKey}
              onChange={e => setCardKey(e.target.value.toUpperCase())}
              placeholder="AAAABBBBCCCCDDDD"
              className="w-full bg-obsidian-100 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-center text-lg tracking-widest placeholder:text-white/20 focus:border-neon/50 focus:outline-none mb-4"
              maxLength={32}
            />
            {verifyError && <p className="text-red-400 text-xs mb-3 text-center">{verifyError}</p>}
            <button onClick={handleVerifyKey} disabled={!cardKey.trim() || verifying || stockAvailable === 0}
              className="w-full btn-gold py-3 text-sm font-bold disabled:opacity-50">
              {verifying ? (locale === 'km' ? '\u1780\u17C6\u1796\u17BB\u1784\u1795\u17D2\u1791\u17C0\u1784\u1795\u17D2\u1791\u17B6\u178F\u17CB...' : 'Verifying...') : (locale === 'km' ? '\u1795\u17D2\u1791\u17C0\u1784\u1795\u17D2\u1791\u17B6\u178F\u17CB Card Key' : 'Redeem Card Key')}
            </button>
            <div className="mt-4 text-xs text-white/30 space-y-1">
              <p>{locale === 'km' ? '\u2022 \u1796\u17B7\u1793\u17B7\u178F\u17D2\u1799\u179F\u17D2\u178F\u17BB\u1780\u1798\u17BB\u1793\u1796\u17C1\u179B\u1794\u1789\u17D2\u1785\u17BC\u179B\u1794\u17D2\u179A\u17B6\u1780\u17CB' : '\u2022 Check stock before redeeming'}</p>
              <p>{locale === 'km' ? '\u2022 Card Key \u17A2\u17B6\u1785\u1794\u17D2\u179A\u17BE\u1794\u17B6\u1793\u178F\u17C2\u1798\u17D2\u178F\u1784' : '\u2022 Each Card Key can only be used once'}</p>
            </div>
          </motion.div>
        )}

        {/* Step 2: Security Check */}
        {step === 'security' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-gaming p-6">
            <h3 className="text-neon font-semibold mb-4">
              {locale === 'km' ? '\u1796\u17B7\u1793\u17B7\u178F\u17D2\u1799\u179F\u17BB\u179C\u178F\u17D2\u1790\u17B7\u1797\u17B6\u1796' : 'Security Check'}
            </h3>
            <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-400 text-xs">{locale === 'km' ? 'Card Key \u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C!' : 'Card Key verified!'}</span>
            </div>
            <label className="block text-white/50 text-xs mb-2">
              {info.name + ' Access Token'}
            </label>
            <textarea
              value={accessToken}
              onChange={e => setAccessToken(e.target.value)}
              placeholder={locale === 'km' ? '\u1794\u17B7\u1791\u1797\u17D2\u1787\u17B6\u1794\u17CB Access Token \u179A\u1794\u179F\u17CB\u17A2\u17D2\u1793\u1780\u1793\u17C5\u1791\u17B8\u1793\u17C1\u17C7 (eyJhbGci...)' : 'Paste your valid Access Token here (eyJhbGci...)'}
              className="w-full bg-obsidian-100 border border-white/10 rounded-lg px-4 py-3 text-white text-sm font-mono placeholder:text-white/20 focus:border-neon/50 focus:outline-none mb-4 resize-none h-20"
            />
            <button onClick={handleSecurityCheck} disabled={!accessToken.trim()}
              className="w-full btn-gold py-3 text-sm font-bold disabled:opacity-50">
              {locale === 'km' ? '\u1794\u1793\u17D2\u178F \u2192' : 'Continue \u2192'}
            </button>
            <button onClick={() => setStep('verify')} className="w-full text-white/30 hover:text-white/50 text-xs mt-3">
              {locale === 'km' ? '\u2190 \u178F\u17D2\u179A\u17A1\u1794\u17CB\u1780\u17D2\u179A\u17C4\u1799' : '\u2190 Go back'}
            </button>
          </motion.div>
        )}

        {/* Step 3: Confirm */}
        {step === 'confirm' && securityConfirmed && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-gaming p-6">
            <h3 className="text-neon font-semibold mb-4">
              {locale === 'km' ? '\u1794\u1789\u17D2\u1787\u17B6\u1780\u17CB\u1780\u17B6\u179A\u178A\u17C6\u17A1\u17BE\u1784\u1780\u17B6\u179A' : 'Confirm Upgrade'}
            </h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-white/40">{locale === 'km' ? '\u179F\u17C1\u179C\u17B6\u1780\u1798\u17D2\u1798' : 'Service'}</span>
                <span className="text-white">{info.icon} {info.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Card Key</span>
                <span className="text-white font-mono">{cardKey.slice(0, 4)}****{cardKey.slice(-4)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Access Token</span>
                <span className="text-white font-mono">{accessToken.length > 20 ? accessToken.slice(0, 10) + '...' + accessToken.slice(-6) : accessToken}</span>
              </div>
            </div>
            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3 mb-4 text-xs text-yellow-400">
              {locale === 'km'
                ? '\u1796\u17C1\u179B\u1785\u17BB\u1785\u1794\u1789\u17D2\u1787\u17B6\u1780\u17CB \u1780\u17B6\u179A\u178A\u17C6\u17A1\u17BE\u1784\u1780\u17B6\u179A\u1798\u17B7\u1793\u17A2\u17B6\u1785\u1794\u17D2\u179A\u17C0\u179C\u17B7\u1789\u17D4'
                : 'Once confirmed, this action cannot be reversed.'}
            </div>
            <button onClick={handleExecuteUpgrade} className="w-full btn-gold py-3 text-sm font-bold">
              {locale === 'km' ? '\u1794\u1789\u17D2\u1787\u17B6\u1780\u17CB \u1793\u17B7\u1784\u178A\u17C6\u17A1\u17BE\u1784\u1780\u17B6\u179A' : 'Confirm & Execute Upgrade'}
            </button>
            <button onClick={() => setStep('security')} className="w-full text-white/30 hover:text-white/50 text-xs mt-3">
              {locale === 'km' ? '\u2190 \u178F\u17D2\u179A\u17A1\u1794\u17CB\u1780\u17D2\u179A\u17C4\u1799' : '\u2190 Go back'}
            </button>
          </motion.div>
        )}

        {/* Step 4: Result */}
        {step === 'result' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-gaming p-6 text-center">
            {(taskStatus === 'queued' || taskStatus === 'processing') && (
              <>
                <div className="w-12 h-12 mx-auto border-2 border-neon border-t-transparent rounded-full animate-spin mb-4" />
                <h3 className="text-white font-bold mb-2">
                  {taskStatus === 'queued'
                    ? (locale === 'km' ? '\u1780\u17C6\u1796\u17BB\u1784\u179A\u1784\u17CB\u1785\u17B6\u17C6...' : 'Queued...')
                    : (locale === 'km' ? '\u1780\u17C6\u1796\u17BB\u1784\u178A\u17C6\u178E\u17BE\u179A\u1780\u17B6\u179A...' : 'Processing...')}
                </h3>
                <p className="text-white/40 text-sm">{locale === 'km' ? '\u179F\u17BC\u1798\u179A\u1784\u17CB\u1785\u17B6\u17C6\u1798\u17BD\u1799\u1797\u17D2\u179B\u17C1\u178F' : 'Please wait a moment'}</p>
              </>
            )}
            {taskStatus === 'success' && (
              <>
                <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-white font-bold mb-2">{locale === 'km' ? '\u178A\u17C6\u17A1\u17BE\u1784\u1780\u17B6\u179A\u1787\u17C4\u1782\u1787\u17D0\u1799!' : 'Upgrade Successful!'}</h3>
                <p className="text-white/50 text-sm mb-4">{taskMessage}</p>
                <Link href="/topup" className="btn-neon text-sm">{locale === 'km' ? '\u178F\u17D2\u179A\u17A1\u1794\u17CB\u1791\u17C5\u1791\u17C6\u1796\u17D0\u179A\u178A\u17BE\u1798' : 'Back to Top-Up'}</Link>
              </>
            )}
            {taskStatus === 'failed' && (
              <>
                <div className="w-16 h-16 mx-auto bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-white font-bold mb-2">{locale === 'km' ? '\u178A\u17C6\u17A1\u17BE\u1784\u1780\u17B6\u179A\u1794\u179A\u17B6\u1787\u17D0\u1799' : 'Upgrade Failed'}</h3>
                <p className="text-red-400 text-sm mb-4">{taskMessage}</p>
                <Link href="/topup" className="btn-neon text-sm">{locale === 'km' ? '\u178F\u17D2\u179A\u17A1\u1794\u17CB\u1791\u17C5\u1791\u17C6\u1796\u17D0\u179A\u178A\u17BE\u1798' : 'Back to Top-Up'}</Link>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
