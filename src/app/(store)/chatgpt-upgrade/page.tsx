'use client'

// ទំព័រដំឡើង ChatGPT - Self-Service Upgrade System
import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'
import { useStore } from '@/store/useStore'
import Link from 'next/link'

type ServiceTab = 'chatgpt' | 'claude' | 'gemini'
type UpgradeStep = 1 | 2 | 3 | 4

interface PlanOption {
  id: string
  nameKm: string
  nameEn: string
  price: number
  originalPrice?: number
  descKm: string
  descEn: string
  features: string[]
  badge?: string
  badgeKm?: string
}

const SERVICE_PLANS: Record<ServiceTab, PlanOption[]> = {
  chatgpt: [
    {
      id: 'chatgpt-plus-1m',
      nameKm: 'ChatGPT Plus - \u17E1 \u1781\u17C2',
      nameEn: 'ChatGPT Plus - 1 Month',
      price: 20.00,
      originalPrice: 20.00,
      descKm: 'Plus \u179F\u17D2\u179C\u17D0\u1799\u1794\u17D2\u179A\u179C\u178F\u17D2\u178F\u17B7\u1794\u17BE\u1780/\u1794\u1793\u17D2\u178F \u178A\u17C6\u17A1\u17BE\u1784100% \u1795\u17D2\u179B\u17BC\u179C\u1780\u17B6\u179A iOS',
      descEn: 'Auto open/renew Plus, 100% official iOS in-app purchase',
      features: ['GPT-4o', 'DALL-E 3', 'Advanced Data Analysis', 'Web Browsing', 'Code Interpreter'],
    },
    {
      id: 'chatgpt-plus-3m',
      nameKm: 'ChatGPT Plus - \u17E3 \u1781\u17C2',
      nameEn: 'ChatGPT Plus - 3 Months',
      price: 55.00,
      originalPrice: 60.00,
      descKm: '\u179F\u1793\u17D2\u179F\u17C6\u179F\u17C6\u1785\u17C3\u1787\u17B6\u1798\u17BD\u1799\u1782\u1798\u17D2\u179A\u17C4\u1784 \u17E3 \u1781\u17C2 \u178A\u17C6\u17A1\u17BE\u1784100% \u1795\u17D2\u179B\u17BC\u179C\u1780\u17B6\u179A',
      descEn: 'Save with 3-month plan, 100% official upgrade',
      features: ['GPT-4o', 'DALL-E 3', 'Advanced Data Analysis', 'Priority Access', 'Web Browsing'],
      badge: 'Most Popular',
      badgeKm: '\u1796\u17C1\u1789\u1793\u17B7\u1799\u1798\u1794\u17C6\u1795\u17BB\u178F',
    },
    {
      id: 'chatgpt-pro-1m',
      nameKm: 'ChatGPT Pro - \u17E1 \u1781\u17C2',
      nameEn: 'ChatGPT Pro - 1 Month',
      price: 69.00,
      originalPrice: 200.00,
      descKm: '\u179F\u17D2\u179C\u17D0\u1799\u1794\u17D2\u179A\u179C\u178F\u17D2\u178F\u17B7\u178A\u17C6\u17A1\u17BE\u1784 Pro 5x 20x',
      descEn: 'Auto upgrade to Pro 5x 20x usage',
      features: ['GPT-4o Unlimited', 'o1 Pro Mode', 'Advanced Voice', 'Maximum Usage Limits', 'Research Preview'],
    },
  ],
  claude: [
    {
      id: 'claude-pro-1m',
      nameKm: 'Claude Pro - \u17E1 \u1781\u17C2',
      nameEn: 'Claude Pro - 1 Month',
      price: 23.00,
      originalPrice: 20.00,
      descKm: '\u179F\u17D2\u179C\u17D0\u1799\u1794\u17D2\u179A\u179C\u178F\u17D2\u178F\u17B7\u178A\u17C6\u17A1\u17BE\u1784 Claude Pro 100% \u1795\u17D2\u179B\u17BC\u179C\u1780\u17B6\u179A',
      descEn: 'Auto upgrade Claude Pro, 100% official direct charge',
      features: ['Claude 3.5 Sonnet', 'Priority Access', 'More Usage', 'Projects'],
    },
    {
      id: 'claude-team-1m',
      nameKm: 'Claude Team - \u17E1 \u1781\u17C2',
      nameEn: 'Claude Team Seat - 1 Month',
      price: 26.00,
      originalPrice: 30.00,
      descKm: '\u1780\u17D2\u179A\u17BB\u1798\u1794\u17D2\u179A\u17BE\u1794\u17D2\u179A\u17B6\u179F\u17CB \u1798\u17B6\u1793\u1785\u17D2\u179A\u17BE\u1793\u1787\u17B6\u1784 25% \u1793\u17C3\u1794\u179A\u17B7\u1798\u17B6\u178E\u1795\u17D2\u1791\u17B6\u179B\u17CB\u1781\u17D2\u179B\u17BD\u1793',
      descEn: 'Team edition, 25% more quota than individual',
      features: ['Claude 3.5 Sonnet', 'Team Workspace', 'Admin Console', '25% More Quota'],
      badge: 'Team',
      badgeKm: '\u1780\u17D2\u179A\u17BB\u1798',
    },
  ],
  gemini: [
    {
      id: 'gemini-pro-yearly',
      nameKm: 'Gemini Pro - \u17E1 \u1786\u17D2\u1793\u17B6\u17C6',
      nameEn: 'Gemini Pro - 1 Year',
      price: 16.50,
      originalPrice: 19.99,
      descKm: '\u179F\u17D2\u179C\u17D0\u1799\u1794\u17D2\u179A\u179C\u178F\u17D2\u178F\u17B7\u178A\u17C6\u17A1\u17BE\u1784\u1791\u17C5\u1782\u178E\u1793\u17B8\u1795\u17D2\u1791\u17B6\u179B\u17CB\u1781\u17D2\u179B\u17BD\u1793',
      descEn: 'Self-service charge to your own account, pixel guaranteed',
      features: ['Gemini Pro 1.5', 'Google One AI Premium', '2TB Storage', 'Priority Access'],
    },
  ],
}

