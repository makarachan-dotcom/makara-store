import { NextRequest, NextResponse } from 'next/server'

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || ''
const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions'

const SYSTEM_PROMPT = `You are the AI assistant for Makara Store — a premium digital store specializing in gaming products, ChatGPT upgrades, digital cards, and more. You are helpful, friendly, and professional.

Key information:
- Store name: Makara Store
- We sell: Gaming products, ChatGPT Plus/Pro upgrades, VISA virtual cards, digital products
- Payment methods: ABA Bank, ACLEDA Bank, Wing Bank
- For urgent support, customers can contact Admin on Telegram: @AF4STURF
- Website: makarach4n.tokenized.name

Always be helpful and concise. If you don't know something specific about an order or product, direct the customer to contact Admin on Telegram @AF4STURF.
Respond in the same language the user writes in (Khmer or English).`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    if (!NVIDIA_API_KEY) {
      return NextResponse.json(
        { reply: getOfflineResponse(messages[messages.length - 1]?.content || '') },
        { status: 200 }
      )
    }

    const response = await fetch(NVIDIA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'meta/llama-4-maverick-17b-128e-instruct',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.slice(-10),
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('NVIDIA API error:', errorData)
      return NextResponse.json(
        { reply: getOfflineResponse(messages[messages.length - 1]?.content || '') },
        { status: 200 }
      )
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || getOfflineResponse('')

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { reply: 'Sorry, something went wrong. Please try again or contact Admin on Telegram: @AF4STURF' },
      { status: 200 }
    )
  }
}

function getOfflineResponse(message: string): string {
  const lower = message.toLowerCase()
  if (lower.includes('price') || lower.includes('\u178f\u1798\u17d2\u179b\u17c3')) {
    return 'For pricing information, please check each product page or contact Admin on Telegram: @AF4STURF'
  }
  if (lower.includes('payment') || lower.includes('\u1794\u1784\u17cb\u1794\u17d2\u179a\u17b6\u1780\u17cb') || lower.includes('pay')) {
    return 'We accept payments via ABA Bank, ACLEDA Bank, and Wing Bank. For help, contact @AF4STURF on Telegram.'
  }
  if (lower.includes('order') || lower.includes('\u1780\u17b6\u179a\u1794\u1789\u17d2\u1787\u17b6\u1791\u17b7\u1789')) {
    return 'For order status, please log in and check "Order History". Need help? Contact @AF4STURF on Telegram.'
  }
  return 'Thank you for your message! For the best assistance, please contact our Admin on Telegram: @AF4STURF'
}
