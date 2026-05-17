'use client'

// រូបមន្ត AI Robot អណ្តែត - ផ្ទាំង Chatbot ស្វ័យប្រវត្តិ
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'
import { useStore } from '@/store/useStore'

interface Message {
  id: string
  role: 'user' | 'bot'
  content: string
  timestamp: Date
}

// ចម្លើយស្វ័យប្រវត្តិ
const autoResponses: Record<string, { km: string; en: string }> = {
  default: {
    km: 'សូមអរគុណសម្រាប់សារ! ខ្ញុំកំពុងដំណើរការ... បើខ្ញុំមិនអាចជួយបាន សូមទាក់ទង Admin ផ្ទាល់។',
    en: 'Thank you for your message! Processing... If I cannot help, please contact Admin directly.',
  },
  price: {
    km: 'សម្រាប់ព័ត៌មានតម្លៃ សូមមើលផលិតផលនីមួយៗ ឬទាក់ទង Admin។',
    en: 'For pricing information, please check each product or contact Admin.',
  },
  payment: {
    km: 'យើងទទួលបង់ប្រាក់តាម ABA Bank, ACLEDA Bank និង Wing Bank។',
    en: 'We accept payments via ABA Bank, ACLEDA Bank, and Wing Bank.',
  },
  order: {
    km: 'សម្រាប់ស្ថានភាពការបញ្ជាទិញ សូមចូលគណនី រួចមើល "ប្រវត្តិការបញ្ជាទិញ"។',
    en: 'For order status, please log in and check "Order History".',
  },
}

function getAutoResponse(message: string, locale: 'km' | 'en'): string {
  const lower = message.toLowerCase()
  if (lower.includes('price') || lower.includes('តម្លៃ')) {
    return autoResponses.price[locale]
  }
  if (lower.includes('payment') || lower.includes('បង់ប្រាក់') || lower.includes('pay')) {
    return autoResponses.payment[locale]
  }
  if (lower.includes('order') || lower.includes('ការបញ្ជាទិញ')) {
    return autoResponses.order[locale]
  }
  return autoResponses.default[locale]
}

export default function FloatingAIBot() {
  const { t, locale } = useTranslation()
  const { isChatOpen, setChatOpen } = useStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')

    // ការឆ្លើយតបស្វ័យប្រវត្តិ
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: getAutoResponse(input, locale),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMsg])
    }, 800)
  }

  return (
    <>
      {/* ប៊ូតុង Robot អណ្តែត */}
      <motion.button
        onClick={() => setChatOpen(!isChatOpen)}
        className="fixed bottom-20 md:bottom-6 right-4 z-50 w-14 h-14 rounded-full
                   bg-gradient-to-br from-neon to-neon-700 shadow-lg
                   flex items-center justify-center group"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="w-7 h-7 text-obsidian" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        {/* ចំណុចភ្លឺ */}
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full animate-pulse" />
      </motion.button>

      {/* ផ្ទាំង Chat */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-36 md:bottom-24 right-4 z-50
                       w-80 sm:w-96 h-[28rem] rounded-2xl overflow-hidden
                       glass border border-neon/20 flex flex-col shadow-2xl"
          >
            {/* ក្បាល Chat */}
            <div className="flex items-center justify-between px-4 py-3 bg-obsidian-50 border-b border-neon/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-neon/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-neon">{t('aiChatTitle')}</p>
                  <p className="text-xs text-white/40">Makara Store</p>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* សារ */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-white/30 text-sm mt-8 font-khmer">
                  {locale === 'km'
                    ? 'សួស្តី! តើខ្ញុំអាចជួយអ្វីបាន?'
                    : 'Hello! How can I help you?'}
                </div>
              )}
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm font-khmer ${
                      msg.role === 'user'
                        ? 'bg-neon/20 text-white rounded-br-md'
                        : 'bg-obsidian-50 text-white/80 border border-neon/10 rounded-bl-md'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* ប៊ូតុង Live Admin Support */}
            <div className="px-4 py-2">
              <a
                href="https://t.me/makara_admin"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center text-xs text-gold hover:text-gold-300
                           border border-gold/20 rounded-lg py-2 transition-colors font-khmer"
              >
                💬 {t('liveAdminSupport')}
              </a>
            </div>

            {/* វាល Input */}
            <div className="p-3 border-t border-neon/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={t('aiChatPlaceholder')}
                  className="flex-1 bg-obsidian-50 border border-neon/20 rounded-lg px-3 py-2
                             text-sm text-white placeholder-white/30 focus:outline-none
                             focus:border-neon/50 font-khmer"
                />
                <button
                  onClick={sendMessage}
                  className="p-2 bg-neon rounded-lg text-obsidian hover:bg-neon-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
