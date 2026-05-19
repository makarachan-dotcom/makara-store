import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, isAdminUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { autoDeliverCardKeys } from '@/lib/delivery'
import { sendTelegramNotification, formatNewOrderNotification } from '@/lib/telegram'
import { sendPaymentVerifiedEmail } from '@/lib/email'

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

      // Auto-deliver card keys (shared logic handles delivery, logging, and customer email)
      const deliveryResult = await autoDeliverCardKeys(receipt.order)

      // If no card keys were delivered, send payment verified email instead
      if (!deliveryResult.delivered) {
        const orderUser = await prisma.user.findUnique({ where: { id: receipt.order.userId } })
        if (orderUser?.email) {
          try {
            await sendPaymentVerifiedEmail(orderUser.email, {
              orderNumber: receipt.order.orderNumber,
              totalAmount: receipt.order.totalAmount,
            })
          } catch (emailError) {
            console.error('Email notification failed:', emailError)
          }
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
