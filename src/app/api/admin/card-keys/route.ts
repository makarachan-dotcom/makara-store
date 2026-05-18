import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, isAdminUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendTelegramNotification, formatLowStockAlert } from '@/lib/telegram'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!isAdminUser(session?.user as { email?: string; role?: string })) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const products = await prisma.product.findMany({
      where: { deliveryType: 'AUTO', isActive: true },
      select: {
        id: true,
        nameEn: true,
        nameKm: true,
        cardKeys: {
          select: { id: true, isSold: true },
        },
      },
    })

    const inventory = products.map((p) => ({
      productId: p.id,
      productName: p.nameEn,
      productNameKm: p.nameKm,
      total: p.cardKeys.length,
      available: p.cardKeys.filter((k) => !k.isSold).length,
      sold: p.cardKeys.filter((k) => k.isSold).length,
    }))

    return NextResponse.json({ inventory })
  } catch (error) {
    console.error('Card keys error:', error)
    return NextResponse.json({ error: 'Failed to load inventory' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!isAdminUser(session?.user as { email?: string; role?: string })) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const { productId, keys } = await request.json()

    if (!productId || !keys || !Array.isArray(keys) || keys.length === 0) {
      return NextResponse.json({ error: 'Missing productId or keys array' }, { status: 400 })
    }

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const created = await prisma.cardKey.createMany({
      data: keys.map((keyCode: string) => ({
        productId,
        keyCode: keyCode.trim(),
      })),
    })

    // Check stock levels and send alert if low
    const remaining = await prisma.cardKey.count({
      where: { productId, isSold: false },
    })

    if (remaining <= 5) {
      await sendTelegramNotification(formatLowStockAlert(product.nameEn, remaining))
    }

    return NextResponse.json({ created: created.count, totalAvailable: remaining })
  } catch (error) {
    console.error('Card key import error:', error)
    return NextResponse.json({ error: 'Failed to import keys' }, { status: 500 })
  }
}
