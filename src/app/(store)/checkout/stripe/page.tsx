'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { loadStripe, Stripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { useStore } from '@/store/useStore'

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#fff',
      fontFamily: 'monospace',
      fontSize: '16px',
      '::placeholder': { color: '#555' },
    },
    invalid: { color: '#ff4444' },
  },
  hidePostalCode: true,
}

function StripeCardForm({ orderId, amount }: { orderId: string; amount: number }) {
  const stripe = useStripe()
  const elements = useElements()
  const { locale } = useTranslation()
  const { clearCart } = useStore()
  const router = useRouter()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setProcessing(true)
    setError('')

    try {
      const res = await fetch('/api/payment/stripe/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, amount }),
      })
      const data = await res.json()

      if (!data.clientSecret) {
        setError(data.error || 'Failed to create payment')
        setProcessing(false)
        return
      }

      const cardElement = elements.getElement(CardElement)
      if (!cardElement) { setError('Card element not found'); setProcessing(false); return }

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: cardElement },
      })

      if (result.error) {
        setError(result.error.message || 'Payment failed')
      } else if (result.paymentIntent?.status === 'succeeded') {
        setSuccess(true)
        clearCart()
      }
    } catch {
      setError('Payment failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-gaming p-6 text-center">
        <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-white mb-2">
          {locale === 'km' ? '\u1780\u17B6\u179A\u1794\u1784\u17CB\u1794\u17D2\u179A\u17B6\u1780\u17CB\u1794\u17B6\u1793\u1787\u17C4\u1782\u1787\u17D0\u1799!' : 'Payment Successful!'}
        </h2>
        <p className="text-white/50 text-sm mb-4">
          {locale === 'km' ? '\u1795\u179B\u17B7\u178F\u1795\u179B\u179A\u1794\u179F\u17CB\u17A2\u17D2\u1793\u1780\u1793\u17B9\u1784\u178F\u17D2\u179A\u17BC\u179C\u1794\u17B6\u1793\u178A\u17B9\u1780\u1787\u1789\u17D2\u1787\u17BC\u1793\u17D4' : 'Your product will be delivered shortly.'}
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/purchase-history" className="btn-neon text-sm">
            {locale === 'km' ? '\u1798\u17BE\u179B\u1794\u17D2\u179A\u179C\u178F\u17D2\u178F\u17B7\u1791\u17B7\u1789' : 'View Orders'}
          </Link>
          <Link href="/" className="btn-gold text-sm">
            {locale === 'km' ? '\u1794\u1793\u17D2\u178F\u178F\u17B7\u1789\u178F\u17C6\u1793\u17B7\u1789' : 'Continue Shopping'}
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="card-gaming p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm text-neon font-semibold">
            {locale === 'km' ? '\u1796\u17D0\u178F\u17CC\u1798\u17B6\u1793\u1780\u17B6\u178F' : 'Card Details'}
          </h3>
          <div className="flex gap-2 text-xs text-white/40">
            <span className="px-2 py-0.5 border border-white/10 rounded">Visa</span>
            <span className="px-2 py-0.5 border border-white/10 rounded">Mastercard</span>
            <span className="px-2 py-0.5 border border-white/10 rounded">UnionPay</span>
          </div>
        </div>

        <div className="bg-obsidian-100 border border-white/10 rounded-lg p-4 mb-4">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>

        <p className="text-white/30 text-xs">
          {locale === 'km' ? '\u1780\u17B6\u178F Amex, Discover, JCB \u1798\u17B7\u1793\u178F\u17D2\u179A\u17BC\u179C\u1794\u17B6\u1793\u1791\u1791\u17BD\u179B\u1799\u1780\u1791\u17C1\u17D4' : 'Amex, Discover, JCB cards are not accepted.'}
        </p>
      </div>

      <div className="card-gaming p-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-white/60 text-sm">{locale === 'km' ? '\u179F\u179A\u17BB\u1794' : 'Total'}</span>
          <span className="text-xl font-bold text-gold">${amount.toFixed(2)}</span>
        </div>
      </div>

      {error && (
        <div className="card-gaming p-3 mb-4 border border-red-500/20">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full btn-gold py-3 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing
          ? (locale === 'km' ? '\u1780\u17C6\u1796\u17BB\u1784\u178A\u17C6\u178E\u17BE\u179A\u1780\u17B6\u179A...' : 'Processing...')
          : (locale === 'km' ? `\u1794\u1784\u17CB $${amount.toFixed(2)}` : `Pay $${amount.toFixed(2)}`)}
      </button>

      <p className="text-center text-white/20 text-xs mt-3">
        Secured by Stripe. Your card details never touch our servers.
      </p>

      <button type="button" onClick={() => router.push('/checkout')} className="w-full text-white/30 hover:text-white/50 text-xs mt-4 transition-colors">
        {locale === 'km' ? '\u2190 \u178F\u17D2\u179A\u17A1\u1794\u17CB\u1791\u17C5\u1787\u17D2\u179A\u17BE\u179F\u179A\u17BE\u179F\u179C\u17B7\u1792\u17B8\u1794\u1784\u17CB\u1794\u17D2\u179A\u17B6\u1780\u17CB' : '\u2190 Back to payment selection'}
      </button>
    </form>
  )
}

export default function StripeCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <StripeCheckoutContent />
    </Suspense>
  )
}

function StripeCheckoutContent() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('orderId')
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null)
  const [amount, setAmount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (pk) {
      setStripePromise(loadStripe(pk))
    }
  }, [])

  useEffect(() => {
    if (!orderId || !session) return
    const loadOrder = async () => {
      try {
        const res = await fetch('/api/orders')
        const data = await res.json()
        const order = data.orders?.find((o: { id: string }) => o.id === orderId)
        if (order) setAmount(order.totalAmount)
      } catch {
        // Error loading order
      } finally {
        setLoading(false)
      }
    }
    loadOrder()
  }, [orderId, session])

  if (!orderId) { router.push('/checkout'); return null }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!stripePromise) {
    return (
      <div className="cyber-grid-bg min-h-screen">
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="card-gaming p-6">
            <p className="text-white/50 text-sm mb-4">Stripe is not configured. Please contact admin.</p>
            <Link href="/checkout" className="btn-neon text-sm">Back to Checkout</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cyber-grid-bg min-h-screen">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/checkout" className="text-white/30 hover:text-neon transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-xl font-display font-bold text-white">STRIPE</h1>
        </div>

        <Elements stripe={stripePromise}>
          <StripeCardForm orderId={orderId} amount={amount} />
        </Elements>
      </div>
    </div>
  )
}
