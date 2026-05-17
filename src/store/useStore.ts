'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Locale } from '@/i18n/translations'

// ============ ប្រភេទទិន្នន័យ ============

interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  metadata?: Record<string, string>
}

interface ThemeConfig {
  mode: 'dark' | 'light' | 'gaming'
  accentColor: string
}

// ============ Store ចម្បង ============

interface StoreState {
  // ភាសា
  locale: Locale
  setLocale: (locale: Locale) => void

  // ធាតុរចនាប័ទ្ម
  theme: ThemeConfig
  setTheme: (theme: Partial<ThemeConfig>) => void

  // កន្ត្រក
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number

  // Intro overlay
  hasSeenIntro: boolean
  setHasSeenIntro: (seen: boolean) => void

  // Favorites (optimistic UI with DB sync)
  favorites: string[]
  setFavorites: (ids: string[]) => void
  toggleFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean

  // Privacy policy
  privacyAgreed: boolean
  setPrivacyAgreed: (agreed: boolean) => void

  // UI State
  isMobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  isChatOpen: boolean
  setChatOpen: (open: boolean) => void
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // ភាសា - ខ្មែរជាភាសាលំនាំដើម
      locale: 'km',
      setLocale: (locale) => set({ locale }),

      // ធាតុរចនាប័ទ្ម
      theme: { mode: 'dark', accentColor: '#00F2FE' },
      setTheme: (theme) =>
        set((state) => ({ theme: { ...state.theme, ...theme } })),

      // កន្ត្រក
      cart: [],
      addToCart: (item) =>
        set((state) => {
          const existing = state.cart.find(
            (i) => i.productId === item.productId
          )
          if (existing) {
            return {
              cart: state.cart.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            }
          }
          return { cart: [...state.cart, item] }
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((i) => i.productId !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          cart: state.cart.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        })),
      clearCart: () => set({ cart: [] }),
      getCartTotal: () =>
        get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      getCartCount: () =>
        get().cart.reduce((sum, item) => sum + item.quantity, 0),

      // Intro overlay
      hasSeenIntro: false,
      setHasSeenIntro: (seen) => set({ hasSeenIntro: seen }),

      // Favorites (optimistic UI with DB sync)
      favorites: [],
      setFavorites: (ids) => set({ favorites: ids }),
      toggleFavorite: (productId) => {
        const prev = get().favorites
        const next = prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId]
        set({ favorites: next })
        fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        }).catch(() => {
          set({ favorites: prev })
        })
      },
      isFavorite: (productId) => get().favorites.includes(productId),

      // Privacy policy
      privacyAgreed: false,
      setPrivacyAgreed: (agreed) => set({ privacyAgreed: agreed }),

      // UI State
      isMobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
      isChatOpen: false,
      setChatOpen: (open) => set({ isChatOpen: open }),
    }),
    {
      name: 'makara-store-storage',
      partialize: (state) => ({
        locale: state.locale,
        theme: state.theme,
        cart: state.cart,
        favorites: state.favorites,
        privacyAgreed: state.privacyAgreed,
        hasSeenIntro: state.hasSeenIntro,
      }),
    }
  )
)
