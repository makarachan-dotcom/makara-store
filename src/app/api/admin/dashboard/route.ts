// API Route: Admin Dashboard Stats - Real data from DB
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, isAdminUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!isAdminUser(session?.user as { email?: string; role?: string })) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const [totalOrders, totalUsers, totalProducts, orders, recentOrders] = await Promise.all([
      prisma.order.count(),
      prisma.user.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.findMany({ select: { totalAmount: true } }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true, image: true } } },
      }),
    ])

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0)

    return NextResponse.json({
      stats: {
        totalOrders,
        totalRevenue,
        totalUsers,
        totalProducts,
      },
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customer: o.user?.name || o.user?.email || 'N/A',
        customerEmail: o.user?.email,
        customerImage: o.user?.image,
        amount: o.totalAmount,
        status: o.status,
        createdAt: o.createdAt,
      })),
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({
      stats: { totalOrders: 0, totalRevenue: 0, totalUsers: 0, totalProducts: 0 },
      recentOrders: [],
    })
  }
}
