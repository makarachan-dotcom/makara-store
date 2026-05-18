import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const SERVICE_PRODUCT_MAP: Record<string, string[]> = {
  chatgpt: ['chatgpt', 'gpt'],
  claude: ['claude'],
  gemini: ['gemini'],
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ service: string }> }
) {
  try {
    const { service } = await params
    const keywords = SERVICE_PRODUCT_MAP[service] || [service]

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        deliveryType: 'AUTO',
        OR: keywords.map((kw) => ({
          nameEn: { contains: kw, mode: 'insensitive' as const },
        })),
      },
      include: {
        cardKeys: {
          where: { isSold: false },
          select: { id: true },
        },
      },
    })

    const stock = products.map((p) => ({
      productId: p.id,
      productName: p.nameEn,
      available: p.cardKeys.length,
      inStock: p.cardKeys.length > 0,
    }))

    return NextResponse.json({ service, stock })
  } catch (error) {
    console.error('Stock query error:', error)
    return NextResponse.json({ error: 'Failed to query stock' }, { status: 500 })
  }
}
