import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Makara Store - Premium Digital Store',
  description: 'Makara Store - ហាងឌីជីថលបុព្វលាភ | Premium Gaming & Digital Products',
  icons: {
    icon: '/images/logo.jpg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="km" className="dark">
      <body className="bg-obsidian text-white font-khmer antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
