import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, ADMIN_EMAIL } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const baseUrl = request.nextUrl.origin

  if (session?.user?.email === ADMIN_EMAIL) {
    return NextResponse.redirect(new URL('/admin/verify?callbackUrl=/admin/dashboard', baseUrl))
  }

  return NextResponse.redirect(new URL('/', baseUrl))
}
