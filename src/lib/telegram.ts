const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID

export async function sendTelegramNotification(message: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_ADMIN_CHAT_ID) return false

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_ADMIN_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    )
    return res.ok
  } catch {
    return false
  }
}

export function formatNewOrderNotification(
  orderNumber: string,
  productName: string,
  amount: number,
  paymentMethod: string
): string {
  if (paymentMethod === 'STRIPE') {
    return `💳 Stripe payment confirmed - Order #${orderNumber} - $${amount.toFixed(2)} - ${productName}`
  }
  return `🆕 New Bakong order #${orderNumber} - ${productName} - $${amount.toFixed(2)}`
}

export function formatFraudAlert(
  orderNumber: string,
  riskScore: number
): string {
  return `🚨 SUSPICIOUS RECEIPT - Order #${orderNumber} - AI Score: ${riskScore}/100 (RED) - Review immediately`
}

export function formatLowStockAlert(productName: string, remaining: number): string {
  return `⚠️ ${productName}: Only ${remaining} card keys remaining!`
}
