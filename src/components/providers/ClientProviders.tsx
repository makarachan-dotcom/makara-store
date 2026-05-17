'use client'

import { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import CinematicIntro from '@/components/intro/CinematicIntro'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import FloatingAIBot from '@/components/chat/FloatingAIBot'

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <CinematicIntro />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <MobileBottomNav />
      <FloatingAIBot />
    </SessionProvider>
  )
}
