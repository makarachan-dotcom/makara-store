'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

const ADMIN_EMAIL = 'chanmakara672@gmail.com'

export default function AdminRedirect() {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  useEffect(() => {
    if (status !== 'authenticated') return
    if (session?.user?.email !== ADMIN_EMAIL) return
    if (pathname?.startsWith('/admin')) return

    const justLoggedIn = sessionStorage.getItem('admin-login-redirect')
    if (justLoggedIn === 'done') return

    sessionStorage.setItem('admin-login-redirect', 'done')
    window.location.href = '/admin/dashboard'
  }, [session, status, pathname])

  return null
}
