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
    const merchantId = process.env.BAKONG_MERCHANT_ID || 'MAKARA'
    const acquiringBank = process.env.BAKONG_ACQUIRING_BANK || 'ABA Bank'

    // Generate KHQR using bakong-khqr package
    let qrData: { qrString: string; md5: string } | null = null

    try {
      const { BakongKHQR, khqrData, MerchantInfo } = await import('bakong-khqr')
      const expirationTimestamp = String(Date.now() + 10 * 60 * 1000)
      const merchantInfo = new MerchantInfo(
        accountId,
        merchantName,
        merchantCity,
        merchantId,
        acquiringBank,
        {
          currency: currency === 'KHR' ? khqrData.currency.khr : khqrData.currency.usd,
          amount: currency === 'KHR' ? Math.round(Number(amount)) : parseFloat(Number(amount).toFixed(2)),
          billNumber: order.orderNumber || orderId,
          purposeOfTransaction: description || `Order ${order.orderNumber}`,
          expirationTimestamp,
        }
      )
      const bakong = new BakongKHQR()
      const result = bakong.generateMerchant(merchantInfo)
      if (result.data) {
        qrData = {
          qrString: result.data.qr,
          md5: result.data.md5,
        }
      } else {
        console.error('KHQR generation returned error:', result.status)
        return NextResponse.json(
          { error: `KHQR generation failed: ${result.status?.message || 'Unknown error'}` },
          { status: 500 }
        )
      }
    } catch (err) {
      console.error('KHQR package error:', err)
      return NextResponse.json(
        { error: 'Failed to generate KHQR: package error' },
        { status: 500 }
      )
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
