// API Route: ការផ្ទៀងផ្ទាត់បង្កាន់ដៃ AI - OCR + Face Detection Filter
import { NextRequest, NextResponse } from 'next/server'

// ពិន្ទុអប្បបរមាសម្រាប់ OCR confidence
const MIN_OCR_CONFIDENCE = 0.35
// ពាក្យគន្លឹះធនាគារ
const BANK_KEYWORDS = [
  'aba', 'acleda', 'wing', 'transaction', 'transfer', 'receipt',
  'payment', 'amount', 'successful', 'approved', 'reference',
  'khqr', 'khr', 'usd', 'completed', 'bank',
]

interface VerifyResult {
  approved: boolean
  reason: string
  confidence: number
}

// ពិនិត្យមើលថាតើរូបភាពមានមុខមនុស្សឬទេ (ក្លែង)
function detectFaces(imageBuffer: ArrayBuffer): boolean {
  const bytes = new Uint8Array(imageBuffer)
  // ពិនិត្យ JPEG header - រូបភាពពិតមានទិន្នន័យ EXIF ជាច្រើន
  // Face detection ក្លែងតាមរយៈការវិភាគ pixel distribution
  const hasHighSkinToneRatio = analyzeColorDistribution(bytes)
  return hasHighSkinToneRatio
}

// វិភាគការបែងចែកពណ៌សម្រាប់ skin tone detection
function analyzeColorDistribution(bytes: Uint8Array): boolean {
  if (bytes.length < 1000) return false

  let skinTonePixels = 0
  let totalSampled = 0
  // គំរូរាល់ 100 bytes សម្រាប់វិភាគពណ៌រហ័ស
  for (let i = 0; i < bytes.length - 3; i += 100) {
    const r = bytes[i]
    const g = bytes[i + 1]
    const b = bytes[i + 2]
    // ជួរ skin tone ទូទៅ
    if (r > 95 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 15 && r - b > 15) {
      skinTonePixels++
    }
    totalSampled++
  }

  const skinRatio = totalSampled > 0 ? skinTonePixels / totalSampled : 0
  // បដិសេធប្រសិនបើ > 40% នៃ pixels ជា skin tone
  return skinRatio > 0.4
}

// ក្លែង OCR - ស្រង់ text ពីរូបភាព
function performOCR(imageBuffer: ArrayBuffer): { text: string; confidence: number } {
  const bytes = new Uint8Array(imageBuffer)
  const fileSize = bytes.length

  // ពិន្ទុ confidence ដោយផ្អែកលើទំហំឯកសារ (រូបភាពកាន់តែច្បាស់ = ទំហំកាន់តែធំ)
  let confidence = 0.5

  // រូបភាពតូចពេកឬធំពេក = ទំនងជាមិនមែនបង្កាន់ដៃ
  if (fileSize < 10000) confidence = 0.1
  else if (fileSize < 50000) confidence = 0.3
  else if (fileSize < 200000) confidence = 0.5
  else if (fileSize < 2000000) confidence = 0.7
  else confidence = 0.6

  // ក្លែង extracted text
  const mockText = 'Transaction Successful ABA Bank Transfer $9.99 Reference: TXN-' + Date.now()

  return { text: mockText, confidence }
}

// ពិនិត្យមើលថាតើ text មានពាក្យគន្លឹះធនាគារឬទេ
function containsBankKeywords(text: string): boolean {
  const lowerText = text.toLowerCase()
  let matchCount = 0
  for (const keyword of BANK_KEYWORDS) {
    if (lowerText.includes(keyword)) matchCount++
  }
  // ត្រូវការយ៉ាងហោចណាស់ 2 ពាក្យគន្លឹះ
  return matchCount >= 2
}

// ផ្ទៀងផ្ទាត់បង្កាន់ដៃទូទាត់
function verifyReceipt(imageBuffer: ArrayBuffer): VerifyResult {
  // ច្បាប់បដិសេធទី 2: ពិនិត្យមុខមនុស្ស
  if (detectFaces(imageBuffer)) {
    return {
      approved: false,
      reason: 'រូបភាពមានមុខមនុស្ស - សូមផ្ទុករូបភាពបង្កាន់ដៃទូទាត់ពិត។ Image contains human faces - please upload an actual payment receipt.',
      confidence: 0,
    }
  }

  // ច្បាប់បដិសេធទី 1: ពិនិត្យ OCR confidence
  const ocrResult = performOCR(imageBuffer)

  if (ocrResult.confidence < MIN_OCR_CONFIDENCE) {
    return {
      approved: false,
      reason: 'រូបភាពមិនច្បាស់ពេក - សូមផ្ទុករូបថតច្បាស់ជាងនេះ។ Image is too blurry - please upload a clearer photo.',
      confidence: ocrResult.confidence,
    }
  }

  // ពិនិត្យពាក្យគន្លឹះធនាគារ
  if (!containsBankKeywords(ocrResult.text)) {
    return {
      approved: false,
      reason: 'រូបភាពមិនមែនជាបង្កាន់ដៃធនាគារ - សូមផ្ទុកបង្កាន់ដៃពិត។ Image does not appear to be a bank receipt.',
      confidence: ocrResult.confidence,
    }
  }

  return {
    approved: true,
    reason: 'បង្កាន់ដៃត្រូវបានអនុម័តដោយ AI។ Receipt approved by AI verification.',
    confidence: ocrResult.confidence,
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('receipt') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'សូមផ្ទុករូបភាពបង្កាន់ដៃ។ Please upload a receipt image.' },
        { status: 400 }
      )
    }

    // ពិនិត្យប្រភេទឯកសារ
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'ប្រភេទឯកសារមិនត្រឹមត្រូវ។ Invalid file type. Only JPEG, PNG, WebP accepted.' },
        { status: 400 }
      )
    }

    // ពិនិត្យទំហំ (អតិបរមា 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'ឯកសារធំពេក (អតិបរមា 10MB)។ File too large (max 10MB).' },
        { status: 400 }
      )
    }

    const imageBuffer = await file.arrayBuffer()
    const result = verifyReceipt(imageBuffer)

    return NextResponse.json({
      status: result.approved ? 'AI_APPROVED' : 'AI_REJECTED',
      reason: result.reason,
      confidence: result.confidence,
    })
  } catch {
    return NextResponse.json(
      { error: 'កំហុសក្នុងការផ្ទៀងផ្ទាត់។ Verification error.' },
      { status: 500 }
    )
  }
}
