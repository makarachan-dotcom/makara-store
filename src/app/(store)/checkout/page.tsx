'use client'

// ទំព័របង់ប្រាក់ - Checkout
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { useStore } from '@/store/useStore'

type Bank = 'ABA_BANK' | 'ACLEDA_BANK' | 'WING_BANK'

const banks: { id: Bank; name: string; color: string }[] = [
  { id: 'ABA_BANK', name: 'ABA Bank', color: 'from-blue-600 to-blue-800' },
  { id: 'ACLEDA_BANK', name: 'ACLEDA Bank', color: 'from-green-600 to-green-800' },
  { id: 'WING_BANK', name: 'Wing Bank', color: 'from-yellow-600 to-yellow-800' },
]

export default function CheckoutPage() {
  const { t, locale } = useTranslation()
  const { cart, getCartTotal, clearCart } = useStore()
  const { data: session } = useSession()
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [privacyAgreed, setPrivacyAgreed] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [orderCreated, setOrderCreated] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem('makara-privacy-agreed')
    if (dismissed === 'true') setPrivacyAgreed(true)
  }, [])

  const handleDontShowAgain = () => {
    localStorage.setItem('makara-privacy-agreed', 'true')
    setPrivacyAgreed(true)
    setShowPrivacyModal(false)
  }

  const handleReceiptUpload = async () => {
    if (!receiptFile || !selectedBank) return

    setUploading(true)
    setUploadStatus(null)

    const formData = new FormData()
    formData.append('receipt', receiptFile)
    formData.append('bank', selectedBank)
    formData.append('amount', getCartTotal().toString())

    try {
      const res = await fetch('/api/receipt-verify', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (data.status === 'AI_APPROVED' || data.success) {
        setUploadStatus('success')
        if (session?.user) {
          try {
            await fetch('/api/orders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                items: cart.map((item) => ({
                  productId: item.productId,
                  name: item.name,
                  quantity: item.quantity,
                  price: item.price,
                })),
                bank: selectedBank,
                totalAmount: getCartTotal(),
              }),
            })
            setOrderCreated(true)
            clearCart()
          } catch {
            // Order creation failed silently - receipt was already uploaded
          }
        }
      } else if (data.status === 'AI_REJECTED') {
        if (data.reason?.includes('blurry') || data.reason?.includes('\u1798\u17b7\u1793\u1785\u17d2\u1794\u17b6\u179f\u17cb')) {
          setUploadStatus('blurry')
        } else {
          setUploadStatus('invalid')
        }
      } else {
        setUploadStatus(data.error || 'error')
      }
    } catch {
      setUploadStatus('error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="cyber-grid-bg min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-gradient-to-b from-gold to-transparent rounded-full" />
          <h1 className="text-2xl font-display font-bold text-white">{t('checkout')}</h1>
        </div>

        {/* Order Created Success */}
        {orderCreated && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-gaming p-6 mb-6 text-center"
          >
            <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-white mb-2 font-khmer">
              {locale === 'km' ? 'ការបញ្ជាទិញបានជោគជ័យ!' : 'Order Placed Successfully!'}
            </h2>
            <p className="text-white/50 text-sm font-khmer mb-4">
              {locale === 'km' ? 'យើងនឹងផ្ទៀងផ្ទាត់ការបង់ប្រាក់របស់អ្នកឆាប់ៗ។' : 'We will verify your payment shortly.'}
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/purchase-history" className="btn-neon text-sm">
                {locale === 'km' ? 'មើលប្រវត្តិទិញ' : 'View Orders'}
              </Link>
              <Link href="/" className="btn-gold text-sm">
                {locale === 'km' ? 'បន្តទិញទំនិញ' : 'Continue Shopping'}
              </Link>
            </div>
          </motion.div>
        )}

        {/* Privacy Policy Agreement */}
        {!privacyAgreed && !orderCreated && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-gaming p-4 mb-6 border border-yellow-500/20"
          >
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div className="flex-1">
                <p className="text-white/70 text-sm font-khmer mb-3">
                  {locale === 'km'
                    ? 'សូមអានគោលការណ៍ឯកជនភាពមុនពេលបន្ត។ សេវាកម្មរបស់យើងមិនអនុញ្ញាតឱ្យបង្វិលប្រាក់វិញទេ បើអ្នកប្ដូរចិត្ត។'
                    : 'Please read our privacy policy before proceeding. Our services do not allow refunds if you change your mind.'}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowPrivacyModal(true)}
                    className="text-xs text-neon hover:underline"
                  >
                    {locale === 'km' ? 'អានគោលការណ៍ →' : 'Read Policy →'}
                  </button>
                  <button
                    onClick={() => setPrivacyAgreed(true)}
                    className="btn-neon text-xs px-3 py-1"
                  >
                    {locale === 'km' ? 'ខ្ញុំយល់ព្រម' : 'I Agree'}
                  </button>
                  <button
                    onClick={handleDontShowAgain}
                    className="text-xs text-white/40 hover:text-white/60"
                  >
                    {locale === 'km' ? 'កុំបង្ហាញម្ដងទៀត' : "Don't show again"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Privacy Policy Modal */}
        <AnimatePresence>
          {showPrivacyModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowPrivacyModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="card-gaming p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-bold text-neon mb-4 font-khmer">{t('privacyPolicy')}</h3>
                <div className="text-sm text-white/60 space-y-3 font-khmer">
                  <p>{locale === 'km' ? 'គោលការណ៍មិនបង្វិលប្រាក់វិញ៖ សេវាកម្មរបស់យើងមិនអនុញ្ញាតឱ្យបង្វិលប្រាក់វិញទេ បន្ទាប់ពីការទិញត្រូវបានបញ្ជាក់។ បើអ្នកប្ដូរចិត្ត យើងមិនអាចបង្វិលប្រាក់វិញបានទេ។' : 'No Refund Policy: Our services do not allow refunds after a purchase is confirmed. If you change your mind, we cannot issue a refund.'}</p>
                  <p>{locale === 'km' ? 'ផលិតផលឌីជីថលទាំងអស់ត្រូវបានផ្ដល់ជូនភ្លាមៗបន្ទាប់ពីការផ្ទៀងផ្ទាត់ការបង់ប្រាក់។' : 'All digital products are delivered immediately after payment verification.'}</p>
                  <p>{locale === 'km' ? 'ព័ត៌មានផ្ទាល់ខ្លួនរបស់អ្នកត្រូវបានការពារ និងមិនត្រូវបានចែករំលែកជាមួយភាគីទីបី។' : 'Your personal information is protected and not shared with third parties.'}</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => { setPrivacyAgreed(true); setShowPrivacyModal(false) }}
                    className="flex-1 btn-gold text-sm"
                  >
                    {locale === 'km' ? 'ខ្ញុំយល់ព្រម' : 'I Agree'}
                  </button>
                  <button
                    onClick={handleDontShowAgain}
                    className="flex-1 btn-neon text-sm"
                  >
                    {locale === 'km' ? 'កុំបង្ហាញម្ដងទៀត' : "Don't show again"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* សង្ខេបការបញ្ជាទិញ */}
        <div className="card-gaming p-4 mb-6">
          <h3 className="text-sm text-neon font-semibold mb-3 font-khmer">
            {locale === 'km' ? 'សង្ខេបការបញ្ជាទិញ' : 'Order Summary'}
          </h3>
          {cart.map((item) => (
            <div key={item.productId} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded overflow-hidden relative">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="40px" />
                </div>
                <span className="text-sm text-white/60 font-khmer">{item.name} x{item.quantity}</span>
              </div>
              <span className="text-gold font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-neon/10">
            <span className="font-semibold text-white font-khmer">{t('orderTotal')}</span>
            <span className="text-xl font-bold text-gold text-glow-gold">${getCartTotal().toFixed(2)}</span>
          </div>
        </div>

        {/* ជ្រើសរើសធនាគារ */}
        <div className="mb-6">
          <h3 className="text-sm text-neon font-semibold mb-3 font-khmer">{t('paymentMethod')}</h3>
          <div className="grid grid-cols-3 gap-3">
            {banks.map((bank) => (
              <button
                key={bank.id}
                onClick={() => setSelectedBank(bank.id)}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  selectedBank === bank.id
                    ? 'border-neon bg-neon/5 shadow-[0_0_15px_rgba(0,242,254,0.2)]'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className={`w-12 h-12 mx-auto rounded-lg bg-gradient-to-br ${bank.color} flex items-center justify-center mb-2`}>
                  <span className="text-white text-xs font-bold">{bank.name.split(' ')[0]}</span>
                </div>
                <span className="text-xs text-white/60">{bank.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* KHQR Code */}
        {selectedBank && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-gaming p-6 mb-6 text-center"
          >
            <p className="text-neon text-sm mb-4 font-khmer">
              {locale === 'km' ? 'ស្កែន KHQR ខាងក្រោមដើម្បីបង់ប្រាក់' : 'Scan KHQR below to pay'}
            </p>
            <div className="w-48 h-48 mx-auto bg-white rounded-xl flex items-center justify-center mb-4">
              <p className="text-obsidian text-xs font-semibold">KHQR Code</p>
            </div>
            <p className="text-gold font-bold text-lg">${getCartTotal().toFixed(2)}</p>
          </motion.div>
        )}

        {/* ផ្ទុកបង្កាន់ដៃ */}
        {selectedBank && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-gaming p-6"
          >
            <h3 className="text-sm text-neon font-semibold mb-4 font-khmer">{t('uploadReceipt')}</h3>

            <label className="block w-full border-2 border-dashed border-neon/20 rounded-xl p-8 text-center
                              cursor-pointer hover:border-neon/40 transition-colors">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
              />
              <svg className="w-10 h-10 mx-auto text-neon/30 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-white/40 font-khmer">
                {receiptFile
                  ? receiptFile.name
                  : locale === 'km'
                    ? 'ចុចដើម្បីជ្រើសរើសរូបភាពបង្កាន់ដៃ'
                    : 'Click to select receipt image'}
              </p>
            </label>

            {uploadStatus === 'success' && (
              <p className="mt-3 text-green-400 text-sm font-khmer">{t('receiptUploaded')}</p>
            )}
            {uploadStatus === 'blurry' && (
              <p className="mt-3 text-red-400 text-sm font-khmer">{t('receiptBlurry')}</p>
            )}
            {uploadStatus === 'invalid' && (
              <p className="mt-3 text-red-400 text-sm font-khmer">{t('receiptInvalid')}</p>
            )}

            <button
              onClick={handleReceiptUpload}
              disabled={!receiptFile || uploading}
              className="mt-4 w-full btn-gold disabled:opacity-50"
            >
              {uploading
                ? (locale === 'km' ? 'កំពុងផ្ទុក...' : 'Uploading...')
                : t('submitOrder')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
