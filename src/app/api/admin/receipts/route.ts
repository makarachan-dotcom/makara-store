// API Route: Admin Receipt Management - Approve/Decline receipts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, isAdminUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!isAdminUser(session?.user as { email?: string; role?: string })) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        paymentProof: { not: null },
      },
      include: {
        user: { select: { name: true, email: true, image: true } },
        items: { include: { product: { select: { nameKm: true, nameEn: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ receipts: orders })
  } catch (error) {
    console.error('Error fetching receipts:', error)
    return NextResponse.json({ receipts: [] })
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!isAdminUser(session?.user as { email?: string; role?: string })) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const { orderId, action, adminNote, adjustedAmount } = await request.json()

    if (!orderId || !action) {
      return NextResponse.json({ error: 'Missing orderId or action' }, { status: 400 })
    }

    const receiptStatus = action === 'approve' ? 'ADMIN_APPROVED' : 'ADMIN_REJECTED'
    const orderStatus = action === 'approve' ? 'PAYMENT_VERIFIED' : 'CANCELLED'

    const updateData: Record<string, unknown> = {
      receiptStatus,
      status: orderStatus,
    }

    if (adminNote) updateData.adminNote = adminNote
    if (adjustedAmount !== undefined && adjustedAmount !== null) {
      updateData.adjustedAmount = parseFloat(String(adjustedAmount))
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        user: { select: { name: true, email: true } },
        items: true,
      },
    })

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Error updating receipt:', error)
    return NextResponse.json({ error: 'Error updating receipt' }, { status: 500 })
  }
}
