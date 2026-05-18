'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { useStore } from '@/store/useStore'

type PaymentStatus = 'generating' | 'waiting' | 'uploading' | 'uploaded' | 'verified' | 'error'

export default function BakongCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <BakongCheckoutContent />
    </Suspense>
  )
}

function BakongCheckoutContent() {
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
  const [receiptRejected, setReceiptRejected] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

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

  const compressImageClientSide = (file: File, maxWidth = 1200, quality = 0.75): Promise<File> => {
    return new Promise((resolve) => {
      if (file.size <= 500 * 1024) {
        resolve(file)
        return
      }
      const img = new window.Image()
      const url = URL.createObjectURL(file)
      img.onload = () => {
        URL.revokeObjectURL(url)
        const canvas = document.createElement('canvas')
        let { width, height } = img
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) { resolve(file); return }
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) { resolve(file); return }
            resolve(new File([blob], file.name, { type: 'image/jpeg' }))
          },
          'image/jpeg',
          quality
        )
      }
      img.onerror = () => { URL.revokeObjectURL(url); resolve(file) }
      img.src = url
    })
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const compressed = await compressImageClientSide(file)
    setReceiptFile(compressed)
    const reader = new FileReader()
    reader.onload = (ev) => setReceiptPreview(ev.target?.result as string)
    reader.readAsDataURL(compressed)
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
        if (data.riskLevel === 'red' || data.status === 'PENDING_REVIEW') {
          setReceiptRejected(true)
          setRejectionReason(
            locale === 'km'
              ? 'ប្រព័ន្ធមិនអាចកំណត់អត្តសញ្ញាណបង្កាន់ដៃបានទេ។ ប៊ូតុងពិនិត្យការបង់ប្រាក់ត្រូវបានបិទ។ សូមផ្ញើវិក័យប័ត្រទៅកាន់ Admin តាម Telegram ជំនួស។'
              : 'System could not verify the receipt. Payment verification button is disabled. Please send the invoice to Admin via Telegram instead.'
          )
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
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=192x192&data=${encodeURIComponent(qrString)}&format=png&margin=4`}
                        alt="KHQR QR Code"
                        width={192}
                        height={192}
                        className="w-48 h-48 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.onerror = null
                          target.src = `https://chart.googleapis.com/chart?cht=qr&chs=192x192&chl=${encodeURIComponent(qrString)}&choe=UTF-8`
                        }}
                      />
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

                <button
                  onClick={checkPayment}
                  disabled={receiptRejected}
                  className={`text-sm mb-3 w-full ${receiptRejected ? 'bg-white/10 text-white/30 cursor-not-allowed rounded-lg py-2.5' : 'btn-neon'}`}
                >
                  {receiptRejected
                    ? (locale === 'km' ? 'ប៊ូតុងពិនិត្យត្រូវបានបិទ' : 'Verification disabled')
                    : (locale === 'km' ? 'ខ្ញុំបានបង់រួចហើយ, ពិនិត្យឥឡូវនេះ' : "I've paid, check now")}
                </button>

                {receiptRejected && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-3 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <p className="text-red-400 text-sm font-semibold font-khmer">
                        {locale === 'km' ? 'ការផ្ទៀងផ្ទាត់បង្កាន់ដៃបរាជ័យ!' : 'Receipt verification failed!'}
                      </p>
                    </div>
                    <p className="text-white/50 text-xs font-khmer mb-3">{rejectionReason}</p>
                    <a
                      href="https://t.me/AF4STURF"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-neon/20 to-blue-600/20 border border-neon/30 text-neon text-sm font-semibold px-5 py-2.5 rounded-xl hover:from-neon/30 hover:to-blue-600/30 transition-all font-khmer"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                      </svg>
                      {locale === 'km' ? 'ផ្ញើវិក័យប័ត្រទៅ Admin' : 'Send invoice to Admin'}
                    </a>
                  </div>
                )}
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
