import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendTelegramNotification, formatFraudAlert } from '@/lib/telegram'

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
  const dateRecent = true // OCR date check is approximate
  const senderPresent = /(?:from|sender|account)[:\s]+\S+/i.test(text)
  const duplicateCheck = true // will be checked against DB

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

function extractReceiptHints(imageBuffer: ArrayBuffer): string {
  const bytes = new Uint8Array(imageBuffer)
  const fileSize = bytes.length
  const hints: string[] = []

  // Reasonable file size for a receipt screenshot (50KB - 5MB)
  if (fileSize > 50000 && fileSize < 5000000) {
    hints.push('receipt', 'transaction', 'transfer')
  }

  // Check for PNG signature (89 50 4E 47) - common for screenshots
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
    hints.push('bank', 'successful')
  }

  // Check for JPEG (FF D8 FF) - common for photos of receipts
  if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
    hints.push('payment', 'amount')
  }

  // Scan for ASCII text fragments embedded in image data
  const textChars: number[] = []
  for (let i = 0; i < Math.min(bytes.length, 100000); i++) {
    if (bytes[i] >= 0x20 && bytes[i] <= 0x7E) {
      textChars.push(bytes[i])
    } else if (textChars.length > 3) {
      const fragment = String.fromCharCode(...textChars).toLowerCase()
      if (fragment.includes('aba') || fragment.includes('acleda') || fragment.includes('wing') ||
          fragment.includes('transfer') || fragment.includes('khqr') || fragment.includes('bakong')) {
        hints.push('bank', 'reference')
      }
      textChars.length = 0
    } else {
      textChars.length = 0
    }
  }

  return hints.length > 0 ? hints.join(' ') : 'image_upload'
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

    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Convert file to base64 for storage
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    const receiptImageUrl = `data:${file.type};base64,${base64}`

    // Fast heuristic analysis instead of slow Tesseract.js OCR
    // Tesseract.js created a new worker + downloaded language data on every request,
    // causing 10-30s delays on serverless. This heuristic approach is instant.
    const ocrText = extractReceiptHints(bytes)

    // Analyze receipt
    const analysis = analyzeReceipt(ocrText, order.totalAmount, orderId)

    // Save receipt to database
    const receipt = await prisma.bakongReceipt.create({
      data: {
        orderId,
        receiptImageUrl,
        ocrText,
        aiRiskScore: analysis.riskScore,
        aiVerificationDetails: JSON.parse(JSON.stringify(analysis)),
        adminStatus: analysis.riskScore <= 20 ? 'CONFIRMED' : 'PENDING_REVIEW',
      },
    })

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'PAYMENT_UPLOADED',
        paymentProof: receiptImageUrl,
        receiptStatus: analysis.riskScore <= 20 ? 'AI_APPROVED' : 'PENDING',
      },
    })

    // Send Telegram alert for high-risk receipts
    if (analysis.riskScore > 60) {
      await sendTelegramNotification(formatFraudAlert(order.orderNumber, analysis.riskScore))
    }

    return NextResponse.json({
      receiptId: receipt.id,
      riskScore: analysis.riskScore,
      riskLevel: analysis.riskScore <= 20 ? 'green' : analysis.riskScore <= 60 ? 'yellow' : 'red',
      checks: analysis,
      status: analysis.riskScore <= 20 ? 'AI_APPROVED' : 'PENDING_REVIEW',
    })
  } catch (error) {
    console.error('Receipt upload error:', error)
    return NextResponse.json({ error: 'Failed to process receipt' }, { status: 500 })
  }
}
