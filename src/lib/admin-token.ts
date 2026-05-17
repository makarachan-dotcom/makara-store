const COOKIE_NAME = 'admin-verified'
const TOKEN_TTL = 60 * 60 * 24 // 24 hours

function getSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) throw new Error('NEXTAUTH_SECRET is not set')
  return secret
}

function hexEncode(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function hmac(data: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
  return hexEncode(signature)
}

export async function createAdminToken(email: string): Promise<string> {
  const expires = Math.floor(Date.now() / 1000) + TOKEN_TTL
  const payload = `${email}:${expires}`
  const signature = await hmac(payload)
  return `${payload}:${signature}`
}

export async function verifyAdminToken(token: string, email: string): Promise<boolean> {
  const parts = token.split(':')
  if (parts.length !== 3) return false

  const [tokenEmail, expiresStr, signature] = parts
  if (tokenEmail !== email) return false

  const expires = parseInt(expiresStr, 10)
  if (isNaN(expires) || expires < Math.floor(Date.now() / 1000)) return false

  const expectedSignature = await hmac(`${tokenEmail}:${expiresStr}`)
  return signature === expectedSignature
}

export { COOKIE_NAME, TOKEN_TTL }