const STEPS_KM = [
  { num: 1, label: '\u1795\u17D2\u1791\u17C0\u1784\u1795\u17D2\u1791\u17B6\u178F\u17CB\u1780\u17BC\u178A' },
  { num: 2, label: '\u1796\u17B7\u1793\u17B7\u178F\u17D2\u1799\u179F\u17BB\u179C\u178F\u17D2\u1790\u17B7\u1797\u17B6\u1796' },
  { num: 3, label: '\u1794\u1789\u17D2\u1787\u17B6\u1780\u17CB\u1780\u17B6\u179A\u178A\u17C6\u17A1\u17BE\u1784' },
  { num: 4, label: '\u1794\u17BE\u1780\u178A\u17C6\u178E\u17BE\u179A\u1780\u17B6\u179A' },
]

const STEPS_EN = [
  { num: 1, label: 'Verify Code' },
  { num: 2, label: 'Security Check' },
  { num: 3, label: 'Confirm' },
  { num: 4, label: 'Activate' },
]

const NOTICES_KM = [
  {
    title: '\u1796\u17B7\u1793\u17B7\u178F\u17D2\u1799\u179F\u17D2\u178F\u17BB\u1780\u1798\u17BB\u1793',
    text: '\u1798\u17BB\u1793\u1796\u17C1\u179B\u178A\u17C6\u17A1\u17BE\u1784 \u179F\u17BC\u1798\u1796\u17B7\u1793\u17B7\u178F\u17D2\u1799\u179F\u17D2\u1790\u17B6\u1793\u1797\u17B6\u1796\u179F\u17D2\u178F\u17BB\u1780\u1795\u179B\u17B7\u178F\u1795\u179B\u17D4 \u1794\u17D2\u179A\u179F\u17B7\u1793\u1794\u17BE\u1794\u1784\u17D2\u17A0\u17B6\u1789 "\u17A2\u179F\u17CB\u179F\u17D2\u178F\u17BB\u1780" \u179F\u17BC\u1798\u179A\u1784\u17CB\u1785\u17B6\u17C6\u1780\u17B6\u179A\u1794\u17C6\u1796\u17C1\u1789\u1794\u1793\u17D2\u1790\u17C2\u1798\u17D4',
  },
  {
    title: '\u1780\u17C6\u17A0\u17BB\u179F "\u1782\u17D2\u1798\u17B6\u1793\u1796\u17D0\u178F\u17CC\u1798\u17B6\u1793\u179B\u1798\u17D2\u17A2\u17B7\u178F"',
    text: '\u1794\u17D2\u179A\u179F\u17B7\u1793\u1794\u17BE\u1780\u17B6\u179A\u178A\u17C6\u17A1\u17BE\u1784\u1794\u1784\u17D2\u17A0\u17B6\u1789 "\u1794\u179A\u17B6\u1787\u17D0\u1799 \u1782\u17D2\u1798\u17B6\u1793\u1796\u17D0\u178F\u17CC\u1798\u17B6\u1793\u179B\u1798\u17D2\u17A2\u17B7\u178F" \u179F\u17BC\u1798\u1780\u17BB\u17C6\u1797\u17D0\u1799! \u1793\u17C1\u17C7\u1794\u178E\u17D2\u178F\u17B6\u179B\u1798\u1780\u1796\u17B8\u1794\u178E\u17D2\u178F\u17B6\u1789\u1798\u17B6\u1793\u1780\u17B6\u179A\u1796\u1793\u17D2\u1799\u17BA\u178F\u17D4 \u179F\u17BC\u1798\u1785\u17BC\u179B ChatGPT \u17A0\u17BE\u1799\u1796\u17B7\u1793\u17B7\u178F\u17D2\u1799\u1798\u17BE\u179B \u1780\u17B6\u179A\u1780\u17C6\u178E\u178F\u17CB \u2192 \u178A\u17C6\u17A1\u17BE\u1784 Plus/Pro\u17D4 \u1787\u17B6\u1791\u17BC\u1791\u17C5\u1780\u17B6\u179A\u178A\u17C6\u17A1\u17BE\u1784\u1794\u17B6\u1793\u1787\u17C4\u1782\u1787\u17D0\u1799\u17A0\u17BE\u1799\u17D4',
  },
  {
    title: '\u17A2\u17C6\u1796\u17B8\u1780\u17B6\u179A\u178A\u17C6\u17A1\u17BE\u1784\u179B\u17BE\u1782\u17D2\u1793\u17B6',
    text: '\u1794\u17D2\u179A\u179F\u17B7\u1793\u1794\u17BE\u1782\u178E\u1793\u17B8\u179A\u1794\u179F\u17CB\u17A2\u17D2\u1793\u1780\u1794\u1785\u17D2\u1785\u17BB\u1794\u17D2\u1794\u1793\u17D2\u1793\u1787\u17B6 Plus/Pro \u179F\u17BC\u1798\u1780\u17BB\u17C6\u178A\u17C6\u17A1\u17BE\u1784\u179B\u17BE\u1782\u17D2\u1793\u17B6 \u1796\u17D2\u179A\u17C4\u17C7\u179A\u1799\u17C8\u1796\u17C1\u179B\u1785\u17B6\u179F\u17CB\u1793\u17B9\u1784\u178F\u17D2\u179A\u17BC\u179C\u1794\u17B6\u1793\u1782\u178E\u1793\u17B6\u17A1\u17BE\u1784\u179C\u17B7\u1789 \u1798\u17B7\u1793\u1794\u1793\u17D2\u1790\u17C2\u1798\u1791\u17C1! \u179F\u17BC\u1798\u179A\u1784\u17CB\u1785\u17B6\u17C6\u179A\u17A0\u17BC\u178F\u178A\u179B\u17CB\u1795\u17BB\u178F\u1780\u17C6\u178E\u178F\u17CB \u179A\u17BD\u1785\u178A\u17C6\u17A1\u17BE\u1784\u179C\u17B7\u1789\u17D4',
  },
]

