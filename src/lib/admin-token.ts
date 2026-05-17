import { createHmac } from 'crypto'

const COOKIE_NAME = 'admin-verified'
const TOKEN_TTL = 60 * 60 * 24 // 24 hours

function getSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) throw new Error('NEXTAUTH_SECRET is not set')
  return secret
}

function hmac(data: string): string {
  return createHmac('sha256', getSecret()).update(data).digest('hex')
}

export function createAdminToken(email: string): string {
  const expires = Math.floor(Date.now() / 1000) + TOKEN_TTL
  const payload = `${email}:${expires}`
  const signature = hmac(payload)
  return `${payload}:${signature}`
}

export function verifyAdminToken(token: string, email: string): boolean {
  const parts = token.split(':')
  if (parts.length !== 3) return false

  const [tokenEmail, expiresStr, signature] = parts
  if (tokenEmail !== email) return false

  const expires = parseInt(expiresStr, 10)
  if (isNaN(expires) || expires < Math.floor(Date.now() / 1000)) return false

  const expectedSignature = hmac(`${tokenEmail}:${expiresStr}`)
  return signature === expectedSignature
}

export { COOKIE_NAME, TOKEN_TTL }
