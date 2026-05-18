'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'

const services = [
  { id: 'chatgpt', name: 'ChatGPT Plus', icon: '/images/products/chatgpt.png', color: 'from-green-500/20 to-green-600/5' },
  { id: 'claude', name: 'Claude Pro', icon: '/images/products/claude.png', color: 'from-orange-500/20 to-orange-600/5' },
  { id: 'gemini', name: 'Gemini Pro', icon: '/images/products/gemini.png', color: 'from-blue-500/20 to-blue-600/5' },
]

interface StockData {
  [key: string]: { available: number; total: number }
}

export default function TopupPortalPage() {
  const { locale } = useTranslation()
  const [stock, setStock] = useState<StockData>({})

  useEffect(() => {
    const loadStock = async () => {
      for (const svc of services) {
        try {
          const res = await fetch(`/api/topup/${svc.id}/query-stock`)
          const data = await res.json()
          setStock(prev => ({ ...prev, [svc.id]: { available: data.available || 0, total: data.total || 0 } }))
        } catch {
          setStock(prev => ({ ...prev, [svc.id]: { available: 0, total: 0 } }))
        }
      }
    }
    loadStock()
    const interval = setInterval(loadStock, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="cyber-grid-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            {locale === 'km' ? '\u179f\u17c1\u179c\u17b6\u1780\u1798\u17d2\u1798\u179f\u17d2\u179c\u17d0\u1799\u1794\u17d2\u179a\u179c\u178f\u17d2\u178f\u17b7' : 'Self-Service Top-Up'}
          </h1>
          <p className="text-white/40 text-sm">
            {locale === 'km' ? '\u179a\u17c0\u1794\u1785\u17c6\u179f\u17c1\u179c\u17b6\u1780\u1798\u17d2\u1798\u178a\u17be\u1798\u17d2\u1794\u17b8\u178a\u17c6\u17a1\u17be\u1784\u1780\u17b6\u179a\u1794\u17d2\u179a\u17be Card Key' : 'Upgrade your service using your Card Key'}
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {services.map((svc, i) => {
            const svcStock = stock[svc.id]
            return (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={`/topup/${svc.id}`}
                  className={`block card-gaming p-6 bg-gradient-to-br ${svc.color} hover:border-neon/30 transition-all group`}
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-xl overflow-hidden relative bg-white/5">
                    <div className="w-full h-full flex items-center justify-center text-3xl">
                      {svc.id === 'chatgpt' ? '🤖' : svc.id === 'claude' ? '🧠' : '✨'}
                    </div>
                  </div>
                  <h3 className="text-white font-bold text-center mb-2 group-hover:text-neon transition-colors">{svc.name}</h3>
                  <div className="text-center">
                    {svcStock ? (
                      <span className={`text-xs px-2 py-1 rounded-full ${svcStock.available > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {svcStock.available > 0
                          ? `${locale === 'km' ? '\u1798\u17b6\u1793\u179f\u17d2\u178f\u17bb\u1780' : 'In Stock'} (${svcStock.available})`
                          : (locale === 'km' ? '\u17a2\u179f\u17cb\u179f\u17d2\u178f\u17bb\u1780' : 'Out of Stock')}
                      </span>
                    ) : (
                      <span className="text-xs text-white/30">{locale === 'km' ? '\u1780\u17c6\u1796\u17bb\u1784\u1796\u17b7\u1793\u17b7\u178f\u17d2\u1799...' : 'Loading...'}</span>
                    )}
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Stock Overview */}
        <div className="card-gaming p-6">
          <h3 className="text-neon font-semibold mb-4 text-sm">
            {locale === 'km' ? '\u179f\u17d2\u178f\u17bb\u1780\u1793\u17c5\u179f\u179b\u17cb' : 'Current Stock Levels'}
          </h3>
          <div className="space-y-3">
            {services.map(svc => {
              const svcStock = stock[svc.id]
              const pct = svcStock ? (svcStock.available / Math.max(svcStock.total, 1)) * 100 : 0
              return (
                <div key={svc.id} className="flex items-center gap-4">
                  <span className="text-white/60 text-sm w-32">{svc.name}</span>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${pct > 50 ? 'bg-green-500' : pct > 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-white/40 text-xs w-16 text-right">
                    {svcStock ? `${svcStock.available}/${svcStock.total}` : '...'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 text-center text-white/30 text-xs space-y-1">
          <p>{locale === 'km' ? '\u179f\u17d2\u178f\u17bb\u1780\u178f\u17d2\u179a\u17bc\u179c\u1794\u17b6\u1793\u1792\u17d2\u179c\u17be\u1794\u1785\u17d2\u1785\u17bb\u1794\u17d2\u1794\u1793\u17d2\u1793\u1797\u17b6\u1796\u179a\u17c0\u1784\u179a\u17b6\u179b\u17cb 30 \u179c\u17b7\u1793\u17b6\u1791\u17b8' : 'Stock updates every 30 seconds'}</p>
          <p>{locale === 'km' ? '\u178f\u17d2\u179a\u17bc\u179c\u1780\u17b6\u179a Card Key \u178a\u17be\u1798\u17d2\u1794\u17b8\u1794\u17d2\u179a\u17be' : 'You need a Card Key to use this service'}</p>
        </div>
      </div>
    </div>
  )
}