const NOTICES_EN = [
  {
    title: 'Check Stock First',
    text: 'Before upgrading, please check the product stock status. If it shows "Out of Stock", please wait for restocking.',
  },
  {
    title: '"No Detailed Info" Error',
    text: 'If the upgrade shows "Failed, no detailed info", don\'t panic! This is due to network delay with gift card subscription status. Go to ChatGPT website, check Settings \u2192 Upgrade Plus/Pro. The upgrade has most likely succeeded.',
  },
  {
    title: 'About Stacking Upgrades',
    text: 'If your account is currently Plus/Pro, force-charging will overwrite (recalculate) the existing period, not stack! Wait until expiry then recharge.',
  },
]

export default function ChatGPTUpgradePage() {
  const { locale } = useTranslation()
  const addToCart = useStore((s) => s.addToCart)
  const [activeTab, setActiveTab] = useState<ServiceTab>('chatgpt')
  const [currentStep, setCurrentStep] = useState<UpgradeStep>(1)
  const [selectedPlan, setSelectedPlan] = useState<PlanOption | null>(null)
  const [serialCode, setSerialCode] = useState('')
  const [sessionData, setSessionData] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showIntro, setShowIntro] = useState(true)

  const plans = SERVICE_PLANS[activeTab]
  const steps = locale === 'km' ? STEPS_KM : STEPS_EN
  const notices = locale === 'km' ? NOTICES_KM : NOTICES_EN

  const handleTabChange = useCallback((tab: ServiceTab) => {
    setActiveTab(tab)
    setCurrentStep(1)
    setSelectedPlan(null)
    setSerialCode('')
    setSessionData('')
    setIsCompleted(false)
  }, [])

  const handleStartService = useCallback(() => {
    setShowIntro(false)
  }, [])

  const handleVerifyCode = useCallback(() => {
    if (!serialCode.trim()) return
    setCurrentStep(2)
  }, [serialCode])

  const handleSecurityCheck = useCallback(() => {
    if (!sessionData.trim()) return
    setCurrentStep(3)
  }, [sessionData])

  const handleConfirmUpgrade = useCallback(() => {
    setCurrentStep(4)
    setIsProcessing(true)

    setTimeout(() => {
      setIsProcessing(false)
      setIsCompleted(true)

      if (selectedPlan) {
        addToCart({
          productId: selectedPlan.id,
          name: locale === 'km' ? selectedPlan.nameKm : selectedPlan.nameEn,
          price: selectedPlan.price,
          image: '/images/logo.jpg',
          quantity: 1,
          metadata: { upgradeType: selectedPlan.id, serialCode },
        })
      }
    }, 3000)
  }, [selectedPlan, locale, addToCart, serialCode])

  const handleReset = useCallback(() => {
    setCurrentStep(1)
    setSerialCode('')
    setSessionData('')
    setIsCompleted(false)
    setIsProcessing(false)
    setSelectedPlan(null)
  }, [])

  useEffect(() => {
    if (plans.length > 0 && !selectedPlan) {
      setSelectedPlan(plans[0])
    }
  }, [plans, selectedPlan])

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
              ? 'Makara Store \u1794\u17D2\u179A\u1796\u17D0\u1793\u17D2\u1792\u178A\u17C6\u17A1\u17BE\u1784\u179F\u17D2\u179C\u17D0\u1799\u1794\u17D2\u179A\u179C\u178F\u17D2\u178F\u17B7'
              : 'Makara Store Self-Service Upgrade'}
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            {locale === 'km'
              ? '\u1795\u17D2\u1791\u17C0\u1784\u1795\u17D2\u1791\u17B6\u178F\u17CB\u179F\u17D2\u179C\u17D0\u1799\u1794\u17D2\u179A\u179C\u178F\u17D2\u178F\u17B7 \u00B7 \u1794\u17BE\u1780\u178A\u17C6\u178E\u17BE\u179A\u1780\u17B6\u179A\u179A\u17A0\u17D0\u179F \u00B7 \u178A\u17C6\u17A1\u17BE\u1784\u179F\u17BB\u179C\u178F\u17D2\u1790\u17B7\u1797\u17B6\u1796'
              : 'Auto verify \u00B7 Fast activation \u00B7 Secure upgrade'}
          </p>
          <button
            onClick={handleStartService}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-[0.98]"
          >
            {locale === 'km' ? '\u1785\u17B6\u1794\u17CB\u1795\u17D2\u178F\u17BE\u1798\u179F\u17C1\u179C\u17B6\u1780\u1798\u17D2\u1798' : 'Start Service'}
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
              {locale === 'km' ? '\u1794\u17D2\u179A\u1796\u17D0\u1793\u17D2\u1792\u178A\u17C6\u17A1\u17BE\u1784\u179F\u17D2\u179C\u17D0\u1799\u1794\u17D2\u179A\u179C\u178F\u17D2\u178F\u17B7' : 'Self-Service Upgrade'}
            </span>
          </h1>
          <p className="text-gray-500 text-sm">
            Makara Store {locale === 'km' ? '\u1795\u17D2\u179B\u17BC\u179C\u1780\u17B6\u179A\u178A\u17C6\u17A1\u17BE\u1784' : 'Official Upgrade Channel'}
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
            { key: 'claude' as ServiceTab, label: 'Claude', icon: '\uD83D\uDFE0' },
            { key: 'chatgpt' as ServiceTab, label: 'ChatGPT', icon: '\u26AB' },
            { key: 'gemini' as ServiceTab, label: 'Gemini', icon: '\u2728' },
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
            {locale === 'km' ? '\uD83D\uDED2 \u1791\u17B7\u1789\u1780\u17B6\u178F\u179F\u1798\u17D2\u1784\u17B6\u178F\u17CB' : '\uD83D\uDED2 Buy Card Keys'}
          </Link>
        </motion.div>

        {/* Plan Selection Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
        >
          {plans.map((plan, i) => (
            <motion.button
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              onClick={() => setSelectedPlan(plan)}
              className={`relative bg-white rounded-xl p-5 text-left transition-all duration-200 border-2 ${
                selectedPlan?.id === plan.id
                  ? 'border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/20'
                  : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-2.5 right-4 px-3 py-0.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold rounded-full shadow-sm">
                  {locale === 'km' ? plan.badgeKm : plan.badge}
                </span>
              )}
              <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">
                {locale === 'km' ? plan.nameKm : plan.nameEn}
              </h3>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                {locale === 'km' ? plan.descKm : plan.descEn}
              </p>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-2xl font-bold text-blue-600">${plan.price.toFixed(2)}</span>
                {plan.originalPrice && plan.originalPrice > plan.price && (
                  <span className="text-sm text-gray-400 line-through">${plan.originalPrice.toFixed(2)}</span>
                )}
              </div>
              <div className="space-y-1.5">
                {plan.features.slice(0, 3).map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs text-gray-600">
                    <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </div>
                ))}
              </div>
              {selectedPlan?.id === plan.id && (
                <div className="absolute top-4 right-4">
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </motion.button>
          ))}
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
          {/* Step 1: Verify Serial Code */}
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
                  ? '\u179F\u17BC\u1798\u1794\u1789\u17D2\u1785\u17BC\u179B\u179B\u17C1\u1781\u179F\u1798\u17D2\u1784\u17B6\u178F\u17CB\u1796\u17B8\u1780\u17B6\u179A\u1794\u1789\u17D2\u1787\u17B6\u1791\u17B7\u1789 (\u1780\u17B6\u178F\u179F\u1798\u17D2\u1784\u17B6\u178F\u17CB)'
                  : 'Enter your order serial number (Card Key)'}
              </h2>
              <div className="mb-4">
                <textarea
                  value={serialCode}
                  onChange={(e) => setSerialCode(e.target.value)}
                  placeholder={locale === 'km'
                    ? '\u1794\u17B7\u1791\u1797\u17D2\u1787\u17B6\u1794\u17CB\u1780\u17B6\u178F\u179F\u1798\u17D2\u1784\u17B6\u178F\u17CB\u179A\u1794\u179F\u17CB\u17A2\u17D2\u1793\u1780\u1793\u17C5\u1791\u17B8\u1793\u17C1\u17C7 (\u17A7: AAAABBBBCCCDDDD)'
                    : 'Paste your card key here (e.g.: AAAABBBBCCCDDDD)'}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none h-24 text-sm transition-all"
                />
              </div>
              <p className="text-xs text-gray-500 mb-6">
                {locale === 'km'
                  ? '\u1794\u17D2\u179A\u1796\u17D0\u1793\u17D2\u1792\u178A\u17C6\u17A1\u17BE\u1784 ChatGPT \u179A\u1794\u179F\u17CB\u1799\u17BE\u1784\u1794\u17D2\u179A\u17BE\u1794\u17D2\u179A\u17B6\u179F\u17CB iOS \u1795\u17D2\u179B\u17BC\u179C\u1780\u17B6\u179A 100% \u1794\u17D2\u179A\u17BE\u1794\u17D2\u179A\u17B6\u179F\u17CB\u1780\u17B6\u178F\u17A2\u17C6\u178E\u17C4\u1799 Apple \u1795\u17D2\u179B\u17BC\u179C\u1780\u17B6\u179A \u179F\u17BB\u179C\u178F\u17D2\u1790\u17B7\u1797\u17B6\u1796\u1782\u17D2\u1798\u17B6\u1793\u1794\u17B6\u179A\u1798\u17D2\u1797'
                  : 'Our ChatGPT upgrade system uses 100% official iOS in-app purchase with Apple gift cards, safe and secure'}
              </p>
              <button
                onClick={handleVerifyCode}
                disabled={!serialCode.trim()}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3.5 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-[0.98]"
              >
                {locale === 'km' ? '\u1794\u17D2\u178F\u17BC\u179A\u1780\u17B6\u178F\u179F\u1798\u17D2\u1784\u17B6\u178F\u17CB' : 'Redeem Card Key'}
              </button>
            </motion.div>
          )}

          {/* Step 2: Session Data / Security Check */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 max-w-xl mx-auto"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {locale === 'km'
                  ? '\u179F\u17BC\u1798\u1794\u1789\u17D2\u1785\u17BC\u179B\u1796\u17D0\u178F\u17CC\u1798\u17B6\u1793\u17A2\u178F\u17D2\u178F\u179F\u1789\u17D2\u1789\u17B6\u178E ChatGPT (Session Data)'
                  : 'Enter ChatGPT Identity Credentials (Session Data)'}
              </h2>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                <p className="text-xs text-blue-700 leading-relaxed">
                  {locale === 'km' ? (
                    <>
                      <strong>\u1787\u17C6\u17A0\u17B6\u1793\u1791\u1791\u17BD\u179B\u1796\u17D0\u178F\u17CC\u1798\u17B6\u1793\u17A2\u178F\u17D2\u178F\u179F\u1789\u17D2\u1789\u17B6\u178E:</strong><br />
                      1. \u1794\u17BE\u1780\u1795\u17D2\u1791\u17B6\u17C6\u1784\u1790\u17D2\u1798\u17B8\u1780\u17D2\u1793\u17BB\u1784 Browser \u1785\u17BC\u179B\u1782\u17C1\u17A0\u1791\u17C6\u1796\u17D0\u179A ChatGPT \u17A0\u17BE\u1799\u1792\u17D2\u179C\u17BE\u17B1\u1799\u1794\u17D2\u179A\u17B6\u1780\u178A\u1790\u17B6\u1794\u17B6\u1793\u1785\u17BC\u179B\u1782\u178E\u1793\u17B8\u17D4<br />
                      2. \u1785\u17BB\u1785\u1794\u17BE\u1780 &quot;\u1791\u1791\u17BD\u179B\u1796\u17D0\u178F\u17CC\u1798\u17B6\u1793\u17A2\u178F\u17D2\u178F\u179F\u1789\u17D2\u1789\u17B6\u178E&quot;\u17D4<br />
                      3. \u1785\u1798\u17D2\u179B\u1784\u1780\u17BC\u178A\u1791\u17B6\u17C6\u1784\u17A2\u179F\u17CB\u178A\u17C2\u179B\u1794\u1784\u17D2\u17A0\u17B6\u1789\u1780\u17D2\u1793\u17BB\u1784\u1791\u17C6\u1796\u17D0\u179A \u179A\u17BD\u1785\u1794\u17B7\u1791\u1797\u17D2\u1787\u17B6\u1794\u17CB\u1780\u17D2\u1793\u17BB\u1784\u1794\u17D2\u179A\u17A2\u1794\u17CB\u1781\u17B6\u1784\u1780\u17D2\u179A\u17C4\u1798\u17D4
                    </>
                  ) : (
                    <>
                      <strong>Steps to get identity credentials:</strong><br />
                      1. Open a new browser tab, visit ChatGPT website and make sure you&apos;re logged in.<br />
                      2. Click to open &quot;Get Identity Credentials&quot;.<br />
                      3. Copy all code shown on the page, paste into the box below.
                    </>
                  )}
                </p>
              </div>
              <div className="mb-4">
                <textarea
                  value={sessionData}
                  onChange={(e) => setSessionData(e.target.value)}
                  placeholder={locale === 'km'
                    ? '\u1794\u17B7\u1791\u1797\u17D2\u1787\u17B6\u1794\u17CB\u1796\u17D0\u178F\u17CC\u1798\u17B6\u1793\u17A2\u178F\u17D2\u178F\u179F\u1789\u17D2\u1789\u17B6\u178E ChatGPT \u1793\u17C5\u1791\u17B8\u1793\u17C1\u17C7...'
                    : 'Paste your ChatGPT session data here...'}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none h-28 text-sm font-mono transition-all"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98]"
                >
                  {locale === 'km' ? '\u178F\u17D2\u179A\u17A1\u1794\u17CB\u1780\u17D2\u179A\u17C4\u1799' : 'Go Back'}
                </button>
                <button
                  onClick={handleSecurityCheck}
                  disabled={!sessionData.trim()}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3.5 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                >
                  {locale === 'km' ? '\u1794\u1789\u17D2\u1787\u17B6\u1780\u17CB\u1796\u17D0\u178F\u17CC\u1798\u17B6\u1793' : 'Confirm Info'}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirm Upgrade */}
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
                {locale === 'km' ? '\u1794\u1789\u17D2\u1787\u17B6\u1780\u17CB\u1796\u17D0\u178F\u17CC\u1798\u17B6\u1793\u1780\u17B6\u178F\u179F\u1798\u17D2\u1784\u17B6\u178F\u17CB \u1793\u17B7\u1784 \u1782\u178E\u1793\u17B8' : 'Confirm Card Key & Account Info'}
              </h2>

              <div className="space-y-3 mb-6">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">
                    {locale === 'km' ? '\u1796\u17D0\u178F\u17CC\u1798\u17B6\u1793\u1780\u17B6\u178F\u179F\u1798\u17D2\u1784\u17B6\u178F\u17CB:' : 'Card Key Info:'}
                  </p>
                  <p className="text-sm font-mono text-gray-900 break-all">
                    {serialCode.length > 20 ? serialCode.slice(0, 20) + '...' : serialCode}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">
                    {locale === 'km' ? '\u1782\u178E\u1793\u17B8\u1782\u17C4\u179B\u178A\u17C5:' : 'Target Account:'}
                  </p>
                  <p className="text-sm font-mono text-gray-900 break-all">
                    {sessionData.length > 30 ? sessionData.slice(0, 30) + '...' : sessionData}
                  </p>
                </div>
                {selectedPlan && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <p className="text-xs text-blue-600 mb-1">
                      {locale === 'km' ? '\u1782\u1798\u17D2\u179A\u17C4\u1784:' : 'Plan:'}
                    </p>
                    <p className="text-sm font-bold text-blue-700">
                      {locale === 'km' ? selectedPlan.nameKm : selectedPlan.nameEn} &mdash; ${selectedPlan.price.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <p className="text-xs text-amber-700 font-medium">
                  {locale === 'km'
                    ? '\u26A0\uFE0F \u1796\u17D2\u179A\u1798\u17B6\u1793: \u179F\u17BC\u1798\u1796\u17B7\u1793\u17B7\u178F\u17D2\u1799\u1798\u17BE\u179B\u1782\u178E\u1793\u17B8\u1782\u17C4\u179B\u178A\u17C5\u17B1\u1799\u1794\u17B6\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D4 \u1793\u17C5\u1796\u17C1\u179B\u1794\u1789\u17D2\u1787\u17B6\u1780\u17CB \u1780\u17B6\u178F\u179F\u1798\u17D2\u1784\u17B6\u178F\u17CB\u1793\u17B9\u1784\u1797\u17D2\u1787\u17B6\u1794\u17CB\u1787\u17B6\u1798\u17BD\u1799\u1782\u178E\u1793\u17B8\u1793\u17C4\u17C7 \u17A0\u17BE\u1799\u1798\u17B7\u1793\u17A2\u17B6\u1785\u1795\u17D2\u179B\u17B6\u179F\u17CB\u1794\u17D2\u178F\u17BC\u179A\u1794\u17B6\u1793\u1791\u17C1!'
                    : '\u26A0\uFE0F Warning: Please verify the target account is correct. Once confirmed, the card key will be bound to that account and cannot be reversed!'}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98]"
                >
                  {locale === 'km' ? '\u178F\u17D2\u179A\u17A1\u1794\u17CB\u1780\u17C2\u1794\u17D2\u179A\u17C2' : 'Go Back & Edit'}
                </button>
                <button
                  onClick={handleConfirmUpgrade}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                >
                  {locale === 'km' ? '\u1794\u1789\u17D2\u1787\u17B6\u1780\u17CB\u1780\u17B6\u179A\u178A\u17C6\u17A1\u17BE\u1784' : 'Confirm Upgrade'}
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
                      {locale === 'km' ? '\u1780\u17B6\u179A\u178A\u17C6\u17A1\u17BE\u1784\u1780\u17C6\u1796\u17BB\u1784\u178A\u17C6\u178E\u17BE\u179A\u1780\u17B6\u179A' : 'Upgrade Command Sent'}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {locale === 'km'
                        ? '\u1780\u17C6\u1796\u17BB\u1784\u1791\u17C6\u1793\u17B6\u1780\u17CB\u1791\u17C6\u1793\u1784\u1787\u17B6\u1798\u17BD\u1799\u1798\u17C9\u17B6\u179F\u17CA\u17B8\u1793\u1798\u17C2 OpenAI \u179F\u17BC\u1798\u1780\u17BB\u17C6\u1794\u17B7\u1791\u1791\u17C6\u1796\u17D0\u179A\u1793\u17C1\u17C7...'
                        : 'Communicating with OpenAI servers, please do not close this page...'}
                    </p>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '90%' }}
                      transition={{ duration: 3, ease: 'easeInOut' }}
                    />
                  </div>
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
                    {locale === 'km' ? '\u1780\u17B6\u179A\u178A\u17C6\u17A1\u17BE\u1784\u1794\u17B6\u1793\u1794\u1789\u17D2\u1787\u17BC\u1793\u178A\u17C4\u1799\u1787\u17C4\u1782\u1787\u17D0\u1799!' : 'Upgrade Submitted Successfully!'}
                  </h2>
                  <p className="text-sm text-gray-500 mb-6">
                    {locale === 'km'
                      ? '\u1780\u17B6\u179A\u1794\u1789\u17D2\u1787\u17B6\u1791\u17B7\u1789\u178F\u17D2\u179A\u17BC\u179C\u1794\u17B6\u1793\u1794\u1793\u17D2\u1790\u17C2\u1798\u1791\u17C5\u1780\u1793\u17D2\u178F\u17D2\u179A\u1780\u17D4 \u179F\u17BC\u1798\u1794\u1793\u17D2\u178F\u1791\u17C5\u1780\u17B6\u179A\u1791\u17BC\u1791\u17B6\u178F\u17CB\u17D4'
                      : 'Order has been added to your cart. Please proceed to checkout.'}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleReset}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98]"
                    >
                      {locale === 'km' ? '\u178A\u17C6\u17A1\u17BE\u1784\u1798\u17D2\u178F\u1784\u1791\u17C0\u178F' : 'Upgrade Again'}
                    </button>
                    <Link
                      href="/checkout"
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20 text-center active:scale-[0.98]"
                    >
                      {locale === 'km' ? '\u1794\u1793\u17D2\u178F\u1791\u17BC\u1791\u17B6\u178F\u17CB' : 'Proceed to Checkout'}
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
              {locale === 'km' ? '\u26A0\uFE0F \u179F\u17C1\u1785\u1780\u17D2\u178F\u17B8\u1787\u17BC\u1793\u178A\u17C6\u178E\u17B9\u1784\u179F\u17C6\u1781\u17B6\u1793\u17CB (\u179F\u17BC\u1798\u17A2\u17B6\u1793\u178A\u17C4\u1799\u1799\u1780\u1785\u17B7\u178F\u17D2\u178F\u1791\u17BB\u1780\u178A\u17B6\u1780\u17CB)' : '\u26A0\uFE0F Important Notice (Please Read Carefully)'}
            </h3>
          </div>
          <div className="p-6 space-y-5">
            {notices.map((notice, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-amber-500 text-sm mt-0.5 flex-shrink-0">{'\u25CF'}</span>
                <div>
                  <p className="text-sm font-bold text-gray-800 mb-1">{notice.title}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{notice.text}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h3 className="font-bold text-gray-800 text-sm mb-4">
            {locale === 'km' ? '\uD83D\uDCA1 \u1780\u17B6\u179A\u178E\u17C2\u1793\u17B6\u17C6\u179A\u17BD\u179F\u179A\u17B6\u1793\u17CB' : '\uD83D\uDCA1 Quick Tips'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl">
              <span className="text-base flex-shrink-0">{'\u274C'}</span>
              <p className="text-xs text-gray-600 leading-relaxed">
                {locale === 'km' ? '\u1795\u179B\u17B7\u178F\u1795\u179B\u178C\u17B8\u1787\u17B8\u178F\u17B6\u179B\u1798\u17B7\u1793\u17A2\u17B6\u1785\u179F\u1784\u1794\u17D2\u179A\u17B6\u1780\u17CB\u179C\u17B7\u1789\u1794\u17B6\u1793\u1791\u17C1' : 'Digital products are non-refundable'}
              </p>
            </div>
            <div className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl">
              <span className="text-base flex-shrink-0">{'\u26A0\uFE0F'}</span>
              <p className="text-xs text-gray-600 leading-relaxed">
                {locale === 'km' ? '\u179F\u17BC\u1798\u1780\u17BB\u17C6\u1794\u1784\u17D2\u17A0\u17B6\u1789\u1796\u17D0\u178F\u17CC\u1798\u17B6\u1793\u1782\u178E\u1793\u17B8\u17A2\u178F\u17B7\u1790\u17B7\u1787\u1793' : 'Do not expose customer account info'}
              </p>
            </div>
            <div className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl">
              <span className="text-base flex-shrink-0">{'\uD83D\uDCE9'}</span>
              <p className="text-xs text-gray-600 leading-relaxed">
                {locale === 'km' ? '\u1794\u17BE\u178A\u17C6\u17A1\u17BE\u1784\u1794\u179A\u17B6\u1787\u17D0\u1799 \u179F\u17BC\u1798\u1791\u17B6\u1780\u17CB\u1791\u1784 Admin' : 'If upgrade fails, contact Admin for help'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
