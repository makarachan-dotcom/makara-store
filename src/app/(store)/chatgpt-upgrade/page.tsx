'use client'

// ទំព័រដំឡើង ChatGPT
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'
import { useStore } from '@/store/useStore'

const plans = [
  { id: 'plus-1m', nameKm: 'ChatGPT Plus - ១ ខែ', nameEn: 'ChatGPT Plus - 1 Month', price: 9.99, features: ['GPT-4o', 'DALL-E 3', 'Advanced Data Analysis'] },
  { id: 'plus-3m', nameKm: 'ChatGPT Plus - ៣ ខែ', nameEn: 'ChatGPT Plus - 3 Months', price: 24.99, features: ['GPT-4o', 'DALL-E 3', 'Advanced Data Analysis', 'Priority Access'] },
  { id: 'team-1m', nameKm: 'ChatGPT Team - ១ ខែ', nameEn: 'ChatGPT Team - 1 Month', price: 19.99, features: ['GPT-4o', 'DALL-E 3', 'Admin Console', 'Team Workspace'] },
]

export default function ChatGPTUpgradePage() {
  const { t, locale } = useTranslation()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const addToCart = useStore((s) => s.addToCart)
  const formRef = useRef<HTMLDivElement>(null)

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  const handleSubmitOrder = async () => {
    if (!selectedPlan || !email || !password) {
      setSubmitStatus('error')
      setErrorMessage(
        locale === 'km'
          ? 'សូមបំពេញព័ត៌មានទាំងអស់។'
          : 'Please fill in all fields.'
      )
      return
    }

    setSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const plan = plans.find((p) => p.id === selectedPlan)
      if (!plan) return

      addToCart({
        productId: plan.id,
        name: locale === 'km' ? plan.nameKm : plan.nameEn,
        price: plan.price,
        image: '/images/logo.jpg',
        quantity: 1,
        metadata: { email, upgradeType: plan.id },
      })

      setSubmitStatus('success')
      setEmail('')
      setPassword('')
      setSelectedPlan(null)
    } catch {
      setSubmitStatus('error')
      setErrorMessage(
        locale === 'km'
          ? 'មានកំហុសក្នុងការបញ្ជូន។ សូមព្យាយាមម្តងទៀត។'
          : 'An error occurred. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="cyber-grid-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
            <span className="text-gold text-glow-gold">{t('chatgptUpgrade')}</span>
          </h1>
          <p className="text-white/40 font-khmer">
            {locale === 'km'
              ? 'ជ្រើសរើសគម្រោង រួចបំពេញព័ត៌មានគណនី ChatGPT របស់អ្នក'
              : 'Select a plan and fill in your ChatGPT account details'}
          </p>
        </div>

        {/* គម្រោង */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {plans.map((plan, i) => (
            <motion.button
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleSelectPlan(plan.id)}
              className={`card-gaming p-6 text-left transition-all ${
                selectedPlan === plan.id
                  ? 'border-neon shadow-[0_0_20px_rgba(0,242,254,0.2)]'
                  : ''
              }`}
            >
              {i === 1 && (
                <span className="inline-block px-2 py-0.5 bg-gold/20 text-gold text-xs font-bold rounded mb-3">
                  {locale === 'km' ? 'ពេញនិយមបំផុត' : 'Most Popular'}
                </span>
              )}
              <h3 className="text-lg font-semibold text-white font-khmer mb-2">
                {locale === 'km' ? plan.nameKm : plan.nameEn}
              </h3>
              <p className="text-3xl font-bold text-gold mb-4">${plan.price}</p>
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white/50">
                    <span className="text-neon">✓</span> {f}
                  </li>
                ))}
              </ul>
            </motion.button>
          ))}
        </div>

        {/* សារជោគជ័យ */}
        {submitStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto mb-6 p-4 rounded-xl border border-green-500/30 bg-green-500/10 text-center"
          >
            <p className="text-green-400 font-khmer text-sm">
              {locale === 'km'
                ? 'ការបញ្ជាទិញត្រូវបានបន្ថែមទៅកន្ត្រក។ សូមបន្តទៅការបង់ប្រាក់។'
                : 'Order added to cart. Please proceed to checkout.'}
            </p>
          </motion.div>
        )}

        {/* ទម្រង់ព័ត៌មានគណនី */}
        {selectedPlan && (
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto card-gaming p-6"
          >
            <h3 className="text-neon font-semibold mb-4 font-khmer">{t('accountDetails')}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/40 font-khmer mb-1.5">
                  {locale === 'km' ? 'អ៊ីមែល ChatGPT' : 'ChatGPT Email'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5
                             text-white placeholder-white/20 focus:outline-none focus:border-neon/50"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm text-white/40 font-khmer mb-1.5">
                  {locale === 'km' ? 'ពាក្យសម្ងាត់ ChatGPT' : 'ChatGPT Password'}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-4 py-2.5
                             text-white placeholder-white/20 focus:outline-none focus:border-neon/50"
                  placeholder="••••••••"
                />
              </div>

              {submitStatus === 'error' && errorMessage && (
                <p className="text-red-400 text-sm font-khmer">{errorMessage}</p>
              )}

              <button
                onClick={handleSubmitOrder}
                disabled={submitting}
                className="w-full btn-gold mt-2 disabled:opacity-50"
              >
                {submitting
                  ? (locale === 'km' ? 'កំពុងបញ្ជូន...' : 'Submitting...')
                  : t('submitOrder')}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
