import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, isAdminUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendTelegramNotification, formatNewOrderNotification } from '@/lib/telegram'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!isAdminUser(session?.user as { email?: string; role?: string })) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const { receiptId, action } = await request.json()

    if (!receiptId || !['confirm', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Missing receiptId or invalid action' }, { status: 400 })
    }

    const receipt = await prisma.bakongReceipt.update({
      where: { id: receiptId },
      data: {
        adminStatus: action === 'confirm' ? 'CONFIRMED' : 'REJECTED',
        reviewedBy: session?.user?.email || undefined,
        reviewedAt: new Date(),
      },
      include: {
        order: {
          include: {
            items: { include: { product: true } },
          },
        },
      },
    })

    if (action === 'confirm') {
      // Update order status
      await prisma.order.update({
        where: { id: receipt.orderId },
        data: {
          status: 'PAYMENT_VERIFIED',
          receiptStatus: 'ADMIN_APPROVED',
          deliveryStatus: 'DELIVERING',
        },
      })

      // Auto-deliver card keys for AUTO delivery products
      for (const item of receipt.order.items) {
        if (item.product.deliveryType === 'AUTO') {
          const keys = await prisma.cardKey.findMany({
            where: { productId: item.productId, isSold: false },
            take: item.quantity,
          })

          if (keys.length > 0) {
            const keyIds = keys.map((k) => k.id)
            const keyCodes = keys.map((k) => k.keyCode)

            await prisma.cardKey.updateMany({
              where: { id: { in: keyIds } },
              data: { isSold: true, orderId: receipt.orderId, soldAt: new Date() },
            })

            await prisma.order.update({
              where: { id: receipt.orderId },
              data: {
                deliveredKeys: keyCodes,
                deliveryStatus: 'DELIVERED',
                status: 'COMPLETED',
              },
            })
          }
        }
      }

      const productName = receipt.order.items[0]?.product.nameEn || 'Product'
      await sendTelegramNotification(
        formatNewOrderNotification(receipt.order.orderNumber, productName, receipt.order.totalAmount, 'BAKONG_KHQR')
      )
    } else {
      await prisma.order.update({
        where: { id: receipt.orderId },
        data: {
          status: 'CANCELLED',
          receiptStatus: 'ADMIN_REJECTED',
        },
      })
    }

    return NextResponse.json({ success: true, receipt })
  } catch (error) {
    console.error('Bakong confirm/reject error:', error)
    return NextResponse.json({ error: 'Action failed' }, { status: 500 })
  }
}
