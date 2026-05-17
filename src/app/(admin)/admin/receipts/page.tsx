'use client'

// ទំព័រគ្រប់គ្រងបង្កាន់ដៃ Admin - Real Version
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

interface ReceiptOrder {
  id: string
  orderNumber: string
  totalAmount: number
  paymentProof: string | null
  receiptStatus: string
  adminNote: string | null
  adjustedAmount: number | null
  status: string
  createdAt: string
  user: { name: string | null; email: string; image?: string | null }
  items: { id: string; quantity: number; price: number; product?: { nameKm: string; nameEn: string } | null }[]
}

const receiptStatusColors: Record<string, string> = {
  PENDING: 'bg-yellow-400/10 text-yellow-400',
  AI_APPROVED: 'bg-green-400/10 text-green-400',
  AI_REJECTED: 'bg-red-400/10 text-red-400',
  ADMIN_APPROVED: 'bg-emerald-400/10 text-emerald-400',
  ADMIN_REJECTED: 'bg-rose-400/10 text-rose-400',
}

const receiptStatusLabels: Record<string, string> = {
  PENDING: 'រង់ចាំ',
  AI_APPROVED: 'AI: អនុម័ត',
  AI_REJECTED: 'AI: បដិសេធ',
  ADMIN_APPROVED: 'Admin: អនុម័ត',
  ADMIN_REJECTED: 'Admin: បដិសេធ',
}

export default function AdminReceiptsPage() {
  const [receipts, setReceipts] = useState<ReceiptOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [adjustAmount, setAdjustAmount] = useState<Record<string, string>>({})
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({})
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [filter, setFilter] = useState('ALL')

  const fetchReceipts = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/receipts')
      const data = await res.json()
      setReceipts(data.receipts || [])
    } catch { setReceipts([]) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchReceipts() }, [fetchReceipts])

  const handleAction = async (orderId: string, action: 'approve' | 'decline') => {
    setProcessingId(orderId)
    try {
      const res = await fetch('/api/admin/receipts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          action,
          adminNote: adminNotes[orderId] || null,
          adjustedAmount: adjustAmount[orderId] ? parseFloat(adjustAmount[orderId]) : null,
        }),
      })
      if (res.ok) {
        fetchReceipts()
      } else {
        const data = await res.json().catch(() => ({ error: 'Action failed' }))
        alert(data.error || `Failed to ${action} receipt`)
      }
    } catch {
      alert(`Network error - could not ${action} receipt`)
    } finally {
      setProcessingId(null)
    }
  }

  const filteredReceipts = filter === 'ALL' ? receipts : receipts.filter((r) => r.receiptStatus === filter)

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
        <h1 className="text-2xl font-display font-bold text-white font-khmer">គ្រប់គ្រងបង្កាន់ដៃ</h1>
        <span className="text-white/40 text-sm">{receipts.length} receipts</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {['ALL', 'PENDING', 'AI_APPROVED', 'AI_REJECTED', 'ADMIN_APPROVED', 'ADMIN_REJECTED'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
              filter === f ? 'bg-neon/10 border-neon/30 text-neon' : 'border-white/10 text-white/40 hover:border-neon/20'
            }`}>
            {f === 'ALL' ? 'ទាំងអស់' : receiptStatusLabels[f] || f}
          </button>
        ))}
      </div>

      {filteredReceipts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-white/30 font-khmer">មិនមានបង្កាន់ដៃ</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReceipts.map((receipt, i) => (
            <motion.div
              key={receipt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-gaming p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-neon font-mono text-sm">{receipt.orderNumber}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${receiptStatusColors[receipt.receiptStatus] || ''}`}>
                      {receiptStatusLabels[receipt.receiptStatus] || receipt.receiptStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    {receipt.user.image && (
                      <img src={receipt.user.image} alt="" className="w-5 h-5 rounded-full" />
                    )}
                    <p className="text-sm text-white/50">{receipt.user.name || receipt.user.email}</p>
                  </div>
                  <p className="text-xs text-white/30">{receipt.user.email}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-gold font-bold">${receipt.totalAmount.toFixed(2)}</span>
                    <span className="text-white/30 text-xs">{new Date(receipt.createdAt).toLocaleDateString()}</span>
                  </div>
                  {receipt.items.length > 0 && (
                    <div className="mt-2">
                      {receipt.items.map((item) => (
                        <p key={item.id} className="text-xs text-white/30">
                          {item.product?.nameEn || 'Product'} x{item.quantity} - ${item.price.toFixed(2)}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {receipt.paymentProof && (
                  <div className="w-20 h-20 bg-obsidian-50 rounded-lg border border-neon/10 overflow-hidden">
                    <img src={receipt.paymentProof} alt="Receipt" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {(receipt.receiptStatus === 'PENDING' || receipt.receiptStatus === 'AI_APPROVED' || receipt.receiptStatus === 'AI_REJECTED') && (
                <div className="mt-4 pt-4 border-t border-neon/10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs text-white/30 font-khmer mb-1">កែប្រែចំនួនទឹកប្រាក់</label>
                      <input type="number" step="0.01"
                        value={adjustAmount[receipt.id] || ''}
                        onChange={(e) => setAdjustAmount({ ...adjustAmount, [receipt.id]: e.target.value })}
                        className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon/50"
                        placeholder={receipt.totalAmount.toFixed(2)} />
                    </div>
                    <div>
                      <label className="block text-xs text-white/30 font-khmer mb-1">កំណត់ចំណាំ Admin</label>
                      <input type="text"
                        value={adminNotes[receipt.id] || ''}
                        onChange={(e) => setAdminNotes({ ...adminNotes, [receipt.id]: e.target.value })}
                        className="w-full bg-obsidian-50 border border-neon/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon/50"
                        placeholder="Admin note..." />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => handleAction(receipt.id, 'approve')}
                      disabled={processingId === receipt.id}
                      className="btn-neon text-xs py-2 disabled:opacity-50">
                      {processingId === receipt.id ? 'កំពុង...' : 'អនុម័ត'}
                    </button>
                    <button onClick={() => handleAction(receipt.id, 'decline')}
                      disabled={processingId === receipt.id}
                      className="bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-xs hover:bg-red-500/30 transition-colors disabled:opacity-50">
                      បដិសេធ
                    </button>
                  </div>
                </div>
              )}

              {receipt.adminNote && (
                <div className="mt-3 p-2 bg-obsidian-50 rounded-lg">
                  <p className="text-xs text-white/40"><span className="text-neon">Admin:</span> {receipt.adminNote}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
