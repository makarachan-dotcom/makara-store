import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { verifyAdminToken, COOKIE_NAME } from '@/lib/admin-token'

const ADMIN_EMAIL = 'chanmakara672@gmail.com'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check maintenance mode for storefront pages (not admin, not API, not auth, not static)
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api') && !pathname.startsWith('/login') && !pathname.startsWith('/register')) {
    try {
      const baseUrl = request.nextUrl.origin
      const settingsRes = await fetch(`${baseUrl}/api/settings`, {
        headers: { 'Cache-Control': 'no-cache' },
      })
      if (settingsRes.ok) {
        const data = await settingsRes.json()
        if (data.settings?.maintenanceMode === 'true') {
          const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
          if (!token || (token.email !== ADMIN_EMAIL && token.role !== 'ADMIN')) {
            return new NextResponse(
              `<!DOCTYPE html><html lang="km"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Makara Store - Maintenance</title><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#0B0F19;color:#fff;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center}.container{max-width:500px;padding:2rem}.icon{font-size:4rem;margin-bottom:1.5rem}h1{font-size:1.5rem;margin-bottom:0.75rem;color:#00F2FE}p{color:rgba(255,255,255,0.5);line-height:1.6;margin-bottom:0.5rem}</style></head><body><div class="container"><div class="icon">🔧</div><h1>ទំព័រកំពុងធ្វើបច្ចុប្បន្នភាព</h1><p>គេហទំព័រកំពុងស្ថិតក្នុងរបៀបថែទាំ។ សូមព្យាយាមម្ដងទៀតនៅពេលក្រោយ។</p><p style="color:rgba(255,255,255,0.3);font-size:0.875rem">The site is currently under maintenance. Please try again later.</p></div></body></html>`,
              { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
            )
          }
        }
      }
    } catch {
      // If settings check fails, allow access
    }
    return NextResponse.next()
  }

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Allow verify page — it validates the session itself via getServerSession()
  if (pathname === '/admin/verify') {
    return NextResponse.next()
  }

  // Admin route protection: require valid admin-verified cookie (HMAC-signed, Edge-compatible)
  const adminCookie = request.cookies.get(COOKIE_NAME)?.value
  if (!adminCookie) {
    const verifyUrl = new URL('/admin/verify', request.url)
    verifyUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(verifyUrl)
  }

  if (!(await verifyAdminToken(adminCookie, ADMIN_EMAIL))) {
    const verifyUrl = new URL('/admin/verify', request.url)
    verifyUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(verifyUrl)
  }

  // Best-effort JWT check: if getToken() succeeds and user is NOT admin, block access
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (token && token.email !== ADMIN_EMAIL && token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  } catch {
    // getToken() may fail in Edge Runtime — admin-verified cookie check is sufficient
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/', '/cart', '/checkout', '/favorites', '/product/:path*', '/category/:path*', '/purchase-history', '/account', '/instructions', '/chatgpt-upgrade', '/privacy-policy'],
}
