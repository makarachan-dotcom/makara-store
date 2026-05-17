// API Route: ការបញ្ជាទិញ
import { NextRequest, NextResponse } from 'next/server'

interface OrderItem {
  productId: string
  quantity: number
  price: number
}

interface Order {
  id: string
  userId: string
  items: OrderItem[]
  totalAmount: number
  bank: string
  status: string
  receiptStatus: string
  createdAt: string
}

// គំរូទិន្នន័យ (ក្នុង production ប្រើ Prisma)
const orders: Order[] = []

export async function GET() {
  return NextResponse.json({ orders })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, bank, userId } = body as {
      items: OrderItem[]
      bank: string
      userId: string
    }

    if (!items || !bank || !userId) {
      return NextResponse.json(
        { error: 'សូមបំពេញព័ត៌មានទាំងអស់។ Please fill all required fields.' },
        { status: 400 }
      )
    }

    const validBanks = ['ABA', 'ACLEDA', 'WING']
    if (!validBanks.includes(bank.toUpperCase())) {
      return NextResponse.json(
        { error: 'ធនាគារមិនត្រឹមត្រូវ។ Invalid bank selection.' },
        { status: 400 }
      )
    }

    const totalAmount = items.reduce(
      (sum: number, item: OrderItem) => sum + item.price * item.quantity,
      0
    )

    const order: Order = {
      id: 'ORD-' + Date.now(),
      userId,
      items,
      totalAmount,
      bank: bank.toUpperCase(),
      status: 'PENDING',
      receiptStatus: 'PENDING',
      createdAt: new Date().toISOString(),
    }

    orders.push(order)

    return NextResponse.json({ order }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'កំហុសក្នុងការបង្កើតការបញ្ជាទិញ។ Error creating order.' },
      { status: 500 }
    )
  }
}
