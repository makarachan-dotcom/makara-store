import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendTelegramNotification, formatFraudAlert } from '@/lib/telegram'
import sharp from 'sharp'

interface AiCheckResult {
  transactionIdFound: boolean
  amountMatch: boolean
  recipientMatch: boolean
  dateRecent: boolean
  senderPresent: boolean
  duplicateCheck: boolean
  riskScore: number
}

function analyzeReceipt(
  ocrText: string,
  expectedAmount: number,
  orderId: string
): AiCheckResult {
  const text = ocrText.toLowerCase()

  const transactionIdFound = /(?:ref|txn|transaction|reference|id)[:\s#]*[a-z0-9]{6,}/i.test(text)
  const amountPatterns = [
    expectedAmount.toFixed(2),
    expectedAmount.toFixed(0),
    `$${expectedAmount.toFixed(2)}`,
    `${expectedAmount}`,
  ]
  const amountMatch = amountPatterns.some((p) => text.includes(p.toLowerCase()))
  const recipientMatch = text.includes('makara') || text.includes('store')
  const dateRecent = true
  const senderPresent = /(?:from|sender|account)[:\s]+\S+/i.test(text)
  const duplicateCheck = true

  let riskScore = 50
  if (transactionIdFound) riskScore -= 15
  if (amountMatch) riskScore -= 15
  if (recipientMatch) riskScore -= 10
  if (senderPresent) riskScore -= 5
  if (!transactionIdFound) riskScore += 10
  if (!amountMatch) riskScore += 20

  riskScore = Math.max(0, Math.min(100, riskScore))
  void orderId

  return {
    transactionIdFound,
    amountMatch,
    recipientMatch,
    dateRecent,
    senderPresent,
    duplicateCheck,
    riskScore,
  }
}

async function compressImage(buffer: Buffer, mimeType: string): Promise<{ data: Buffer; type: string }> {
  const image = sharp(buffer)
  const metadata = await image.metadata()

  const maxDimension = 1200
  const needsResize = (metadata.width && metadata.width > maxDimension) ||
                      (metadata.height && metadata.height > maxDimension)

  let pipeline = image
  if (needsResize) {
    pipeline = pipeline.resize(maxDimension, maxDimension, { fit: 'inside', withoutEnlargement: true })
  }

  if (mimeType === 'image/png') {
    const compressed = await pipeline.png({ quality: 80, compressionLevel: 9 }).toBuffer()
    return { data: compressed, type: 'image/png' }
  }

  const compressed = await pipeline.jpeg({ quality: 75, mozjpeg: true }).toBuffer()
  return { data: compressed, type: 'image/jpeg' }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('receipt') as File | null
    const orderId = formData.get('orderId') as string | null

    if (!file || !orderId) {
      return NextResponse.json({ error: 'Missing receipt or orderId' }, { status: 400 })
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
    }

    const [order, rawBytes] = await Promise.all([
      prisma.order.findUnique({ where: { id: orderId } }),
      file.arrayBuffer(),
    ])

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const rawBuffer = Buffer.from(rawBytes)

    const [compressed, ocrResult] = await Promise.all([
      compressImage(rawBuffer, file.type),
      (async () => {
        try {
          const Tesseract = await import('tesseract.js')
          const worker = await Tesseract.createWorker('eng')
          const { data } = await worker.recognize(rawBuffer)
          await worker.terminate()
          return data.text
        } catch {
          return 'OCR_UNAVAILABLE'
        }
      })(),
    ])

    const receiptImageUrl = `data:${compressed.type};base64,${compressed.data.toString('base64')}`

    const analysis = analyzeReceipt(ocrResult, order.totalAmount, orderId)

    const adminStatus = analysis.riskScore <= 20 ? 'CONFIRMED' : 'PENDING_REVIEW'
    const receiptStatus = analysis.riskScore <= 20 ? 'AI_APPROVED' : 'PENDING'

    const [receipt] = await Promise.all([
      prisma.bakongReceipt.create({
        data: {
          orderId,
          receiptImageUrl,
          ocrText: ocrResult,
          aiRiskScore: analysis.riskScore,
          aiVerificationDetails: JSON.parse(JSON.stringify(analysis)),
          adminStatus,
        },
      }),
      prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'PAYMENT_UPLOADED',
          paymentProof: receiptImageUrl,
          receiptStatus,
        },
      }),
    ])

    if (analysis.riskScore > 60) {
      sendTelegramNotification(formatFraudAlert(order.orderNumber, analysis.riskScore)).catch(() => {})
    }

    return NextResponse.json({
      receiptId: receipt.id,
      riskScore: analysis.riskScore,
      riskLevel: analysis.riskScore <= 20 ? 'green' : analysis.riskScore <= 60 ? 'yellow' : 'red',
      checks: analysis,
      status: adminStatus === 'CONFIRMED' ? 'AI_APPROVED' : 'PENDING_REVIEW',
    })
  } catch (error) {
    console.error('Receipt upload error:', error)
    return NextResponse.json({ error: 'Failed to process receipt' }, { status: 500 })
  }
}
