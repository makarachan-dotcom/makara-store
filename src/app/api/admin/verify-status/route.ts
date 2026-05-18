import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, isAdminUser } from '@/lib/auth'
import { verifyAdminToken, COOKIE_NAME } from '@/lib/admin-token'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email || !isAdminUser(session.user as { email?: string; role?: string })) {
    return NextResponse.json({ verified: false }, { status: 401 })
  }

  const adminToken = request.cookies.get(COOKIE_NAME)?.value
  if (!adminToken) {
    return NextResponse.json({ verified: false })
  }

  const isValid = await verifyAdminToken(adminToken, session.user.email)
  return NextResponse.json({ verified: isValid })
}
