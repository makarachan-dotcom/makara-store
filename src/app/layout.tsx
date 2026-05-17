import type { Metadata, Viewport } from 'next'
import { Kantumruy_Pro } from 'next/font/google'
import '@/styles/globals.css'

const kantumruyPro = Kantumruy_Pro({
  subsets: ['khmer', 'latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-kantumruy',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

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
    <html lang="km" className={`dark ${kantumruyPro.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            var store = JSON.parse(localStorage.getItem('makara-store-storage') || '{}');
            var mode = store && store.state && store.state.theme && store.state.theme.mode;
            if (mode) document.documentElement.setAttribute('data-theme', mode);
          } catch(e) {}
        `}} />
      </head>
      <body className="bg-obsidian text-white font-khmer antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
