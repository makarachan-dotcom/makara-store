import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: { select: { nameEn: true, nameKm: true, images: true, deliveryType: true } },
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check ownership
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user || (order.userId !== user.id && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    // Find card key if auto-delivered
    let cardKey: string | null = null
    if (order.status === 'COMPLETED') {
      const deliveredKey = await prisma.cardKey.findFirst({
        where: { orderId: order.id, isSold: true },
      })
      if (deliveredKey) {
        cardKey = deliveredKey.keyCode
      }
    }

    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentMethod: order.paymentMethod,
        totalAmount: order.totalAmount,
        deliveryType: order.items[0]?.product?.deliveryType || 'MANUAL',
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        receiptStatus: order.receiptStatus,
        items: order.items.map((item) => ({
          id: item.id,
          productName: item.product?.nameEn || 'Product',
          quantity: item.quantity,
          unitPrice: item.price,
        })),
        cardKey,
      },
    })
  } catch (error) {
    console.error('Order fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}
