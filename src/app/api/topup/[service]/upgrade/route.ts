import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const VALID_SERVICES = ['chatgpt', 'claude', 'gemini']

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ service: string }> }
) {
  try {
    const { service } = await params
    if (!VALID_SERVICES.includes(service)) {
      return NextResponse.json({ error: 'Invalid service' }, { status: 400 })
    }

    const { cardKey, accountEmail } = await request.json()

    if (!cardKey) {
      return NextResponse.json({ error: 'Missing card key' }, { status: 400 })
    }

    // Verify card key exists and is sold (activated)
    const key = await prisma.cardKey.findFirst({
      where: { keyCode: cardKey.trim(), isSold: true },
    })

    if (!key) {
      return NextResponse.json({ error: 'Invalid or inactive card key' }, { status: 400 })
    }

    const serviceType = service.toUpperCase() as 'CHATGPT' | 'CLAUDE' | 'GEMINI'

    const task = await prisma.topupTask.create({
      data: {
        cardKey: cardKey.trim(),
        serviceType,
        accountEmail: accountEmail || null,
        taskStatus: 'QUEUED',
      },
    })

    return NextResponse.json({
      taskId: task.id,
      status: 'QUEUED',
      message: `${service} upgrade task queued. Check status for updates.`,
    })
  } catch (error) {
    console.error('Topup upgrade error:', error)
    return NextResponse.json({ error: 'Failed to create upgrade task' }, { status: 500 })
  }
}
