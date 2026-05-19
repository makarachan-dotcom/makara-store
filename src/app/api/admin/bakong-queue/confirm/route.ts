import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, isAdminUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendTelegramNotification, formatNewOrderNotification } from '@/lib/telegram'
import { sendDeliveryEmail, sendPaymentVerifiedEmail } from '@/lib/email'

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
      const allDeliveredKeys: string[] = []
      let deliveryProductName = ''
      for (const item of receipt.order.items) {
        if (item.product.deliveryType === 'AUTO') {
          const keys = await prisma.cardKey.findMany({
            where: { productId: item.productId, isSold: false },
            take: item.quantity,
          })

          if (keys.length > 0) {
            const keyIds = keys.map((k) => k.id)
            const keyCodes = keys.map((k) => k.keyCode)
            allDeliveredKeys.push(...keyCodes)
            deliveryProductName = item.product.nameEn

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

            // Log the delivery
            await prisma.deliveryLog.create({
              data: {
                orderId: receipt.orderId,
                orderNumber: receipt.order.orderNumber,
                productName: item.product.nameEn,
                deliveryType: 'CARD_KEY',
                deliveredItem: keyCodes.join(', '),
                status: 'SUCCESS',
              },
            })
          } else {
            await prisma.deliveryLog.create({
              data: {
                orderId: receipt.orderId,
                orderNumber: receipt.order.orderNumber,
                productName: item.product.nameEn,
                deliveryType: 'CARD_KEY',
                deliveredItem: '',
                status: 'FAILED',
                errorMessage: 'No available card keys in stock',
              },
            })
          }
        }
      }

      // Send email notifications
      const orderUser = await prisma.user.findUnique({ where: { id: receipt.order.userId } })
      if (orderUser?.email) {
        try {
          if (allDeliveredKeys.length > 0) {
            await sendDeliveryEmail(orderUser.email, {
              orderNumber: receipt.order.orderNumber,
              productName: deliveryProductName,
              deliveredKeys: allDeliveredKeys,
              deliveryType: 'CARD_KEY',
            })
          } else {
            await sendPaymentVerifiedEmail(orderUser.email, {
              orderNumber: receipt.order.orderNumber,
              totalAmount: receipt.order.totalAmount,
            })
          }
        } catch (emailError) {
          console.error('Email notification failed:', emailError)
        }
      }

      const productName = receipt.order.items[0]?.product.nameEn || 'Product'
      await sendTelegramNotification(
        formatNewOrderNotification(receipt.order.orderNumber, productName, receipt.order.totalAmount, 'BAKONG_KHQR')
      )
    } else {
      // Auto-delete buy history and payment records when admin rejects
      // Delete related bakong receipts first
      await prisma.bakongReceipt.deleteMany({
        where: { orderId: receipt.orderId },
      })

      // Delete order items
      await prisma.orderItem.deleteMany({
        where: { orderId: receipt.orderId },
      })

      // Delete the order itself
      await prisma.order.delete({
        where: { id: receipt.orderId },
      })
    }

    return NextResponse.json({ success: true, receipt })
  } catch (error) {
    console.error('Bakong confirm/reject error:', error)
    return NextResponse.json({ error: 'Action failed' }, { status: 500 })
  }
}
