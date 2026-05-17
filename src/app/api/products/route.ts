// API Route: ផលិតផល CRUD - Real Version with Prisma
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const ADMIN_EMAIL = 'chanmakara672@gmail.com'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')
  const search = searchParams.get('search')
  const all = searchParams.get('all')

  const where: Record<string, unknown> = {}

  if (all !== 'true') {
    where.isActive = true
  }

  if (category && category !== 'all') {
    where.category = { slug: category }
  }

  if (featured === 'true') {
    where.isFeatured = true
  }

  if (search) {
    where.OR = [
      { nameKm: { contains: search, mode: 'insensitive' } },
      { nameEn: { contains: search, mode: 'insensitive' } },
      { slug: { contains: search, mode: 'insensitive' } },
    ]
  }

  try {
    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json({ products })
  } catch {
    return NextResponse.json({ products: [] })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { nameKm, nameEn, descriptionKm, descriptionEn, price, originalPrice, image, categoryId, stockStatus, isFeatured } = body

    if (!nameKm || !nameEn || price === undefined || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const slug = nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now()

    const product = await prisma.product.create({
      data: {
        slug,
        nameKm,
        nameEn,
        descriptionKm: descriptionKm || '',
        descriptionEn: descriptionEn || '',
        price: parseFloat(String(price)),
        originalPrice: originalPrice ? parseFloat(String(originalPrice)) : null,
        image: image || '/images/logo.jpg',
        categoryId,
        stockStatus: stockStatus || 'IN_STOCK',
        isFeatured: isFeatured || false,
        isActive: true,
      },
      include: { category: true },
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Error creating product' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    if (updateData.price !== undefined) updateData.price = parseFloat(String(updateData.price))
    if (updateData.originalPrice !== undefined) updateData.originalPrice = parseFloat(String(updateData.originalPrice))

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { category: true },
    })

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Error updating product' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Error deleting product' }, { status: 500 })
  }
}
