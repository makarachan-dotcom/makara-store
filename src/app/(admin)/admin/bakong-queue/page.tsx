'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

interface BakongReceipt {
  id: string
  orderId: string
  orderNumber: string
  customerEmail: string
  amount: number
  receiptImageUrl: string
  ocrText: string | null
  aiRiskScore: number
  aiVerificationDetails: Record<string, unknown> | null
  adminStatus: string
  createdAt: string
}

const riskLevelColor = (score: number) => {
  if (score <= 20) return { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', label: 'LOW RISK' }
  if (score <= 60) return { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', label: 'MEDIUM RISK' }
  return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', label: 'HIGH RISK' }
}

export default function BakongQueuePage() {
  const [receipts, setReceipts] = useState<BakongReceipt[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'PENDING_REVIEW' | 'CONFIRMED' | 'REJECTED'>('PENDING_REVIEW')
  const [selectedReceipt, setSelectedReceipt] = useState<BakongReceipt | null>(null)
  const [processing, setProcessing] = useState<string | null>(null)

  const fetchReceipts = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (filter !== 'all') params.set('status', filter)
      const res = await fetch(`/api/admin/bakong-queue?${params}`)
      const data = await res.json()
      setReceipts(data.receipts || [])
    } catch {
      // Error fetching
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => { fetchReceipts() }, [fetchReceipts])

  const handleAction = async (receiptId: string, action: 'confirm' | 'reject') => {
    setProcessing(receiptId)
    try {
      await fetch('/api/admin/bakong-queue/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiptId, action }),
      })
      await fetchReceipts()
      if (selectedReceipt?.id === receiptId) setSelectedReceipt(null)
    } catch {
      // Error
    } finally {
      setProcessing(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-white font-khmer">Bakong \u1795\u17D2\u1791\u17C0\u1784\u1795\u17D2\u1791\u17B6\u178F\u17CB</h1>
        <button onClick={fetchReceipts} className="btn-neon text-xs px-3 py-1.5">\u1792\u17D2\u179C\u17BE\u1794\u1785\u17D2\u1785\u17BB\u1794\u17D2\u1794\u1793\u17D2\u1793\u1797\u17B6\u1796</button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'PENDING_REVIEW', 'CONFIRMED', 'REJECTED'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all ${filter === f ? 'bg-neon/10 text-neon border border-neon/30' : 'text-white/40 border border-white/5 hover:border-white/10'}`}>
            {f === 'all' ? '\u1791\u17B6\u17C6\u1784\u17A2\u179F\u17CB' : f === 'PENDING_REVIEW' ? '\u179A\u1784\u17CB\u1785\u17B6\u17C6\u1795\u17D2\u1791\u17C0\u1784\u1795\u17D2\u1791\u17B6\u178F\u17CB' : f === 'CONFIRMED' ? '\u1794\u17B6\u1793\u1794\u1789\u17D2\u1787\u17B6\u1780\u17CB' : '\u1794\u17B6\u1793\u1794\u178A\u17B7\u179F\u17C1\u1792'}
          </button>
        ))}
      </div>

      {receipts.length === 0 ? (
        <div className="card-gaming p-8 text-center">
          <p className="text-white/30 text-sm">\u1798\u17B7\u1793\u1798\u17B6\u1793\u1794\u1784\u17D2\u1780\u17B6\u1793\u17CB\u178A\u17C3\u179A\u1784\u17CB\u1785\u17B6\u17C6\u1795\u17D2\u1791\u17C0\u1784\u1795\u17D2\u1791\u17B6\u178F\u17CB</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {receipts.map((receipt) => {
            const risk = riskLevelColor(receipt.aiRiskScore)
            return (
              <motion.div
                key={receipt.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`card-gaming p-4 border ${risk.border} cursor-pointer hover:bg-white/5 transition-colors`}
                onClick={() => setSelectedReceipt(receipt)}
              >
                <div className="flex items-start gap-4">
                  {/* Receipt Thumbnail */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                    {receipt.receiptImageUrl ? (
                      <img src={receipt.receiptImageUrl} alt="Receipt" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20 text-2xl">\uD83D\uDCF7</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-neon font-mono text-xs">{receipt.orderNumber}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${risk.bg} ${risk.text}`}>
                        {risk.label} ({receipt.aiRiskScore}/100)
                      </span>
                    </div>
                    <p className="text-white/60 text-sm truncate">{receipt.customerEmail}</p>
                    <p className="text-gold font-bold text-sm">${receipt.amount.toFixed(2)}</p>
                    <p className="text-white/30 text-xs mt-1">{new Date(receipt.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                {receipt.adminStatus === 'PENDING_REVIEW' && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAction(receipt.id, 'confirm') }}
                      disabled={processing === receipt.id}
                      className="flex-1 bg-green-500/10 border border-green-500/30 text-green-400 text-xs py-2 rounded-lg hover:bg-green-500/20 transition-colors disabled:opacity-50"
                    >
                      {processing === receipt.id ? '...' : '\u2713 \u1794\u1789\u17D2\u1787\u17B6\u1780\u17CB'}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAction(receipt.id, 'reject') }}
                      disabled={processing === receipt.id}
                      className="flex-1 bg-red-500/10 border border-red-500/30 text-red-400 text-xs py-2 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
                    >
                      {processing === receipt.id ? '...' : '\u2717 \u1794\u178A\u17B7\u179F\u17C1\u1792'}
                    </button>
                  </div>
                )}

                {receipt.adminStatus === 'CONFIRMED' && (
                  <div className="mt-3 text-center text-green-400 text-xs bg-green-500/5 py-1.5 rounded-lg">\u2713 \u1794\u17B6\u1793\u1794\u1789\u17D2\u1787\u17B6\u1780\u17CB</div>
                )}
                {receipt.adminStatus === 'REJECTED' && (
                  <div className="mt-3 text-center text-red-400 text-xs bg-red-500/5 py-1.5 rounded-lg">\u2717 \u1794\u17B6\u1793\u1794\u178A\u17B7\u179F\u17C1\u1792</div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Receipt Detail Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedReceipt(null)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card-gaming p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-neon font-bold">{selectedReceipt.orderNumber}</h3>
              <button onClick={() => setSelectedReceipt(null)} className="text-white/30 hover:text-white/60">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Receipt Image */}
              <div>
                {selectedReceipt.receiptImageUrl ? (
                  <img src={selectedReceipt.receiptImageUrl} alt="Receipt" className="w-full rounded-lg" />
                ) : (
                  <div className="w-full h-64 bg-white/5 rounded-lg flex items-center justify-center text-white/20">No Image</div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div>
                  <span className="text-white/40 text-xs">\u17A2\u17CA\u17B8\u1798\u17C2\u179B\u17A2\u178F\u17B7\u1790\u17B7\u1787\u1793</span>
                  <p className="text-white text-sm">{selectedReceipt.customerEmail}</p>
                </div>
                <div>
                  <span className="text-white/40 text-xs">\u1785\u17C6\u1793\u17BD\u1793\u1794\u17D2\u179A\u17B6\u1780\u17CB</span>
                  <p className="text-gold font-bold">${selectedReceipt.amount.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-white/40 text-xs">AI Risk Score</span>
                  {(() => {
                    const risk = riskLevelColor(selectedReceipt.aiRiskScore)
                    return <p className={`font-bold ${risk.text}`}>{selectedReceipt.aiRiskScore}/100 - {risk.label}</p>
                  })()}
                </div>
                {selectedReceipt.ocrText && (
                  <div>
                    <span className="text-white/40 text-xs">OCR Text</span>
                    <pre className="text-white/60 text-xs bg-white/5 p-2 rounded mt-1 whitespace-pre-wrap max-h-32 overflow-y-auto">{selectedReceipt.ocrText}</pre>
                  </div>
                )}
                {selectedReceipt.aiVerificationDetails && (
                  <div>
                    <span className="text-white/40 text-xs">AI Verification Details</span>
                    <pre className="text-white/60 text-xs bg-white/5 p-2 rounded mt-1 whitespace-pre-wrap max-h-32 overflow-y-auto">
                      {JSON.stringify(selectedReceipt.aiVerificationDetails, null, 2)}
                    </pre>
                  </div>
                )}

                {selectedReceipt.adminStatus === 'PENDING_REVIEW' && (
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleAction(selectedReceipt.id, 'confirm')}
                      disabled={processing === selectedReceipt.id}
                      className="flex-1 bg-green-500/10 border border-green-500/30 text-green-400 text-sm py-2.5 rounded-lg hover:bg-green-500/20 disabled:opacity-50"
                    >
                      \u2713 \u1794\u1789\u17D2\u1787\u17B6\u1780\u17CB\u1780\u17B6\u179A\u1794\u1784\u17CB\u1794\u17D2\u179A\u17B6\u1780\u17CB
                    </button>
                    <button
                      onClick={() => handleAction(selectedReceipt.id, 'reject')}
                      disabled={processing === selectedReceipt.id}
                      className="flex-1 bg-red-500/10 border border-red-500/30 text-red-400 text-sm py-2.5 rounded-lg hover:bg-red-500/20 disabled:opacity-50"
                    >
                      \u2717 \u1794\u178A\u17B7\u179F\u17C1\u1792\u1794\u1784\u17D2\u1780\u17B6\u1793\u17CB\u178A\u17C3
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
