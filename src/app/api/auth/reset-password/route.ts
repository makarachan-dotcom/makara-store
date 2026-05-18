import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, token, newPassword } = await request.json()

    if (!email || !token || !newPassword) {
      return NextResponse.json({ error: 'ទិន្នន័យមិនពេញលេញ។' }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ 8 តួអក្សរ។' }, { status: 400 })
    }

    // Verify the reset token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: `reset:${email}`,
        expires: { gte: new Date() },
      },
    })

    if (!verificationToken) {
      return NextResponse.json({ error: 'សម័យកំណត់ពាក្យសម្ងាត់ផុតកំណត់។ សូមព្យាយាមម្តងទៀត។' }, { status: 400 })
    }

    const [, storedToken] = verificationToken.token.split(':')

    if (storedToken !== token) {
      return NextResponse.json({ error: 'Token មិនត្រឹមត្រូវ។' }, { status: 400 })
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update the user's password
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    })

    // Delete the used verification token
    await prisma.verificationToken.deleteMany({
      where: { identifier: `reset:${email}` },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'មានកំហុស។ សូមព្យាយាមម្តងទៀត។' }, { status: 500 })
  }
}
