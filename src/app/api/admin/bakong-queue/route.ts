import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, isAdminUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!isAdminUser(session?.user as { email?: string; role?: string })) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const receipts = await prisma.bakongReceipt.findMany({
      where: { adminStatus: 'PENDING_REVIEW' },
      include: {
        order: {
          include: {
            user: { select: { name: true, email: true } },
            items: { include: { product: { select: { nameKm: true, nameEn: true } } } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ receipts })
  } catch (error) {
    console.error('Bakong queue error:', error)
    return NextResponse.json({ error: 'Failed to load queue' }, { status: 500 })
  }
}
