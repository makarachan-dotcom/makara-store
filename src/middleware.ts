import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { verifyAdminToken, COOKIE_NAME } from '@/lib/admin-token'

const ADMIN_EMAIL = 'chanmakara672@gmail.com'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const token = await getToken({ req: request })

  if (!token || (token.email !== ADMIN_EMAIL && token.role !== 'ADMIN')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (pathname === '/admin/verify') {
    return NextResponse.next()
  }

  const adminToken = request.cookies.get(COOKIE_NAME)?.value
  const email = token.email as string
  if (!adminToken || !verifyAdminToken(adminToken, email)) {
    const verifyUrl = new URL('/admin/verify', request.url)
    verifyUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(verifyUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
