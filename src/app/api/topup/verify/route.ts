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
        isSold: true,
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
        error: 'Card key not found or not yet activated',
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
