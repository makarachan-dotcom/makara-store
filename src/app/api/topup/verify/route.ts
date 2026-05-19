import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { cardKey } = await request.json()

    if (!cardKey || typeof cardKey !== 'string') {
      return NextResponse.json({ error: 'Missing card key' }, { status: 400 })
    }

    const key = await prisma.cardKey.findFirst({
      where: {
        keyCode: cardKey.trim(),
      },
      include: {
        product: {
          select: { nameEn: true, nameKm: true, deliveryType: true },
        },
      },
    })

    if (!key) {
      return NextResponse.json({
        valid: false,
        error: 'Card key not found',
      })
    }

    // Check if this key has already been redeemed (used in a topup task)
    const existingTask = await prisma.topupTask.findFirst({
      where: { cardKey: cardKey.trim() },
    })

    if (existingTask) {
      return NextResponse.json({
        valid: false,
        error: 'Card key has already been redeemed',
      })
    }

    return NextResponse.json({
      valid: true,
      product: key.product.nameEn,
      productKm: key.product.nameKm,
    })
  } catch (error) {
    console.error('Card key verify error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
