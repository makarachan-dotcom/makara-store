'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'
import Link from 'next/link'

type ServiceTab = 'chatgpt' | 'claude' | 'gemini'
type UpgradeStep = 1 | 2 | 3 | 4

const STEPS_KM = [
  { num: 1, label: 'ផ្ទៀងផ្ទាត់កូដ' },
  { num: 2, label: 'Access Token' },
  { num: 3, label: 'បញ្ជាក់ការដំឡើង' },
  { num: 4, label: 'បើកដំណើរការ' },
]

const STEPS_EN = [
  { num: 1, label: 'Verify Code' },
  { num: 2, label: 'Access Token' },
  { num: 3, label: 'Confirm' },
  { num: 4, label: 'Activate' },
]

const NOTICES_KM = [
  {
    title: 'ពិនិត្យស្តុកមុន',
    text: 'មុនពេលដំឡើង សូមពិនិត្យស្ថានភាពស្តុកផលិតផល។ ប្រសិនបើបង្ហាញ "អស់ស្តុក" សូមរង់ចាំការបំពេញបន្ថែម។',
  },
  {
    title: 'អំពីការដំឡើងលើគ្នា',
    text: 'ប្រសិនបើគណនីរបស់អ្នកបច្ចុប្បន្នជា Plus/Pro ការបញ្ចូលផ្ទាល់នឹងសរសេរជាន់ (គណនាឡើងវិញ) រយៈពេលដែលមាន មិនបន្ថែមទេ! សូមរង់ចាំដល់ផុតកំណត់ រួចបញ្ចូលឡើងវិញ។',
  },
]

const NOTICES_EN = [
  {
    title: 'Check Stock First',
    text: 'Before upgrading, please check the product stock status. If it shows "Out of Stock", please wait for restocking.',
  },
  {
    title: 'About Stacking Upgrades',
    text: 'If your account is currently Plus/Pro, force-charging will overwrite (recalculate) the existing period, not stack! Wait until expiry then recharge.',
  },
]

