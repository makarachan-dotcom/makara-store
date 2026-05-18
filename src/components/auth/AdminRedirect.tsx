'use client'

import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

const ADMIN_EMAIL = 'chanmakara672@gmail.com'
const REDIRECT_COOLDOWN_KEY = 'admin-redirect-ts'
const COOLDOWN_MS = 5000

export default function AdminRedirect() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const redirected = useRef(false)

  useEffect(() => {
    if (status !== 'authenticated') return
    if (session?.user?.email !== ADMIN_EMAIL) return
    if (pathname?.startsWith('/admin')) return
    if (redirected.current) return
    if (pathname !== '/' && pathname !== '/login') return

    // Prevent redirect loop: skip if we redirected within the last 5 seconds
    const lastRedirect = sessionStorage.getItem(REDIRECT_COOLDOWN_KEY)
    if (lastRedirect && Date.now() - parseInt(lastRedirect, 10) < COOLDOWN_MS) return

    redirected.current = true
    sessionStorage.setItem(REDIRECT_COOLDOWN_KEY, String(Date.now()))
    window.location.href = '/admin/verify?callbackUrl=/admin/dashboard'
  }, [session, status, pathname])

  return null
}
