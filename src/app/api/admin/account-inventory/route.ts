import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, isAdminUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!isAdminUser(session?.user as { email?: string; role?: string })) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  try {
    const where: Record<string, unknown> = {}
    if (status === 'available') where.isSold = false
    if (status === 'sold') where.isSold = true

    const accounts = await prisma.accountInventory.findMany({
      where,
      include: { product: { select: { nameEn: true } } },
      orderBy: { createdAt: 'desc' },
      take: 200,
    })

    // Stock summary
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: {
        id: true,
        nameEn: true,
        accountInventory: { select: { id: true, isSold: true } },
      },
    })

    const stockSummary = products
      .filter((p) => p.accountInventory.length > 0)
      .map((p) => ({
        productId: p.id,
        productName: p.nameEn,
        total: p.accountInventory.length,
        available: p.accountInventory.filter((a) => !a.isSold).length,
        sold: p.accountInventory.filter((a) => a.isSold).length,
      }))

    return NextResponse.json({
      accounts: accounts.map((a) => ({
        id: a.id,
        productId: a.productId,
        email: a.email,
        password: a.password,
        extraInfo: a.extraInfo,
        isSold: a.isSold,
        orderId: a.orderId,
        createdAt: a.createdAt.toISOString(),
        soldAt: a.soldAt?.toISOString() || null,
      })),
      stockSummary,
    })
  } catch (error) {
    console.error('Account inventory error:', error)
    return NextResponse.json({ error: 'Failed to load inventory' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!isAdminUser(session?.user as { email?: string; role?: string })) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const { productId, accounts } = await request.json()

    if (!productId || !accounts || !Array.isArray(accounts) || accounts.length === 0) {
      return NextResponse.json({ error: 'Missing productId or accounts array' }, { status: 400 })
    }

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const created = await prisma.accountInventory.createMany({
      data: accounts.map((acc: { email: string; password: string; extraInfo?: string }) => ({
        productId,
        email: acc.email.trim(),
        password: acc.password.trim(),
        extraInfo: acc.extraInfo?.trim() || null,
      })),
    })

    return NextResponse.json({ created: created.count, message: `Imported ${created.count} accounts` })
  } catch (error) {
    console.error('Account import error:', error)
    return NextResponse.json({ error: 'Failed to import accounts' }, { status: 500 })
  }
}