export default function ChatGPTUpgradePage() {
  const { locale } = useTranslation()
  const [activeTab, setActiveTab] = useState<ServiceTab>('chatgpt')
  const [currentStep, setCurrentStep] = useState<UpgradeStep>(1)
  const [serialCode, setSerialCode] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [verifyResult, setVerifyResult] = useState<{ valid: boolean; product?: string; productKm?: string } | null>(null)
  const [verifyError, setVerifyError] = useState('')
  const [taskId, setTaskId] = useState<string | null>(null)
  const [taskStatus, setTaskStatus] = useState<string>('')
  const [taskMessage, setTaskMessage] = useState<string>('')
  const [upgradeError, setUpgradeError] = useState('')
  const [copied, setCopied] = useState(false)

  const steps = locale === 'km' ? STEPS_KM : STEPS_EN
  const notices = locale === 'km' ? NOTICES_KM : NOTICES_EN

  const handleTabChange = useCallback((tab: ServiceTab) => {
    setActiveTab(tab)
    setCurrentStep(1)
    setSerialCode('')
    setAccessToken('')
    setIsCompleted(false)
    setVerifyResult(null)
    setVerifyError('')
    setTaskId(null)
    setUpgradeError('')
  }, [])

  const handleStartService = useCallback(() => {
    setShowIntro(false)
  }, [])

  const handleVerifyCode = useCallback(async () => {
    if (!serialCode.trim()) return
    setVerifyError('')
    setIsProcessing(true)

    try {
      const res = await fetch('/api/topup/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardKey: serialCode.trim() }),
      })
      const data = await res.json()

      if (data.valid) {
        setVerifyResult(data)
        setCurrentStep(2)
      } else {
        setVerifyError(
          locale === 'km'
            ? 'កូដមិនត្រឹមត្រូវ ឬមិនទាន់បានដំណើរការ។ សូមពិនិត្យមើលកូដរបស់អ្នកម្តងទៀត។'
            : 'Invalid code or not yet activated. Please check your code and try again.'
        )
      }
    } catch {
      setVerifyError(
        locale === 'km' ? 'កំហុសបណ្តាញ។ សូមព្យាយាមម្តងទៀត។' : 'Network error. Please try again.'
      )
    } finally {
      setIsProcessing(false)
    }
  }, [serialCode, locale])

  const handleConfirmUpgrade = useCallback(async () => {
    setUpgradeError('')
    setIsProcessing(true)
    setCurrentStep(4)

    try {
      const res = await fetch(`/api/topup/${activeTab}/upgrade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardKey: serialCode.trim(),
          accessToken: accessToken.trim(),
        }),
      })
      const data = await res.json()

      if (data.taskId) {
        setTaskId(data.taskId)
        setTaskStatus('QUEUED')
      } else {
        setUpgradeError(data.error || 'Failed to submit upgrade')
        setIsProcessing(false)
      }
    } catch {
      setUpgradeError(
        locale === 'km' ? 'កំហុសបណ្តាញ។ សូមព្យាយាមម្តងទៀត។' : 'Network error. Please try again.'
      )
      setIsProcessing(false)
    }
  }, [activeTab, serialCode, accessToken, locale])

  // Poll task status
  useEffect(() => {
    if (!taskId || isCompleted) return

    const poll = async () => {
      try {
        const res = await fetch(`/api/topup/${activeTab}/check-task?taskId=${taskId}`)
        const data = await res.json()
        setTaskStatus(data.status)
        setTaskMessage(data.message || '')

        if (data.status === 'SUCCESS') {
          setIsCompleted(true)
          setIsProcessing(false)
        } else if (data.status === 'FAILED') {
          setUpgradeError(data.message || 'Upgrade failed')
          setIsProcessing(false)
        }
      } catch {
        // Continue polling
      }
    }

    const interval = setInterval(poll, 3000)
    return () => {
      clearInterval(interval)
    }
  }, [taskId, activeTab, isCompleted])

  const handleReset = useCallback(() => {
    setCurrentStep(1)
    setSerialCode('')
    setAccessToken('')
    setIsCompleted(false)
    setIsProcessing(false)
    setVerifyResult(null)
    setVerifyError('')
    setTaskId(null)
    setTaskStatus('')
    setTaskMessage('')
    setUpgradeError('')
  }, [])

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 max-w-md w-full text-center border border-gray-100"
        >
          <p className="text-xs font-mono tracking-[0.3em] text-blue-500 mb-6 uppercase">
            Self &middot; Service
          </p>
          <h1 className="text-xl font-bold text-gray-900 mb-3">
            {locale === 'km'
              ? 'Makara Store ប្រព័ន្ធដំឡើងស្វ័យប្រវត្តិ'
              : 'Makara Store Self-Service Upgrade'}
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            {locale === 'km'
              ? 'ផ្ទៀងផ្ទាត់កូដ Card Key · បើកដំណើរការរហ័ស · ដំឡើងសុវត្ថិភាព'
              : 'Verify Card Key · Fast activation · Secure upgrade'}
          </p>
          <button
            onClick={handleStartService}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-[0.98]"
          >
            {locale === 'km' ? 'ចាប់ផ្តើមសេវាកម្ម' : 'Start Service'}
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
              {activeTab === 'chatgpt' && 'ChatGPT'}
              {activeTab === 'claude' && 'Claude'}
              {activeTab === 'gemini' && 'Gemini'}
            </span>{' '}
            <span className="text-gray-900">
              {locale === 'km' ? 'ប្រព័ន្ធដំឡើងស្វ័យប្រវត្តិ' : 'Self-Service Upgrade'}
            </span>
          </h1>
          <p className="text-gray-500 text-sm">
            Makara Store {locale === 'km' ? 'ផ្លូវការដំឡើង' : 'Official Upgrade Channel'}
          </p>
        </motion.div>

        {/* Service Toggle Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-2 sm:gap-3 mb-8 flex-wrap"
        >
          {([
            { key: 'chatgpt' as ServiceTab, label: 'ChatGPT', icon: '⚫' },
            { key: 'claude' as ServiceTab, label: 'Claude', icon: '🟠' },
            { key: 'gemini' as ServiceTab, label: 'Gemini', icon: '✨' },
          ]).map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === key
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
              }`}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
          <Link
            href="/category/all"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all duration-200"
          >
            {locale === 'km' ? '🛒 ទិញកាតសម្ងាត់' : '🛒 Buy Card Keys'}
          </Link>
        </motion.div>

        {/* Step Progress Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between max-w-lg mx-auto px-4">
            {steps.map((step, i) => (
              <div key={step.num} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      currentStep >= step.num
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step.num ? (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.num
                    )}
                  </div>
                  <span className={`text-[10px] sm:text-xs mt-1.5 font-medium whitespace-nowrap ${
                    currentStep >= step.num ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 sm:mx-3 rounded-full transition-all duration-500 ${
                    currentStep > step.num ? 'bg-blue-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* Step 1: Verify Card Key */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 max-w-xl mx-auto"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {locale === 'km'
                  ? 'បញ្ចូលកូដ Card Key របស់អ្នក'
                  : 'Enter your Card Key code'}
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                {locale === 'km'
                  ? 'កូដ Card Key ត្រូវបានផ្ញើអោយអ្នកបន្ទាប់ពីការបង់ប្រាក់ត្រូវបានផ្ទៀងផ្ទាត់។'
                  : 'Your Card Key code was delivered after your payment was verified.'}
              </p>
              <div className="mb-4">
                <textarea
                  value={serialCode}
                  onChange={(e) => { setSerialCode(e.target.value); setVerifyError('') }}
                  placeholder={locale === 'km'
                    ? 'បិទភ្ជាប់កូដ Card Key នៅទីនេះ...'
                    : 'Paste your Card Key code here...'}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none h-24 text-sm font-mono transition-all"
                />
              </div>
              {verifyError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                  <p className="text-xs text-red-600">{verifyError}</p>
                </div>
              )}
              <button
                onClick={handleVerifyCode}
                disabled={!serialCode.trim() || isProcessing}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3.5 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-[0.98]"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    {locale === 'km' ? 'កំពុងផ្ទៀងផ្ទាត់...' : 'Verifying...'}
                  </span>
                ) : (
                  locale === 'km' ? 'ផ្ទៀងផ្ទាត់កូដ' : 'Verify Code'
                )}
              </button>
            </motion.div>
          )}

          {/* Step 2: Account Info */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 max-w-xl mx-auto"
            >
              {verifyResult && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-sm font-semibold text-green-700">
                      {locale === 'km' ? 'កូដត្រឹមត្រូវ!' : 'Code Verified!'}
                    </p>
                  </div>
                  <p className="text-xs text-green-600">
                    {locale === 'km' ? `ផលិតផល: ${verifyResult.productKm || verifyResult.product}` : `Product: ${verifyResult.product}`}
                  </p>
                </div>
              )}

              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {locale === 'km'
                  ? 'បញ្ចូល Access Token គណនី'
                  : 'Enter Your Access Token'}
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                {locale === 'km'
                  ? `បិទភ្ជាប់ Access Token គណនី ${activeTab === 'chatgpt' ? 'ChatGPT' : activeTab === 'claude' ? 'Claude' : 'Gemini'} របស់អ្នក។ Token នេះត្រូវបានប្រើដើម្បីដំឡើងគណនីរបស់អ្នកដោយស្វ័យប្រវត្តិ។`
                  : `Paste your ${activeTab === 'chatgpt' ? 'ChatGPT' : activeTab === 'claude' ? 'Claude' : 'Gemini'} Access Token. This token is used to automatically upgrade your account.`}
              </p>
              <div className="mb-4">
                <textarea
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder={locale === 'km'
                    ? 'បិទភ្ជាប់ Access Token របស់អ្នកនៅទីនេះ (eyJhbGci...)'
                    : 'Paste your valid Access Token here (eyJhbGci...)'}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-mono resize-none h-24 transition-all"
                />
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                <p className="text-xs text-blue-700 leading-relaxed font-medium mb-1">
                  {locale === 'km' ? 'របៀបទទួល Access Token:' : 'How to get your Access Token:'}
                </p>
                <ol className="text-xs text-blue-600 leading-relaxed list-decimal list-inside space-y-1">
                  <li>{locale === 'km' ? 'ចូលគណនី ChatGPT របស់អ្នកក្នុង browser' : 'Log in to your ChatGPT account in your browser'}</li>
                  <li>{locale === 'km' ? 'ចូលទៅ: chat.openai.com/api/auth/session' : 'Go to: chat.openai.com/api/auth/session'}</li>
                  <li>{locale === 'km' ? 'ចម្លងតម្លៃ "accessToken" ទាំងមូល' : 'Copy the entire "accessToken" value'}</li>
                </ol>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98]"
                >
                  {locale === 'km' ? 'ត្រឡប់ក្រោយ' : 'Go Back'}
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={!accessToken.trim()}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3.5 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                >
                  {locale === 'km' ? 'បន្ត' : 'Continue'}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirm */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 max-w-xl mx-auto"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {locale === 'km' ? 'បញ្ជាក់ការដំឡើង' : 'Confirm Upgrade'}
              </h2>

              <div className="space-y-3 mb-6">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">
                    {locale === 'km' ? 'សេវាកម្ម:' : 'Service:'}
                  </p>
                  <p className="text-sm font-bold text-gray-900 capitalize">{activeTab}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Card Key:</p>
                      <p className="text-sm font-mono text-gray-900 break-all">
                        {serialCode.length > 20 ? serialCode.slice(0, 20) + '...' : serialCode}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopy(serialCode)}
                      className="text-xs text-blue-500 hover:text-blue-600 px-2 py-1"
                    >
                      {copied ? (locale === 'km' ? 'បានចម្លង!' : 'Copied!') : (locale === 'km' ? 'ចម្លង' : 'Copy')}
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">
                    {locale === 'km' ? 'Access Token:' : 'Access Token:'}
                  </p>
                  <p className="text-sm font-mono text-gray-900 break-all">
                    {accessToken.length > 30 ? accessToken.slice(0, 15) + '...' + accessToken.slice(-10) : accessToken}
                  </p>
                </div>
                {verifyResult && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <p className="text-xs text-blue-600 mb-1">
                      {locale === 'km' ? 'ផលិតផល:' : 'Product:'}
                    </p>
                    <p className="text-sm font-bold text-blue-700">
                      {locale === 'km' ? verifyResult.productKm || verifyResult.product : verifyResult.product}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <p className="text-xs text-amber-700 font-medium">
                  {locale === 'km'
                    ? '⚠️ ព្រមាន: សូមពិនិត្យមើល Access Token ឱ្យបានត្រឹមត្រូវ។ បន្ទាប់ពីបញ្ជាក់ កូដ Card Key នឹងត្រូវបានចងភ្ជាប់ ហើយមិនអាចត្រឡប់វិញបានទេ!'
                    : '⚠️ Warning: Please verify your Access Token is correct. Once confirmed, the card key will be bound and the upgrade will be executed. This cannot be reversed!'}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98]"
                >
                  {locale === 'km' ? 'ត្រឡប់កែប្រែ' : 'Go Back & Edit'}
                </button>
                <button
                  onClick={handleConfirmUpgrade}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                >
                  {locale === 'km' ? 'បញ្ជាក់ការដំឡើង' : 'Confirm Upgrade'}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Processing / Complete */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 max-w-xl mx-auto text-center"
            >
              {isProcessing ? (
                <>
                  <div className="mb-6">
                    <div className="w-16 h-16 mx-auto mb-4">
                      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">
                      {locale === 'km' ? 'កំពុងដំណើរការ...' : 'Processing Upgrade...'}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {locale === 'km'
                        ? 'កំពុងទំនាក់ទំនងជាមួយម៉ាស៊ីនមេ សូមកុំបិទទំព័រនេះ...'
                        : 'Communicating with servers, please do not close this page...'}
                    </p>
                    {taskStatus && (
                      <p className="text-xs text-blue-500 mt-2 font-mono">
                        Status: {taskStatus}
                      </p>
                    )}
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '90%' }}
                      transition={{ duration: 5, ease: 'easeInOut' }}
                    />
                  </div>
                </>
              ) : upgradeError ? (
                <>
                  <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {locale === 'km' ? 'ការដំឡើងបរាជ័យ' : 'Upgrade Failed'}
                  </h2>
                  <p className="text-sm text-red-500 mb-6">{upgradeError}</p>
                  <button
                    onClick={handleReset}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3.5 px-8 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                  >
                    {locale === 'km' ? 'ព្យាយាមម្តងទៀត' : 'Try Again'}
                  </button>
                </>
              ) : isCompleted ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {locale === 'km' ? 'ការដំឡើងបានជោគជ័យ!' : 'Upgrade Successful!'}
                  </h2>
                  <p className="text-sm text-gray-500 mb-2">
                    {locale === 'km'
                      ? 'កូដរបស់អ្នកត្រូវបានបង្កើតភ្ជាប់ជាមួយគណនីរបស់អ្នក។'
                      : 'Your code has been activated and linked to your account.'}
                  </p>
                  {taskMessage && (
                    <p className="text-xs text-gray-400 mb-6">{taskMessage}</p>
                  )}

                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-left">
                    <p className="text-xs text-green-600 mb-2 font-semibold">
                      {locale === 'km' ? 'សង្ខេប:' : 'Summary:'}
                    </p>
                    <div className="space-y-1 text-xs text-green-700">
                      <p>Service: {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</p>
                      <p>Token: {accessToken.length > 20 ? accessToken.slice(0, 10) + '...' + accessToken.slice(-6) : accessToken}</p>
                      <p>Status: Activated</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleReset}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98]"
                    >
                      {locale === 'km' ? 'ដំឡើងម្តងទៀត' : 'Upgrade Again'}
                    </button>
                    <Link
                      href="/purchase-history"
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20 text-center active:scale-[0.98]"
                    >
                      {locale === 'km' ? 'មើលប្រវត្តិការទិញ' : 'View Orders'}
                    </Link>
                  </div>
                </>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Important Notices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
            <h3 className="font-bold text-amber-800 text-sm">
              {locale === 'km' ? '⚠️ សេចក្តីជូនដំណឹងសំខាន់' : '⚠️ Important Notice'}
            </h3>
          </div>
          <div className="p-6 space-y-5">
            {notices.map((notice, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-amber-500 text-sm mt-0.5 flex-shrink-0">●</span>
                <div>
                  <p className="text-sm font-bold text-gray-800 mb-1">{notice.title}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{notice.text}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
