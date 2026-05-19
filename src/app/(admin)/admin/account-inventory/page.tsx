'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

interface AccountItem {
  id: string
  productId: string
  email: string
  password: string
  extraInfo: string | null
  isSold: boolean
  orderId: string | null
  createdAt: string
  soldAt: string | null
}

interface StockSummary {
  productId: string
  productName: string
  available: number
  sold: number
  total: number
}

export default function AccountInventoryPage() {
  const [accounts, setAccounts] = useState<AccountItem[]>([])
  const [stockSummary, setStockSummary] = useState<StockSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'available' | 'sold'>('all')
  const [showImport, setShowImport] = useState(false)
  const [importProductId, setImportProductId] = useState('')
  const [importData, setImportData] = useState('')
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<string | null>(null)

  const fetchAccounts = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (filter !== 'all') params.set('status', filter)
      const res = await fetch(`/api/admin/account-inventory?${params}`)
      const data = await res.json()
      setAccounts(data.accounts || [])
      setStockSummary(data.stockSummary || [])
    } catch {
      // Error
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => { fetchAccounts() }, [fetchAccounts])

  const handleImport = async () => {
    if (!importProductId || !importData.trim()) return
    setImporting(true)
    setImportResult(null)
    try {
      const lines = importData.split('\n').map(l => l.trim()).filter(Boolean)
      const accountsToImport = lines.map(line => {
        const parts = line.split(/[:\t,]/)
        return {
          email: parts[0]?.trim() || '',
          password: parts[1]?.trim() || '',
          extraInfo: parts[2]?.trim() || undefined,
        }
      }).filter(a => a.email && a.password)

      const res = await fetch('/api/admin/account-inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: importProductId, accounts: accountsToImport }),
      })
      const data = await res.json()
      setImportResult(data.message || `Imported ${data.created} accounts`)
      setImportData('')
      await fetchAccounts()
    } catch {
      setImportResult('Import failed')
    } finally {
      setImporting(false)
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
        <h1 className="text-2xl font-display font-bold text-white font-khmer">គ្រប់គ្រង Account Inventory</h1>
        <button onClick={() => setShowImport(!showImport)} className="btn-gold text-xs px-3 py-1.5">
          {showImport ? 'បិទ' : '+ បញ្ចូល Accounts'}
        </button>
      </div>

      {/* Stock Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stockSummary.map((item) => {
          const pct = item.total > 0 ? (item.available / item.total) * 100 : 0
          return (
            <motion.div key={item.productId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-gaming p-4">
              <h4 className="text-white font-semibold text-sm mb-2">{item.productName}</h4>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${pct > 50 ? 'bg-green-500' : pct > 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-green-400">មាន: {item.available}</span>
                <span className="text-white/30">លក់: {item.sold}</span>
                <span className="text-white/40">សរុប: {item.total}</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Import Section */}
      {showImport && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card-gaming p-5">
          <h3 className="text-neon font-semibold mb-3 text-sm">បញ្ចូល Accounts ថ្មី</h3>
          <div className="space-y-3">
            <div>
              <label className="text-white/40 text-xs block mb-1">Product ID</label>
              <input
                type="text"
                value={importProductId}
                onChange={e => setImportProductId(e.target.value)}
                placeholder="Product ID"
                className="w-full bg-obsidian border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-white/20 focus:border-neon/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1">Accounts (email:password format, one per line)</label>
              <textarea
                value={importData}
                onChange={e => setImportData(e.target.value)}
                placeholder={'user1@email.com:password123\nuser2@email.com:pass456'}
                rows={6}
                className="w-full bg-obsidian border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-white/20 focus:border-neon/50 focus:outline-none font-mono resize-none"
              />
            </div>
            <button
              onClick={handleImport}
              disabled={importing}
              className="btn-gold text-xs px-4 py-2 disabled:opacity-50"
            >
              {importing ? 'កំពុងបញ្ចូល...' : 'បញ្ចូល Accounts'}
            </button>
            {importResult && (
              <p className="text-xs text-green-400">{importResult}</p>
            )}
          </div>
        </motion.div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'available', 'sold'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f ? 'bg-neon/20 text-neon' : 'bg-white/5 text-white/40 hover:text-white/60'
            }`}
          >
            {f === 'all' ? 'ទាំងអស់' : f === 'available' ? 'មាន' : 'លក់រួច'}
          </button>
        ))}
      </div>

      {/* Accounts List */}
      <div className="space-y-2">
        {accounts.length === 0 ? (
          <div className="card-gaming p-8 text-center">
            <p className="text-white/30 text-sm">មិនមាន accounts ទេ</p>
          </div>
        ) : (
          accounts.map((acc) => (
            <motion.div
              key={acc.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card-gaming p-4 flex items-center justify-between"
            >
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-mono truncate">{acc.email}</p>
                <p className="text-white/30 text-xs mt-0.5">Password: {'•'.repeat(Math.min(acc.password.length, 8))}</p>
                {acc.extraInfo && <p className="text-white/20 text-xs mt-0.5">Extra: {acc.extraInfo}</p>}
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  acc.isSold ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                }`}>
                  {acc.isSold ? 'SOLD' : 'AVAILABLE'}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
