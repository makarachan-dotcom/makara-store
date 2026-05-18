'use client'

import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

const ADMIN_EMAIL = 'chanmakara672@gmail.com'

export default function AdminRedirect() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const redirected = useRef(false)

  useEffect(() => {
    if (status !== 'authenticated') return
    if (session?.user?.email !== ADMIN_EMAIL) return
    if (pathname?.startsWith('/admin')) return
    if (redirected.current) return

    // Only auto-redirect from landing pages (post-OAuth or post-login)
    // This allows admin to browse store pages without forced redirect
    if (pathname !== '/' && pathname !== '/login') return

    redirected.current = true
    window.location.href = '/admin/dashboard'
  }, [session, status, pathname])

  return null
}
