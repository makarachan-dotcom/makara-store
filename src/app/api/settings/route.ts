// API Route: ការកំណត់គេហទំព័រ - Real Version with Prisma
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, isAdminUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

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
  let session = null
  try {
    session = await getServerSession(authOptions)
  } catch (authError) {
    console.error('getServerSession failed:', authError)
    return NextResponse.json({ error: 'Authentication error. Please log out and log in again.' }, { status: 401 })
  }

  if (!isAdminUser(session?.user as { email?: string; role?: string })) {
    return NextResponse.json({ error: 'Admin access required. Please log in as admin.' }, { status: 403 })
  }

  try {
    const body = await request.json()

    for (const [key, value] of Object.entries(body)) {
      if (typeof value === 'string' || typeof value === 'boolean') {
        await setSetting(key, String(value))
      }
    }

    const allSettings = await prisma.siteSetting.findMany()
    const result: Record<string, string> = { ...DEFAULT_SETTINGS }
    for (const s of allSettings) {
      result[s.key] = s.value
    }

    return NextResponse.json({ settings: result })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: `Error saving settings: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
