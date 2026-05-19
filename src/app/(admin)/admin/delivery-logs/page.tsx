'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface DeliveryLogItem {
  id: string
  orderId: string
  orderNumber: string
  productName: string
  deliveryType: string
  deliveredItem: string
  status: string
  errorMessage: string | null
  createdAt: string
}

export default function DeliveryLogsPage() {
  const [logs, setLogs] = useState<DeliveryLogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'SUCCESS' | 'FAILED'>('all')

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const params = new URLSearchParams()
        if (filter !== 'all') params.set('status', filter)
        const res = await fetch(`/api/admin/delivery-logs?${params}`)
        const data = await res.json()
        setLogs(data.logs || [])
      } catch {
        // Error
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [filter])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const successCount = logs.filter(l => l.status === 'SUCCESS').length
  const failedCount = logs.filter(l => l.status === 'FAILED').length

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-white font-khmer">កំណត់ហេតុ Delivery Logs</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card-gaming p-4 text-center">
          <p className="text-2xl font-bold text-white">{logs.length}</p>
          <p className="text-white/30 text-xs mt-1">សរុប</p>
        </div>
        <div className="card-gaming p-4 text-center">
          <p className="text-2xl font-bold text-green-400">{successCount}</p>
          <p className="text-white/30 text-xs mt-1">ជោគជ័យ</p>
        </div>
        <div className="card-gaming p-4 text-center">
          <p className="text-2xl font-bold text-red-400">{failedCount}</p>
          <p className="text-white/30 text-xs mt-1">បរាជ័យ</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(['all', 'SUCCESS', 'FAILED'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f ? 'bg-neon/20 text-neon' : 'bg-white/5 text-white/40 hover:text-white/60'
            }`}
          >
            {f === 'all' ? 'ទាំងអស់' : f === 'SUCCESS' ? 'ជោគជ័យ' : 'បរាជ័យ'}
          </button>
        ))}
      </div>

      {/* Logs List */}
      <div className="space-y-2">
        {logs.length === 0 ? (
          <div className="card-gaming p-8 text-center">
            <p className="text-white/30 text-sm">មិនមានកំណត់ហេតុទេ</p>
          </div>
        ) : (
          logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card-gaming p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.status === 'SUCCESS' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {log.status}
                    </span>
                    <span className="text-white/20 text-xs">{log.deliveryType}</span>
                  </div>
                  <p className="text-white text-sm font-semibold">{log.orderNumber}</p>
                  <p className="text-white/40 text-xs mt-0.5">{log.productName}</p>
                  {log.deliveredItem && (
                    <p className="text-neon/60 text-xs mt-1 font-mono truncate">{log.deliveredItem}</p>
                  )}
                  {log.errorMessage && (
                    <p className="text-red-400/80 text-xs mt-1">{log.errorMessage}</p>
                  )}
                </div>
                <p className="text-white/20 text-[10px] whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
