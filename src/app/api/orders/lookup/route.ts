import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { orderNumber } = await request.json()

    if (!orderNumber || typeof orderNumber !== 'string') {
      return NextResponse.json({ error: 'Missing order number' }, { status: 400 })
    }

    const order = await prisma.order.findFirst({
      where: { orderNumber: orderNumber.trim().toUpperCase() },
      include: {
        items: {
          include: {
            product: { select: { nameEn: true, nameKm: true, deliveryType: true } },
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    let deliveredKeys: string[] = []
    if (order.status === 'COMPLETED' && order.deliveredKeys) {
      deliveredKeys = order.deliveredKeys
    }

    return NextResponse.json({
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        deliveryStatus: order.deliveryStatus,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt,
        items: order.items.map((item) => ({
          productName: item.product?.nameEn || 'Product',
          productNameKm: item.product?.nameKm || '',
          quantity: item.quantity,
          price: item.price,
        })),
        deliveredKeys,
      },
    })
  } catch (error) {
    console.error('Order lookup error:', error)
    return NextResponse.json({ error: 'Lookup failed' }, { status: 500 })
  }
}
