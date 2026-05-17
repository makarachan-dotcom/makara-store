import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, isAdminUser } from '@/lib/auth'
import { createAdminToken, COOKIE_NAME, TOKEN_TTL } from '@/lib/admin-token'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email || !isAdminUser(session.user as { email?: string; role?: string })) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { pin } = await request.json()
  const adminPin = process.env.ADMIN_2FA_PIN

  if (!adminPin) {
    return NextResponse.json(
      { error: 'Admin PIN not configured' },
      { status: 500 }
    )
  }

  if (pin !== adminPin) {
    return NextResponse.json(
      { error: 'Invalid PIN' },
      { status: 403 }
    )
  }

  const token = await createAdminToken(session.user.email)
  const response = NextResponse.json({ success: true })
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: TOKEN_TTL,
  })

  return response
}
