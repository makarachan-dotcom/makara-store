import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomBytes, createHash } from 'crypto'
import { sendResetCode } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'សូមបំពេញអ៊ីមែល។' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    // Check if user exists and has a password (registered via credentials)
    if (!user) {
      return NextResponse.json({ error: 'អ៊ីមែលនេះមិនទាន់បានចុះឈ្មោះនៅក្នុងប្រព័ន្ធទេ។' }, { status: 404 })
    }

    if (!user.password) {
      return NextResponse.json({ error: 'គណនីនេះចូលប្រើតាម Google។ សូមចូលដោយប្រើ Google។' }, { status: 400 })
    }

    // Generate a 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const codeHash = createHash('sha256').update(code).digest('hex')
    const expires = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    // Generate a random token for the reset session
    const resetToken = randomBytes(32).toString('hex')

    // Store the verification token
    // Delete any existing tokens for this email first
    await prisma.verificationToken.deleteMany({
      where: { identifier: `reset:${email}` },
    })

    await prisma.verificationToken.create({
      data: {
        identifier: `reset:${email}`,
        token: `${codeHash}:${resetToken}`,
        expires,
      },
    })

    // Send the code via email
    try {
      await sendResetCode(email, code)
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError)
      return NextResponse.json({ error: 'មិនអាចផ្ញើអ៊ីមែលបានទេ។ សូមព្យាយាមម្តងទៀតពេលក្រោយ។' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'មានកំហុស។ សូមព្យាយាមម្តងទៀត។' }, { status: 500 })
  }
}
