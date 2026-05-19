import { prisma } from '@/lib/prisma'
import { sendDeliveryEmail } from '@/lib/email'
import { sendTelegramNotification, formatNewOrderNotification } from '@/lib/telegram'

interface OrderItem {
  productId: string
  quantity: number
  product: { nameEn: string; deliveryType: string }
}

interface OrderForDelivery {
  id: string
  orderNumber: string
  totalAmount: number
  userId: string
  items: OrderItem[]
}

interface DeliveryResult {
  delivered: boolean
  deliveredKeys: string[]
  productName: string
}

export async function autoDeliverCardKeys(order: OrderForDelivery): Promise<DeliveryResult> {
  const allDeliveredKeys: string[] = []
  let deliveryProductName = ''

  for (const item of order.items) {
    if (item.product.deliveryType !== 'AUTO') continue

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
        data: { isSold: true, orderId: order.id, soldAt: new Date() },
      })

      await prisma.order.update({
        where: { id: order.id },
        data: {
          deliveredKeys: keyCodes,
          deliveryStatus: 'DELIVERED',
          status: 'COMPLETED',
        },
      })

      await prisma.deliveryLog.create({
        data: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          productName: item.product.nameEn,
          deliveryType: 'CARD_KEY',
          deliveredItem: keyCodes.join(', '),
          status: 'SUCCESS',
        },
      })
    } else {
      await prisma.deliveryLog.create({
        data: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          productName: item.product.nameEn,
          deliveryType: 'CARD_KEY',
          deliveredItem: '',
          status: 'FAILED',
          errorMessage: 'No available card keys in stock',
        },
      })
    }
  }

  // Send email notification to customer
  if (allDeliveredKeys.length > 0) {
    try {
      const user = await prisma.user.findUnique({ where: { id: order.userId } })
      if (user?.email) {
        await sendDeliveryEmail(user.email, {
          orderNumber: order.orderNumber,
          productName: deliveryProductName,
          deliveredKeys: allDeliveredKeys,
          deliveryType: 'CARD_KEY',
        })
      }
    } catch (emailError) {
      console.error('Delivery email failed:', emailError)
    }
  }

  return {
    delivered: allDeliveredKeys.length > 0,
    deliveredKeys: allDeliveredKeys,
    productName: deliveryProductName,
  }
}

export async function handlePaymentVerified(
  order: OrderForDelivery,
  paymentMethod: string
): Promise<DeliveryResult> {
  // Update order status to PAYMENT_VERIFIED
  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: 'PAYMENT_VERIFIED',
      receiptStatus: 'ADMIN_APPROVED',
      deliveryStatus: 'DELIVERING',
    },
  })

  // Auto-deliver card keys
  const result = await autoDeliverCardKeys(order)

  // Send Telegram notification
  const productName = order.items[0]?.product?.nameEn || 'Product'
  await sendTelegramNotification(
    formatNewOrderNotification(order.orderNumber, productName, order.totalAmount, paymentMethod)
  ).catch(() => {})

  return result
}
