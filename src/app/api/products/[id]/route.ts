// API Route: Get single product by slug or ID
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  try {
    // Try finding by slug first, then by ID
    let product = await prisma.product.findUnique({
      where: { slug: id },
      include: { category: true },
    })

    if (!product) {
      product = await prisma.product.findUnique({
        where: { id },
        include: { category: true },
      })
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ product })
  } catch {
    return NextResponse.json(
      { error: 'Error fetching product' },
      { status: 500 }
    )
  }
}
