'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useTranslation } from '@/hooks/useTranslation'
import { useStore } from '@/store/useStore'

interface Message {
  id: string
  role: 'user' | 'bot'
  content: string
  timestamp: Date
}

export default function FloatingAIBot() {
  const { t, locale } = useTranslation()
  const { isChatOpen, setChatOpen } = useStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const getFallbackResponse = useCallback(
    (message: string): string => {
      const lower = message.toLowerCase()
      if (lower.includes('price') || lower.includes('\u178f\u1798\u17d2\u179b\u17c3')) {
        return locale === 'km'
          ? '\u179f\u1798\u17d2\u179a\u17b6\u1794\u17cb\u1796\u17d0\u178f\u17cc\u1798\u17b6\u1793\u178f\u1798\u17d2\u179b\u17c3 \u179f\u17bc\u1798\u1798\u17be\u179b\u1795\u179b\u17b7\u178f\u1795\u179b\u1793\u17b8\u1798\u17bd\u1799\u17d7 \u17ac\u1791\u17b6\u1780\u17cb\u1791\u1784 Admin \u178f\u17b6\u1798 Telegram: @AF4STURF'
          : 'For pricing info, check each product or contact Admin on Telegram: @AF4STURF'
      }
      if (
        lower.includes('payment') ||
        lower.includes('\u1794\u1784\u17cb\u1794\u17d2\u179a\u17b6\u1780\u17cb') ||
        lower.includes('pay')
      ) {
        return locale === 'km'
          ? '\u1799\u17be\u1784\u1791\u1791\u17bd\u179b\u1794\u1784\u17cb\u1794\u17d2\u179a\u17b6\u1780\u17cb\u178f\u17b6\u1798 ABA Bank, ACLEDA Bank \u1793\u17b7\u1784 Wing Bank\u17d4 \u179f\u17bc\u1798\u1791\u17b6\u1780\u17cb\u1791\u1784 @AF4STURF'
          : 'We accept payments via ABA Bank, ACLEDA Bank, and Wing Bank. Contact @AF4STURF for help.'
      }
      return locale === 'km'
        ? '\u179f\u17bc\u1798\u17a2\u179a\u1782\u17bb\u178e\u179f\u1798\u17d2\u179a\u17b6\u1794\u17cb\u179f\u17b6\u179a! \u179f\u17bc\u1798\u1791\u17b6\u1780\u17cb\u1791\u1784 Admin \u178f\u17b6\u1798 Telegram: @AF4STURF'
        : 'Thank you for your message! Contact our Admin on Telegram: @AF4STURF'
    },
    [locale]
  )

  const sendMessageToAPI = useCallback(
    async (text: string, history: Message[]) => {
      setIsTyping(true)
      try {
        const chatHistory = [...history].map((m) => ({
          role: m.role === 'bot' ? 'assistant' : 'user',
          content: m.content,
        }))

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: chatHistory }),
        })

        const data = await res.json()
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: data.reply || getFallbackResponse(text),
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMsg])
      } catch {
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: getFallbackResponse(text),
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMsg])
      } finally {
        setIsTyping(false)
      }
    },
    [getFallbackResponse]
  )

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    const currentInput = input
    setInput('')

    await sendMessageToAPI(currentInput, updatedMessages)
  }

  const handleQuickQuestion = async (question: string) => {
    if (isTyping) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
      timestamp: new Date(),
    }

    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)

    await sendMessageToAPI(question, updatedMessages)
  }

  return (
    <>
      <motion.button
        onClick={() => setChatOpen(!isChatOpen)}
        className="fixed bottom-20 md:bottom-6 right-4 z-50 w-14 h-14 rounded-full
                   bg-gradient-to-br from-neon/80 to-blue-600/80 backdrop-blur-sm
                   border border-neon/30 shadow-lg shadow-neon/20
                   flex items-center justify-center overflow-hidden"
        animate={{
          y: [0, -6, 0],
          boxShadow: [
            '0 0 10px rgba(0,242,254,0.3)',
            '0 0 20px rgba(0,242,254,0.5)',
            '0 0 10px rgba(0,242,254,0.3)',
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Image
          src="/images/logo.jpg"
          alt="Makara AI"
          width={56}
          height={56}
          className="object-cover w-full h-full rounded-full"
        />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border-2 border-obsidian" />
      </motion.button>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-36 md:bottom-24 right-4 z-50
                       w-80 sm:w-96 h-[30rem] rounded-2xl overflow-hidden
                       glass border border-neon/20 flex flex-col shadow-2xl shadow-neon/10"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-obsidian-50 to-obsidian border-b border-neon/10">
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-neon/40"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Image
                    src="/images/logo.jpg"
                    alt="Makara AI"
                    width={36}
                    height={36}
                    className="object-cover w-full h-full"
                  />
                </motion.div>
                <div>
                  <p className="text-sm font-semibold text-neon">{t('aiChatTitle')}</p>
                  <p className="text-[10px] text-white/40">Powered by Kimi K2.6</p>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="text-white/40 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mt-6 space-y-4"
                >
                  <motion.div
                    className="w-16 h-16 mx-auto rounded-full overflow-hidden ring-2 ring-neon/30"
                    animate={{
                      boxShadow: [
                        '0 0 0 0 rgba(0,242,254,0.2)',
                        '0 0 0 10px rgba(0,242,254,0)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Image
                      src="/images/logo.jpg"
                      alt="Makara AI"
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </motion.div>
                  <div>
                    <p className="text-white/50 text-sm font-khmer">
                      {locale === 'km'
                        ? '\u179f\u17bd\u179f\u17d2\u178f\u17b8! \u178f\u17be\u1781\u17d2\u1789\u17bb\u17c6\u17a2\u17b6\u1785\u1787\u17bd\u1799\u17a2\u17d2\u179c\u17b8\u1794\u17b6\u1793?'
                        : 'Hello! How can I help you?'}
                    </p>
                    <p className="text-white/30 text-xs mt-1 font-khmer">
                      Makara Store AI Assistant
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {[
                      locale === 'km'
                        ? '\u178f\u1798\u17d2\u179b\u17c3\u1795\u179b\u17b7\u178f\u1795\u179b'
                        : 'Product prices',
                      locale === 'km'
                        ? '\u179c\u17b7\u1792\u17b8\u1794\u1784\u17cb\u1794\u17d2\u179a\u17b6\u1780\u17cb'
                        : 'Payment methods',
                      locale === 'km'
                        ? '\u179f\u17d2\u1790\u17b6\u1793\u1797\u17b6\u1796\u1780\u17b6\u179a\u1794\u1789\u17d2\u1787\u17b6\u1791\u17b7\u1789'
                        : 'Order status',
                      locale === 'km'
                        ? '\u1791\u17b6\u1780\u17cb\u1791\u1784 Admin'
                        : 'Contact Admin',
                    ].map((q) => (
                      <motion.button
                        key={q}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleQuickQuestion(q)}
                        className="text-xs text-white/50 border border-neon/15 rounded-lg px-3 py-2
                                   hover:border-neon/30 hover:text-white/70 hover:bg-neon/5
                                   transition-all font-khmer"
                      >
                        {q}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'bot' && (
                    <div className="w-6 h-6 rounded-full overflow-hidden mr-2 mt-1 flex-shrink-0 ring-1 ring-neon/20">
                      <Image
                        src="/images/logo.jpg"
                        alt="AI"
                        width={24}
                        height={24}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm font-khmer ${
                      msg.role === 'user'
                        ? 'bg-neon/20 text-white rounded-br-md'
                        : 'bg-obsidian-50 text-white/80 border border-neon/10 rounded-bl-md'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden mr-1 flex-shrink-0 ring-1 ring-neon/20">
                    <Image
                      src="/images/logo.jpg"
                      alt="AI"
                      width={24}
                      height={24}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="bg-obsidian-50 border border-neon/10 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <motion.span
                        className="w-2 h-2 bg-neon/50 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.span
                        className="w-2 h-2 bg-neon/50 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.span
                        className="w-2 h-2 bg-neon/50 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-4 py-2">
              <a
                href="https://t.me/AF4STURF"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full text-center text-xs
                           text-gold hover:text-gold-300 border border-gold/20 rounded-lg py-2
                           transition-all hover:bg-gold/5 font-khmer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                {t('liveAdminSupport')} &mdash; @AF4STURF
              </a>
            </div>

            <div className="p-3 border-t border-neon/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={t('aiChatPlaceholder')}
                  disabled={isTyping}
                  className="flex-1 bg-obsidian-50 border border-neon/20 rounded-lg px-3 py-2
                             text-sm text-white placeholder-white/30 focus:outline-none
                             focus:border-neon/50 font-khmer disabled:opacity-50 transition-colors"
                />
                <motion.button
                  onClick={sendMessage}
                  disabled={isTyping || !input.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-neon rounded-lg text-obsidian hover:bg-neon-400
                             transition-colors disabled:opacity-50 disabled:hover:bg-neon"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
