'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

interface CardKeyItem {
  id: string
  productId: string
  productName: string
  keyCode: string
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

export default function CardKeysPage() {
  const [keys, setKeys] = useState<CardKeyItem[]>([])
  const [stockSummary, setStockSummary] = useState<StockSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'available' | 'sold'>('all')
  const [showImport, setShowImport] = useState(false)
  const [importProductId, setImportProductId] = useState('')
  const [importKeys, setImportKeys] = useState('')
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<string | null>(null)

  const fetchKeys = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (filter !== 'all') params.set('status', filter)
      const res = await fetch(`/api/admin/card-keys?${params}`)
      const data = await res.json()
      setKeys(data.keys || [])
      setStockSummary(data.stockSummary || [])
    } catch {
      // Error
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => { fetchKeys() }, [fetchKeys])

  const handleImport = async () => {
    if (!importProductId || !importKeys.trim()) return
    setImporting(true)
    setImportResult(null)
    try {
      const keysArray = importKeys.split('\n').map(k => k.trim()).filter(Boolean)
      const res = await fetch('/api/admin/card-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: importProductId, keys: keysArray }),
      })
      const data = await res.json()
      setImportResult(data.message || `Imported ${data.imported} keys`)
      setImportKeys('')
      await fetchKeys()
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
        <h1 className="text-2xl font-display font-bold text-white font-khmer">{'\u1782\u17D2\u179A\u1794\u17CB\u1782\u17D2\u179A\u1784 Card Keys'}</h1>
        <button onClick={() => setShowImport(!showImport)} className="btn-gold text-xs px-3 py-1.5">
          {showImport ? '\u1794\u17B7\u1791' : '+ \u1794\u1789\u17D2\u1785\u17BC\u179B Keys'}
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
                <span className="text-green-400">{'\u1798\u17B6\u1793'}: {item.available}</span>
                <span className="text-white/30">{'\u179B\u1780\u17CB'}: {item.sold}</span>
                <span className="text-white/40">{'\u179F\u179A\u17BB\u1794'}: {item.total}</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Import Section */}
      {showImport && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card-gaming p-5">
          <h3 className="text-neon font-semibold mb-3 text-sm">{'\u1794\u1789\u17D2\u1785\u17BC\u179B Card Keys \u1790\u17D2\u1798\u17B8'}</h3>
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
              <label className="text-white/40 text-xs block mb-1">{'\u1780\u17BC\u1793\u179F\u17C4 Card Keys (\u1798\u17BD\u1799\u1780\u17BC\u1793\u179F\u17C4\u1780\u17D2\u1793\u17BB\u1784\u1798\u17BD\u1799\u1794\u1793\u17D2\u1791\u17B6\u178F\u17CB)'}</label>
              <textarea
                value={importKeys}
                onChange={e => setImportKeys(e.target.value)}
                placeholder="KEY1&#10;KEY2&#10;KEY3"
                rows={5}
                className="w-full bg-obsidian border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono placeholder:text-white/20 focus:border-neon/50 focus:outline-none resize-none"
              />
            </div>
            {importResult && (
              <p className={`text-xs ${importResult.includes('fail') ? 'text-red-400' : 'text-green-400'}`}>{importResult}</p>
            )}
            <button onClick={handleImport} disabled={importing || !importProductId || !importKeys.trim()}
              className="btn-gold text-sm w-full py-2 disabled:opacity-50">
              {importing ? '\u1780\u17C6\u1796\u17BB\u1784\u1794\u1789\u17D2\u1785\u17BC\u179B...' : '\u1794\u1789\u17D2\u1785\u17BC\u179B Keys'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'available', 'sold'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all ${filter === f ? 'bg-neon/10 text-neon border border-neon/30' : 'text-white/40 border border-white/5 hover:border-white/10'}`}>
            {f === 'all' ? '\u1791\u17B6\u17C6\u1784\u17A2\u179F\u17CB' : f === 'available' ? '\u1798\u17B6\u1793\u179F\u17D2\u178F\u17BB\u1780' : '\u179B\u1780\u17CB\u179A\u17BD\u1785'}
          </button>
        ))}
      </div>

      {/* Keys Table */}
      <div className="card-gaming overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neon/10">
                <th className="text-left py-3 px-4 text-white/40 font-normal text-xs">{'\u1795\u179B\u17B7\u178F\u1795\u179B'}</th>
                <th className="text-left py-3 px-4 text-white/40 font-normal text-xs">Key Code</th>
                <th className="text-left py-3 px-4 text-white/40 font-normal text-xs">{'\u179F\u17D2\u1790\u17B6\u1793\u1797\u17B6\u1796'}</th>
                <th className="text-left py-3 px-4 text-white/40 font-normal text-xs">{'\u1780\u17B6\u179B\u1794\u179A\u17B7\u1785\u17D2\u1786\u17C1\u1791'}</th>
              </tr>
            </thead>
            <tbody>
              {keys.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-white/30 text-sm">{'\u1798\u17B7\u1793\u1798\u17B6\u1793 Card Keys'}</td></tr>
              ) : (
                keys.map((key) => (
                  <tr key={key.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-white/60 text-xs">{key.productName}</td>
                    <td className="py-3 px-4 font-mono text-xs">
                      {key.isSold ? (
                        <span className="text-white/20">{key.keyCode.slice(0, 4)}****{key.keyCode.slice(-4)}</span>
                      ) : (
                        <span className="text-neon">{key.keyCode}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${key.isSold ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                        {key.isSold ? '\u179B\u1780\u17CB\u179A\u17BD\u1785' : '\u1798\u17B6\u1793'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white/30 text-xs">{new Date(key.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
