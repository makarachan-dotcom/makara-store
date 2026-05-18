import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { sendTelegramNotification, formatNewOrderNotification } from '@/lib/telegram'

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const body = await request.text()
  const sig = request.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  try {
    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret)

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object
      const orderId = paymentIntent.metadata.orderId

      if (orderId) {
        const order = await prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'PAYMENT_VERIFIED',
            receiptStatus: 'ADMIN_APPROVED',
            deliveryStatus: 'DELIVERING',
          },
          include: {
            items: { include: { product: true } },
          },
        })

        // Auto-deliver card keys for AUTO delivery products
        for (const item of order.items) {
          if (item.product.deliveryType === 'AUTO') {
            const keys = await prisma.cardKey.findMany({
              where: {
                productId: item.productId,
                isSold: false,
              },
              take: item.quantity,
            })

            if (keys.length > 0) {
              const keyIds = keys.map((k) => k.id)
              const keyCodes = keys.map((k) => k.keyCode)

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
            }
          }
        }

        const productName = order.items[0]?.product.nameEn || 'Product'
        await sendTelegramNotification(
          formatNewOrderNotification(order.orderNumber, productName, order.totalAmount, 'STRIPE')
        )
      }
    }

    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object
      const orderId = paymentIntent.metadata.orderId

      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: 'CANCELLED' },
        })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }
}
