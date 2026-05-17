// API Route: ការកំណត់គេហទំព័រ - Maintenance Mode, KHQR, Banners
import { NextRequest, NextResponse } from 'next/server'

// គំរូ state (ក្នុង production ប្រើ database)
const siteSettings = {
  maintenanceMode: false,
  telegramUrl: 'https://t.me/AF4STURF',
  instructionVideoUrl: '',
  heroBanners: [] as string[],
  khqrImages: {
    ABA: '',
    ACLEDA: '',
    WING: '',
  },
}

export async function GET() {
  return NextResponse.json({ settings: siteSettings })
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.maintenanceMode !== undefined) {
      siteSettings.maintenanceMode = body.maintenanceMode
    }
    if (body.telegramUrl) {
      siteSettings.telegramUrl = body.telegramUrl
    }
    if (body.instructionVideoUrl !== undefined) {
      siteSettings.instructionVideoUrl = body.instructionVideoUrl
    }
    if (body.heroBanners) {
      siteSettings.heroBanners = body.heroBanners
    }
    if (body.khqrImages) {
      siteSettings.khqrImages = { ...siteSettings.khqrImages, ...body.khqrImages }
    }

    return NextResponse.json({ settings: siteSettings })
  } catch {
    return NextResponse.json(
      { error: 'កំហុសក្នុងការកែប្រែការកំណត់។ Error updating settings.' },
      { status: 500 }
    )
  }
}
