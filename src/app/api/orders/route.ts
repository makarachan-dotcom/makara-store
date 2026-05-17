import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const ADMIN_EMAIL = 'chanmakara672@gmail.com'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ orders: [] })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })
  if (!user) {
    return NextResponse.json({ orders: [] })
  }

  const isAdmin = session.user.email === ADMIN_EMAIL
  const orders = await prisma.order.findMany({
    where: isAdmin ? {} : { userId: user.id },
    include: { items: true, user: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ orders })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  try {
    const body = await request.json()
    const { items, bank, totalAmount } = body as {
      items: { productId: string; name: string; quantity: number; price: number }[]
      bank: string
      totalAmount: number
    }

    if (!items?.length || !bank) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase()

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        totalAmount,
        paymentMethod: bank as 'ABA_BANK' | 'ACLEDA_BANK' | 'WING_BANK',
        status: 'PAYMENT_UPLOADED',
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    })

    return NextResponse.json({ order }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error creating order' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const { orderId, status } = await request.json()
    if (!orderId || !status) {
      return NextResponse.json({ error: 'Missing orderId or status' }, { status: 400 })
    }

    const validStatuses = ['PENDING', 'PROCESSING', 'PAYMENT_UPLOADED', 'PAYMENT_VERIFIED', 'COMPLETED', 'CANCELLED', 'REFUNDED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: true, user: { select: { name: true, email: true } } },
    })

    return NextResponse.json({ order })
  } catch {
    return NextResponse.json({ error: 'Error updating order' }, { status: 500 })
  }
}
