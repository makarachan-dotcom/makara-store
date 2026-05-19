import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  validateAccessToken,
  executeUpgrade,
} from '@/lib/chatgpt-upgrade'

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

    const { cardKey, accessToken } = await request.json()

    if (!cardKey) {
      return NextResponse.json({ error: 'Missing card key' }, { status: 400 })
    }

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Missing access token. Please provide your ChatGPT Access Token.' },
        { status: 400 }
      )
    }

    // Verify card key exists
    const key = await prisma.cardKey.findFirst({
      where: { keyCode: cardKey.trim() },
    })

    if (!key) {
      return NextResponse.json({ error: 'Invalid card key' }, { status: 400 })
    }

    // Check if this key has already been redeemed
    const existingTask = await prisma.topupTask.findFirst({
      where: { cardKey: cardKey.trim() },
    })

    if (existingTask) {
      return NextResponse.json({ error: 'Card key has already been redeemed' }, { status: 400 })
    }

    // Validate the access token before creating the task
    const tokenCheck = await validateAccessToken(accessToken.trim())
    if (!tokenCheck.valid) {
      return NextResponse.json(
        { error: tokenCheck.error || 'Invalid access token' },
        { status: 400 }
      )
    }

    const serviceType = service.toUpperCase() as 'CHATGPT' | 'CLAUDE' | 'GEMINI'

    // Create the task in PROCESSING state
    const task = await prisma.topupTask.create({
      data: {
        cardKey: cardKey.trim(),
        serviceType,
        accessToken: accessToken.trim(),
        accountEmail: tokenCheck.email || null,
        taskStatus: 'PROCESSING',
      },
    })

    // Execute the upgrade asynchronously
    executeUpgrade(accessToken.trim(), serviceType)
      .then(async (result) => {
        await prisma.topupTask.update({
          where: { id: task.id },
          data: {
            taskStatus: result.success ? 'SUCCESS' : 'FAILED',
            resultMessage: result.message,
            accountEmail: result.accountEmail || tokenCheck.email || null,
            completedAt: new Date(),
          },
        })
      })
      .catch(async (err) => {
        console.error('Upgrade execution error:', err)
        await prisma.topupTask.update({
          where: { id: task.id },
          data: {
            taskStatus: 'FAILED',
            resultMessage: 'Unexpected error during upgrade execution.',
            completedAt: new Date(),
          },
        })
      })

    return NextResponse.json({
      taskId: task.id,
      status: 'PROCESSING',
      message: `${service} upgrade initiated using access token. Validating and processing...`,
    })
  } catch (error) {
    console.error('Topup upgrade error:', error)
    return NextResponse.json({ error: 'Failed to create upgrade task' }, { status: 500 })
  }
}
