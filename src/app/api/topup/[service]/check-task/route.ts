import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ service: string }> }
) {
  const { searchParams } = new URL(request.url)
  const taskId = searchParams.get('taskId')
  const { service } = await params

  if (!taskId) {
    return NextResponse.json({ error: 'Missing taskId' }, { status: 400 })
  }

  try {
    const task = await prisma.topupTask.findUnique({
      where: { id: taskId },
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json({
      taskId: task.id,
      service,
      status: task.taskStatus,
      message: task.resultMessage,
      completedAt: task.completedAt?.toISOString() || null,
    })
  } catch (error) {
    console.error('Check task error:', error)
    return NextResponse.json({ error: 'Failed to check task' }, { status: 500 })
  }
}
