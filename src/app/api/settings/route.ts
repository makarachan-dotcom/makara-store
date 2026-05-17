// API Route: ការកំណត់គេហទំព័រ - Real Version with Prisma
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const ADMIN_EMAIL = 'chanmakara672@gmail.com'

const DEFAULT_SETTINGS: Record<string, string> = {
  maintenanceMode: 'false',
  telegramUrl: 'https://t.me/AF4STURF',
  instructionVideoUrl: '',
  khqrABA: '',
  khqrACLEDA: '',
  khqrWING: '',
}

async function getSetting(key: string): Promise<string> {
  const setting = await prisma.siteSetting.findUnique({ where: { key } })
  return setting?.value ?? DEFAULT_SETTINGS[key] ?? ''
}

async function setSetting(key: string, value: string): Promise<void> {
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value, type: 'string' },
  })
}

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany()
    const result: Record<string, string> = { ...DEFAULT_SETTINGS }
    for (const s of settings) {
      result[s.key] = s.value
    }
    return NextResponse.json({ settings: result })
  } catch {
    return NextResponse.json({ settings: DEFAULT_SETTINGS })
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const body = await request.json()

    for (const [key, value] of Object.entries(body)) {
      if (typeof value === 'string' || typeof value === 'boolean') {
        await setSetting(key, String(value))
      }
    }

    const updatedVal = await getSetting(Object.keys(body)[0] || 'maintenanceMode')
    void updatedVal

    const allSettings = await prisma.siteSetting.findMany()
    const result: Record<string, string> = { ...DEFAULT_SETTINGS }
    for (const s of allSettings) {
      result[s.key] = s.value
    }

    return NextResponse.json({ settings: result })
  } catch {
    return NextResponse.json(
      { error: 'កំហុសក្នុងការកែប្រែការកំណត់។ Error updating settings.' },
      { status: 500 }
    )
  }
}
