import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { md5 } = await request.json()

    if (!md5) {
      return NextResponse.json({ error: 'Missing md5' }, { status: 400 })
    }

    const order = await prisma.order.findFirst({
      where: { bakongMd5: md5 },
      include: { items: { include: { product: true } } },
    })

    if (!order) {
      return NextResponse.json({ status: 'not_found' })
    }

    // Check if payment was already verified
    if (order.status === 'PAYMENT_VERIFIED' || order.status === 'COMPLETED') {
      return NextResponse.json({
        status: 'success',
        orderId: order.id,
        amount: order.totalAmount,
        paidAt: order.updatedAt.toISOString(),
      })
    }

    // Try to verify via Bakong API if configured
    const bakongToken = process.env.BAKONG_BEARER_TOKEN
    const bakongApiUrl = process.env.BAKONG_API_URL

    if (bakongToken && bakongApiUrl) {
      try {
        const res = await fetch(`${bakongApiUrl}/v1/check_transaction_by_md5`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bakongToken}`,
          },
          body: JSON.stringify({ md5 }),
        })

        if (res.ok) {
          const data = await res.json()
          if (data.responseCode === 0 && data.data) {
            await prisma.order.update({
              where: { id: order.id },
              data: { status: 'PAYMENT_VERIFIED' },
            })
            return NextResponse.json({
              status: 'success',
              transactionHash: data.data.hash || '',
              amount: order.totalAmount,
              paidAt: new Date().toISOString(),
            })
          }
        }
      } catch {
        // Bakong API check failed, fall through to pending
      }
    }

    return NextResponse.json({
      status: 'pending',
      orderId: order.id,
      amount: order.totalAmount,
    })
  } catch (error) {
    console.error('KHQR verify error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
