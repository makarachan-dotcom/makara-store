'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { useStore } from '@/store/useStore'

type PaymentStatus = 'generating' | 'waiting' | 'uploading' | 'uploaded' | 'verified' | 'error'

export default function BakongCheckoutPage() {
  const { locale } = useTranslation()
  const { clearCart } = useStore()
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('orderId')

  const [status, setStatus] = useState<PaymentStatus>('generating')
  const [qrString, setQrString] = useState('')
  const [md5, setMd5] = useState('')
  const [amount, setAmount] = useState(0)
  const [expiresAt, setExpiresAt] = useState<Date | null>(null)
  const [timeLeft, setTimeLeft] = useState(600)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null)
  const [riskResult, setRiskResult] = useState<{ riskScore: number; riskLevel: string; status: string } | null>(null)
  const [error, setError] = useState('')

  // Generate KHQR on mount
  useEffect(() => {
    if (!orderId || !session) return
    const generateQR = async () => {
      try {
        const orderRes = await fetch('/api/orders')
        const orderData = await orderRes.json()
        const order = orderData.orders?.find((o: { id: string }) => o.id === orderId)
        if (!order) { setError('Order not found'); setStatus('error'); return }

        const res = await fetch('/api/payment/bakong/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: order.totalAmount,
            currency: 'USD',
            orderId,
            description: `Order ${order.orderNumber}`,
          }),
        })
        const data = await res.json()
        if (data.qrString) {
          setQrString(data.qrString)
          setMd5(data.md5)
          setAmount(data.amount)
          setExpiresAt(new Date(data.expiresAt))
          setStatus('waiting')
        } else {
          setError(data.error || 'Failed to generate QR')
          setStatus('error')
        }
      } catch {
        setError('Network error')
        setStatus('error')
      }
    }
    generateQR()
  }, [orderId, session])

  // Countdown timer
  useEffect(() => {
    if (!expiresAt) return
    const interval = setInterval(() => {
      const diff = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000))
      setTimeLeft(diff)
      if (diff === 0) { clearInterval(interval); setStatus('error'); setError('QR code expired') }
    }, 1000)
    return () => clearInterval(interval)
  }, [expiresAt])

  // Poll for payment verification
  const checkPayment = useCallback(async () => {
    if (!md5) return
    try {
      const res = await fetch('/api/payment/bakong/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ md5 }),
      })
      const data = await res.json()
      if (data.status === 'success') {
        setStatus('verified')
        clearCart()
      }
    } catch {
      // Polling error, will retry
    }
  }, [md5, clearCart])

  useEffect(() => {
    if (status !== 'waiting') return
    const interval = setInterval(checkPayment, 10000)
    return () => clearInterval(interval)
  }, [status, checkPayment])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setReceiptFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setReceiptPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleUploadReceipt = async () => {
    if (!receiptFile || !orderId) return
    setStatus('uploading')
    try {
      const formData = new FormData()
      formData.append('receipt', receiptFile)
      formData.append('orderId', orderId)
      const res = await fetch('/api/payment/bakong/receipt', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.receiptId) {
        setRiskResult({ riskScore: data.riskScore, riskLevel: data.riskLevel, status: data.status })
        setStatus('uploaded')
        if (data.status === 'AI_APPROVED') {
          clearCart()
        }
      } else {
        setError(data.error || 'Upload failed')
        setStatus('error')
      }
    } catch {
      setError('Upload failed')
      setStatus('error')
    }
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  if (!orderId) {
    router.push('/checkout')
    return null
  }

  return (
    <div className="cyber-grid-bg min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/checkout" className="text-white/30 hover:text-neon transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-xl font-display font-bold text-white">BAKONG KHQR</h1>
        </div>

        {/* QR Code Display */}
        {(status === 'waiting' || status === 'generating') && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-gaming p-6 mb-6 text-center">
            {status === 'generating' ? (
              <div className="py-12">
                <div className="w-10 h-10 mx-auto border-2 border-neon border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-white/50 text-sm">Generating KHQR...</p>
              </div>
            ) : (
              <>
                <div className="bg-white p-4 rounded-xl inline-block mb-4">
                  <div className="w-48 h-48 flex items-center justify-center">
                    {qrString ? (
                      <div className="text-center">
                        <div className="w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-200">
                          <div className="text-xs text-gray-500 p-2 break-all font-mono leading-tight">
                            {qrString.substring(0, 60)}...
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-10 h-10 border-2 border-neon border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-2xl font-bold text-gold">${amount.toFixed(2)} USD</p>
                  <p className="text-white/40 text-xs mt-1">
                    {locale === 'km' ? '\u17A2\u178F\u17D2\u178F\u179F\u1789\u17D2\u1789\u17B6\u178E' : 'Order ID'}: {orderId.slice(-8)}
                  </p>
                </div>

                <div className={`text-sm font-mono mb-4 ${timeLeft < 60 ? 'text-red-400' : 'text-neon'}`}>
                  {locale === 'km' ? '\u1796\u17C1\u179B\u1793\u17C5\u179F\u179B\u17CB' : 'Expires in'}: {formatTime(timeLeft)}
                </div>

                <div className="text-left card-gaming p-4 mb-4 text-sm text-white/60 space-y-2">
                  <p className="text-neon font-semibold">{locale === 'km' ? '\u1780\u17B6\u179A\u178E\u17C2\u1793\u17B6\u17C6' : 'Instructions'}:</p>
                  <p>1. {locale === 'km' ? '\u1794\u17BE\u1780\u1780\u1798\u17D2\u1798\u179C\u17B7\u1792\u17B8 Bakong / ABA / Wing' : 'Open Bakong / ABA / Wing app'}</p>
                  <p>2. {locale === 'km' ? '\u179F\u17D2\u1780\u17C1\u1793 QR' : 'Scan the QR code above'}</p>
                  <p>3. {locale === 'km' ? '\u1794\u1784\u17CB\u178F\u17B6\u1798\u1785\u17C6\u1793\u17BD\u1793\u1794\u1784\u17D2\u17A0\u17B6\u1789' : 'Pay the exact amount shown'}</p>
                  <p>4. {locale === 'km' ? '\u1790\u178F\u179A\u17BC\u1794\u1794\u1784\u17D2\u1780\u17B6\u1793\u17CB\u178A\u17C3' : 'Take a screenshot of your receipt'}</p>
                  <p>5. {locale === 'km' ? '\u1795\u17D2\u1791\u17BB\u1780\u1794\u1784\u17D2\u1780\u17B6\u1793\u17CB\u178A\u17C3\u1781\u17B6\u1784\u1780\u17D2\u179A\u17C4\u1798' : 'Upload receipt below'}</p>
                </div>

                <button onClick={checkPayment} className="btn-neon text-sm mb-3 w-full">
                  {locale === 'km' ? '\u1781\u17D2\u1789\u17BB\u17C6\u1794\u17B6\u1793\u1794\u1784\u17CB\u179A\u17BD\u1785\u17A0\u17BE\u1799, \u1796\u17B7\u1793\u17B7\u178F\u17D2\u1799\u17A5\u17A1\u17BC\u179C\u1793\u17C1\u17C7' : "I've paid, check now"}
                </button>
              </>
            )}
          </motion.div>
        )}

        {/* Receipt Upload */}
        {(status === 'waiting' || status === 'uploading') && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-gaming p-6 mb-6">
            <h3 className="text-sm text-neon font-semibold mb-3">
              {locale === 'km' ? '\u1795\u17D2\u1791\u17BB\u1780\u1794\u1784\u17D2\u1780\u17B6\u1793\u17CB\u178A\u17C3' : 'Upload Receipt'}
            </h3>

            <label className="block border-2 border-dashed border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-neon/30 transition-colors">
              <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              {receiptPreview ? (
                <img src={receiptPreview} alt="Receipt" className="max-h-48 mx-auto rounded-lg" />
              ) : (
                <div>
                  <svg className="w-10 h-10 mx-auto text-white/20 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-white/40 text-sm">{locale === 'km' ? '\u1785\u17BB\u1785\u178A\u17BE\u1798\u17D2\u1794\u17B8\u1787\u17D2\u179A\u17BE\u179F\u179A\u17BA\u179F' : 'Click or drag to upload'}</p>
                </div>
              )}
            </label>

            {receiptFile && (
              <button
                onClick={handleUploadReceipt}
                disabled={status === 'uploading'}
                className="w-full btn-gold py-3 text-sm font-bold mt-4 disabled:opacity-50"
              >
                {status === 'uploading' ? (locale === 'km' ? '\u1780\u17C6\u1796\u17BB\u1784\u1795\u17D2\u1791\u17BB\u1780...' : 'Uploading...') : (locale === 'km' ? '\u1795\u17D2\u1791\u17BB\u1780\u1794\u1784\u17D2\u1780\u17B6\u1793\u17CB\u178A\u17C3' : 'Upload Receipt')}
              </button>
            )}
          </motion.div>
        )}

        {/* Upload Result */}
        {status === 'uploaded' && riskResult && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-gaming p-6 mb-6 text-center">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
              riskResult.riskLevel === 'green' ? 'bg-green-500/10' : riskResult.riskLevel === 'yellow' ? 'bg-yellow-500/10' : 'bg-red-500/10'
            }`}>
              {riskResult.riskLevel === 'green' ? (
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>

            <h2 className="text-lg font-bold text-white mb-2">
              {riskResult.status === 'AI_APPROVED'
                ? (locale === 'km' ? '\u1794\u1784\u17D2\u1780\u17B6\u1793\u17CB\u178A\u17C3\u178F\u17D2\u179A\u17BC\u179C\u1794\u17B6\u1793\u17A2\u1793\u17BB\u1798\u17D0\u178F' : 'Receipt Approved!')
                : (locale === 'km' ? '\u1780\u17C6\u1796\u17BB\u1784\u179A\u1784\u17CB\u1785\u17B6\u17C6\u1780\u17B6\u179A\u1795\u17D2\u1791\u17C0\u1784\u1795\u17D2\u1791\u17B6\u178F\u17CB' : 'Pending Admin Review')}
            </h2>

            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-sm text-white/50">AI Score:</span>
              <span className={`text-sm font-bold ${
                riskResult.riskLevel === 'green' ? 'text-green-400' : riskResult.riskLevel === 'yellow' ? 'text-yellow-400' : 'text-red-400'
              }`}>{riskResult.riskScore}/100</span>
            </div>

            <p className="text-white/50 text-sm mb-4">
              {riskResult.status === 'AI_APPROVED'
                ? (locale === 'km' ? '\u1780\u17B6\u179A\u1794\u1789\u17D2\u1787\u17B6\u178F\u17B7\u1789\u179A\u1794\u179F\u17CB\u17A2\u17D2\u1793\u1780\u1793\u17B9\u1784\u178F\u17D2\u179A\u17BC\u179C\u1794\u17B6\u1793\u1795\u17D2\u1791\u17C0\u1784\u1795\u17D2\u1791\u17B6\u178F\u17CB\u17D4' : 'Your order has been verified and is being processed.')
                : (locale === 'km' ? 'Admin \u1793\u17B9\u1784\u1795\u17D2\u1791\u17C0\u1784\u1795\u17D2\u1791\u17B6\u178F\u17CB\u1794\u1784\u17D2\u1780\u17B6\u1793\u17CB\u178A\u17C3\u179A\u1794\u179F\u17CB\u17A2\u17D2\u1793\u1780\u17D4' : 'Admin will verify your receipt shortly.')}
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
        )}

        {/* Verified */}
        {status === 'verified' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-gaming p-6 text-center">
            <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-white mb-2">{locale === 'km' ? '\u1780\u17B6\u179A\u1794\u1784\u17CB\u1794\u17D2\u179A\u17B6\u1780\u17CB\u1794\u17B6\u1793\u1795\u17D2\u1791\u17C0\u1784\u1795\u17D2\u1791\u17B6\u178F\u17CB!' : 'Payment Verified!'}</h2>
            <Link href="/purchase-history" className="btn-gold text-sm">{locale === 'km' ? '\u1798\u17BE\u179B\u1780\u17B6\u179A\u1794\u1789\u17D2\u1787\u17B6\u178F\u17B7\u1789' : 'View Orders'}</Link>
          </motion.div>
        )}

        {/* Error */}
        {status === 'error' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-gaming p-6 text-center">
            <div className="w-16 h-16 mx-auto bg-red-500/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-red-400 text-sm mb-4">{error}</p>
            <Link href="/checkout" className="btn-neon text-sm">{locale === 'km' ? '\u179b\u17d2\u1794\u1784\u1798\u17d2\u178f\u1784\u178f\u17c0\u178f' : 'Try Again'}</Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}
