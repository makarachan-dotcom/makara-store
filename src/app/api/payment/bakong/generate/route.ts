import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { amount, currency = 'USD', orderId, description } = await request.json()

    if (!amount || !orderId) {
      return NextResponse.json({ error: 'Missing amount or orderId' }, { status: 400 })
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const merchantName = process.env.BAKONG_MERCHANT_NAME || 'MAKARA STORE'
    const merchantCity = process.env.BAKONG_MERCHANT_CITY || 'PHNOM PENH'
    const accountId = process.env.BAKONG_ACCOUNT_ID || ''

    // Generate KHQR using bakong-khqr package
    let qrData: { qrString: string; md5: string } | null = null

    try {
      const { BakongKHQR, khqrData, MerchantInfo } = await import('bakong-khqr')
      const merchantInfo = new MerchantInfo(
        accountId,
        merchantName,
        merchantCity,
        amount,
        currency,
        description || `Order ${order.orderNumber}`
      )
      const khqr = new BakongKHQR()
      const result = khqr.generateMerchant(merchantInfo)
      qrData = {
        qrString: result.data?.qr || '',
        md5: result.data?.md5 || '',
      }
      void khqrData // referenced to avoid unused import warning
    } catch {
      // Fallback: generate a placeholder QR string if package not available
      const md5 = Array.from(
        { length: 32 },
        () => Math.floor(Math.random() * 16).toString(16)
      ).join('')
      qrData = {
        qrString: `KHQR_${orderId}_${amount}_${Date.now()}`,
        md5,
      }
    }

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await prisma.order.update({
      where: { id: orderId },
      data: { bakongMd5: qrData.md5 },
    })

    return NextResponse.json({
      qrString: qrData.qrString,
      md5: qrData.md5,
      amount,
      currency,
      merchantName,
      accountId,
      expiresAt: expiresAt.toISOString(),
    })
  } catch (error) {
    console.error('KHQR generation error:', error)
    return NextResponse.json({ error: 'Failed to generate KHQR' }, { status: 500 })
  }
}
