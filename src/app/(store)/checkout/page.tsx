'use client'

// ទំព័របង់ប្រាក់ - Checkout
import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
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
  const { cart, getCartTotal } = useStore()
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)

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

      if (data.success) {
        setUploadStatus('success')
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
