// API Route: ការជូនដំណឹង - Real Version with Prisma
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, isAdminUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    })
    return NextResponse.json({ announcements })
  } catch {
    return NextResponse.json({ announcements: [] })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!isAdminUser(session?.user as { email?: string; role?: string })) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { titleKm, titleEn, contentKm, contentEn, type } = body

    if (!titleKm || !titleEn) {
      return NextResponse.json(
        { error: 'សូមបំពេញចំណងជើងទាំងពីរភាសា។' },
        { status: 400 }
      )
    }

    const announcement = await prisma.announcement.create({
      data: {
        titleKm,
        titleEn,
        contentKm: contentKm || '',
        contentEn: contentEn || '',
        type: type || 'INFO',
        isActive: true,
      },
    })

    return NextResponse.json({ announcement }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'កំហុសក្នុងការបង្កើតការជូនដំណឹង។' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!isAdminUser(session?.user as { email?: string; role?: string })) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { id, titleKm, titleEn, contentKm, contentEn, type, isActive } = body

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    const updateData: Record<string, string | boolean> = {}
    if (titleKm !== undefined) updateData.titleKm = titleKm
    if (titleEn !== undefined) updateData.titleEn = titleEn
    if (contentKm !== undefined) updateData.contentKm = contentKm
    if (contentEn !== undefined) updateData.contentEn = contentEn
    if (type !== undefined) updateData.type = type
    if (isActive !== undefined) updateData.isActive = isActive

    const announcement = await prisma.announcement.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ announcement })
  } catch {
    return NextResponse.json(
      { error: 'កំហុសក្នុងការកែប្រែការជូនដំណឹង។' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!isAdminUser(session?.user as { email?: string; role?: string })) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    await prisma.announcement.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'កំហុសក្នុងការលុបការជូនដំណឹង។' },
      { status: 500 }
    )
  }
}
