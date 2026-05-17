// API Route: Admin Categories Management
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const ADMIN_EMAIL = 'chanmakara672@gmail.com'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { products: true } } },
    })
    return NextResponse.json({ categories })
  } catch {
    return NextResponse.json({ categories: [] })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { nameKm, nameEn, icon } = body

    if (!nameKm || !nameEn) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const slug = nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

    const category = await prisma.category.create({
      data: { slug, nameKm, nameEn, icon: icon || null },
    })

    return NextResponse.json({ category }, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Error creating category' }, { status: 500 })
  }
}
