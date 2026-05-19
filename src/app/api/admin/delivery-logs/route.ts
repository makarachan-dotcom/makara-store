import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, isAdminUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!isAdminUser(session?.user as { email?: string; role?: string })) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  try {
    const where: Record<string, unknown> = {}
    if (status) where.status = status

    const logs = await prisma.deliveryLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 200,
    })

    return NextResponse.json({
      logs: logs.map((l) => ({
        id: l.id,
        orderId: l.orderId,
        orderNumber: l.orderNumber,
        productName: l.productName,
        deliveryType: l.deliveryType,
        deliveredItem: l.deliveredItem,
        status: l.status,
        errorMessage: l.errorMessage,
        createdAt: l.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error('Delivery logs error:', error)
    return NextResponse.json({ error: 'Failed to load logs' }, { status: 500 })
  }
}
