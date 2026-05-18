import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createHash } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ error: 'សូមបំពេញអ៊ីមែល និងលេខកូដ។' }, { status: 400 })
    }

    const codeHash = createHash('sha256').update(code).digest('hex')

    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: `reset:${email}`,
        expires: { gte: new Date() },
      },
    })

    if (!verificationToken) {
      return NextResponse.json({ error: 'លេខកូដផុតកំណត់ ឬមិនត្រឹមត្រូវ។' }, { status: 400 })
    }

    const [storedHash, resetToken] = verificationToken.token.split(':')

    if (storedHash !== codeHash) {
      return NextResponse.json({ error: 'លេខកូដមិនត្រឹមត្រូវ។ សូមព្យាយាមម្តងទៀត។' }, { status: 400 })
    }

    return NextResponse.json({ success: true, token: resetToken })
  } catch (error) {
    console.error('Verify reset code error:', error)
    return NextResponse.json({ error: 'មានកំហុស។ សូមព្យាយាមម្តងទៀត។' }, { status: 500 })
  }
}
