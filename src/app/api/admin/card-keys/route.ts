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

    const stockSummary = products.map((p) => ({
      productId: p.id,
      productName: p.nameEn,
      productNameKm: p.nameKm,
      total: p.cardKeys.length,
      available: p.cardKeys.filter((k) => !k.isSold).length,
      sold: p.cardKeys.filter((k) => k.isSold).length,
    }))

    // Fetch ALL active products for the import dropdown
    // (includes non-AUTO products so admin can import keys for any product)
    const allProducts = await prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, nameEn: true, nameKm: true, deliveryType: true },
      orderBy: { nameEn: 'asc' },
    })

    // Fetch individual keys for the table
    const keys = await prisma.cardKey.findMany({
      include: { product: { select: { nameEn: true } } },
      orderBy: { createdAt: 'desc' },
      take: 500,
    })

    return NextResponse.json({
      stockSummary,
      allProducts: allProducts.map((p) => ({
        id: p.id,
        nameEn: p.nameEn,
        nameKm: p.nameKm,
        deliveryType: p.deliveryType,
      })),
      keys: keys.map((k) => ({
        id: k.id,
        productId: k.productId,
        productName: k.product.nameEn,
        keyCode: k.keyCode,
        isSold: k.isSold,
        orderId: k.orderId,
        createdAt: k.createdAt.toISOString(),
        soldAt: k.soldAt?.toISOString() || null,
      })),
    })
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
    const body = await request.json()
    const { productId } = body
    let keys: string[] = body.keys

    // Also accept raw keysText string and parse on the backend
    if (!keys && body.keysText && typeof body.keysText === 'string') {
      keys = body.keysText
        .split(/[\n\r,;]+/)
        .map((k: string) => k.trim())
        .filter(Boolean)
    }

    // Handle case where keys was sent as a single string instead of array
    if (typeof keys === 'string') {
      keys = (keys as string)
        .split(/[\n\r,;]+/)
        .map((k: string) => k.trim())
        .filter(Boolean)
    }

    if (!productId) {
      return NextResponse.json({ error: 'Missing product ID. Please select a product from the dropdown.' }, { status: 400 })
    }

    if (!keys || !Array.isArray(keys) || keys.length === 0) {
      return NextResponse.json({ error: 'No valid keys provided. Enter one key per line.' }, { status: 400 })
    }

    // Clean and validate keys - ensure all entries are non-empty strings
    const cleanedKeys = keys
      .map((k) => (typeof k === 'string' ? k.trim() : String(k).trim()))
      .filter((k) => k.length > 0)

    if (cleanedKeys.length === 0) {
      return NextResponse.json({ error: 'No valid keys found after trimming whitespace.' }, { status: 400 })
    }

    // Resolve product: try ObjectId first, then fallback to name/slug lookup
    const isValidObjectId = /^[a-f\d]{24}$/i.test(productId)
    const product = isValidObjectId
      ? await prisma.product.findUnique({ where: { id: productId } })
      : null

    const resolvedProduct = product ?? await prisma.product.findFirst({
      where: {
        isActive: true,
        OR: [
          { nameEn: { equals: productId, mode: 'insensitive' } },
          { nameEn: { contains: productId, mode: 'insensitive' } },
          { slug: { equals: productId, mode: 'insensitive' } },
        ],
      },
    })

    if (!resolvedProduct) {
      return NextResponse.json({
        error: `Product not found for ID "${productId}". Please select a valid product from the dropdown.`,
      }, { status: 404 })
    }

    // Insert keys using the resolved product.id (guaranteed valid ObjectId)
    const created = await prisma.cardKey.createMany({
      data: cleanedKeys.map((keyCode: string) => ({
        productId: resolvedProduct.id,
        keyCode,
      })),
    })

    // Auto-set deliveryType to AUTO if not already
    if (resolvedProduct.deliveryType !== 'AUTO') {
      await prisma.product.update({
        where: { id: resolvedProduct.id },
        data: { deliveryType: 'AUTO' },
      })
    }

    // Check stock levels and send alert if low
    const remaining = await prisma.cardKey.count({
      where: { productId: resolvedProduct.id, isSold: false },
    })

    if (remaining <= 5) {
      await sendTelegramNotification(formatLowStockAlert(resolvedProduct.nameEn, remaining))
    }

    return NextResponse.json({
      imported: created.count,
      message: `Imported ${created.count} keys for "${resolvedProduct.nameEn}"`,
      totalAvailable: remaining,
    })
  } catch (error) {
    console.error('Card key import error:', error)
    const detail = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: `Failed to import keys: ${detail}` }, { status: 500 })
  }
}
