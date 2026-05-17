// API Route: ផលិតផល CRUD
import { NextRequest, NextResponse } from 'next/server'

// គំរូទិន្នន័យផលិតផល (ក្នុង production ប្រើ Prisma)
const products = [
  {
    id: '1',
    nameKm: 'ChatGPT Plus - ១ ខែ',
    nameEn: 'ChatGPT Plus - 1 Month',
    descriptionKm: 'គណនី ChatGPT Plus រយៈពេល ១ ខែ',
    descriptionEn: 'ChatGPT Plus subscription for 1 month',
    price: 9.99,
    originalPrice: 19.99,
    image: '/images/products/chatgpt-plus.png',
    category: 'chatgpt',
    stock: 'IN_STOCK' as const,
    featured: true,
    active: true,
  },
  {
    id: '2',
    nameKm: 'ChatGPT Plus - ៣ ខែ',
    nameEn: 'ChatGPT Plus - 3 Months',
    descriptionKm: 'គណនី ChatGPT Plus រយៈពេល ៣ ខែ',
    descriptionEn: 'ChatGPT Plus subscription for 3 months',
    price: 24.99,
    originalPrice: 59.97,
    image: '/images/products/chatgpt-plus-3m.png',
    category: 'chatgpt',
    stock: 'IN_STOCK' as const,
    featured: true,
    active: true,
  },
  {
    id: '3',
    nameKm: 'Netflix Premium - ១ ខែ',
    nameEn: 'Netflix Premium - 1 Month',
    descriptionKm: 'គណនី Netflix Premium រយៈពេល ១ ខែ',
    descriptionEn: 'Netflix Premium for 1 month',
    price: 5.99,
    originalPrice: 15.99,
    image: '/images/products/netflix.png',
    category: 'streaming',
    stock: 'IN_STOCK' as const,
    featured: false,
    active: true,
  },
  {
    id: '4',
    nameKm: 'Spotify Premium - ១ ខែ',
    nameEn: 'Spotify Premium - 1 Month',
    descriptionKm: 'គណនី Spotify Premium រយៈពេល ១ ខែ',
    descriptionEn: 'Spotify Premium for 1 month',
    price: 3.99,
    originalPrice: 9.99,
    image: '/images/products/spotify.png',
    category: 'streaming',
    stock: 'LOW_STOCK' as const,
    featured: false,
    active: true,
  },
  {
    id: '5',
    nameKm: 'Canva Pro - ១ ឆ្នាំ',
    nameEn: 'Canva Pro - 1 Year',
    descriptionKm: 'គណនី Canva Pro រយៈពេល ១ ឆ្នាំ',
    descriptionEn: 'Canva Pro for 1 year',
    price: 6.99,
    originalPrice: 12.99,
    image: '/images/products/canva.png',
    category: 'design',
    stock: 'IN_STOCK' as const,
    featured: true,
    active: true,
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')
  const search = searchParams.get('search')

  let filtered = products.filter((p) => p.active)

  if (category) {
    filtered = filtered.filter((p) => p.category === category)
  }

  if (featured === 'true') {
    filtered = filtered.filter((p) => p.featured)
  }

  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.nameKm.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q)
    )
  }

  return NextResponse.json({ products: filtered })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newProduct = {
      id: String(Date.now()),
      ...body,
      active: true,
    }
    return NextResponse.json({ product: newProduct }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
