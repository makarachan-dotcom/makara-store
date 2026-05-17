// API Route: ការជូនដំណឹង - ភាសាពីរ (ខ្មែរ/English)
import { NextRequest, NextResponse } from 'next/server'

interface Announcement {
  id: string
  titleKm: string
  titleEn: string
  contentKm: string
  contentEn: string
  type: 'INFO' | 'WARNING' | 'PROMOTION' | 'URGENT'
  active: boolean
  createdAt: string
}

// គំរូទិន្នន័យ
const announcements: Announcement[] = [
  {
    id: '1',
    titleKm: 'ការផ្សព្វផ្សាយពិសេស!',
    titleEn: 'Special Promotion!',
    contentKm: 'ទទួលបានការបញ្ចុះតម្លៃ 20% លើផលិតផលទាំងអស់!',
    contentEn: 'Get 20% off on all products!',
    type: 'PROMOTION',
    active: true,
    createdAt: new Date().toISOString(),
  },
]

export async function GET() {
  const active = announcements.filter((a) => a.active)
  return NextResponse.json({ announcements: active })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { titleKm, titleEn, contentKm, contentEn, type } = body

    if (!titleKm || !titleEn) {
      return NextResponse.json(
        { error: 'សូមបំពេញចំណងជើងទាំងពីរភាសា។ Please fill titles in both languages.' },
        { status: 400 }
      )
    }

    const announcement: Announcement = {
      id: String(Date.now()),
      titleKm,
      titleEn,
      contentKm: contentKm || '',
      contentEn: contentEn || '',
      type: type || 'INFO',
      active: true,
      createdAt: new Date().toISOString(),
    }

    announcements.push(announcement)

    return NextResponse.json({ announcement }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'កំហុសក្នុងការបង្កើតការជូនដំណឹង។ Error creating announcement.' },
      { status: 500 }
    )
  }
}
