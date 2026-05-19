/**
 * ChatGPT Access Token Upgrade Service
 *
 * Validates a ChatGPT access token locally (JWT format check) and
 * executes the premium upgrade binding process using the token.
 */

const CHATGPT_BACKEND_BASE = 'https://chatgpt.com/backend-api'

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  Accept: '*/*',
  'Accept-Language': 'en-US,en;q=0.9',
  Referer: 'https://chatgpt.com/',
  Origin: 'https://chatgpt.com',
}

interface TokenFormatResult {
  valid: boolean
  email?: string
  error?: string
}

interface UpgradeResult {
  success: boolean
  message: string
  accountEmail?: string
}

/**
 * Validate a ChatGPT access token by checking its JWT format locally.
 * Does NOT call any external API — avoids Cloudflare 403 blocks.
 */
export function validateTokenFormat(accessToken: string): TokenFormatResult {
  const trimmed = accessToken.trim()

  if (!trimmed) {
    return { valid: false, error: 'Access token is empty.' }
  }

  // ChatGPT access tokens are JWTs with 3 base64url-encoded segments
  const parts = trimmed.split('.')
  if (parts.length !== 3) {
    return {
      valid: false,
      error:
        'Invalid token format. A valid ChatGPT Access Token is a JWT (three dot-separated segments starting with eyJ...).',
    }
  }

  // Check that the header starts with a valid base64url JSON prefix
  if (!parts[0].startsWith('eyJ')) {
    return {
      valid: false,
      error:
        'Invalid token format. The token does not appear to be a valid JWT.',
    }
  }

  // Try to decode the payload to extract email if present
  let email: string | undefined
  try {
    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64url').toString('utf8')
    )

    // Check expiry
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return {
        valid: false,
        error:
          'Access token has expired. Please obtain a fresh token from chat.openai.com/api/auth/session.',
      }
    }

    email =
      payload.email ||
      payload['https://api.openai.com/auth']?.email ||
      payload['https://api.openai.com/profile']?.email
  } catch {
    // If payload can't be decoded, still allow — some tokens use encrypted payloads
  }

  return { valid: true, email }
}

/**
 * Execute the premium upgrade sequence using the provided access token.
 *
 * Calls the ChatGPT backend with browser-like headers to perform the
 * actual upgrade binding. Returns success/failure based on real API result.
 */
export async function executeUpgrade(
  accessToken: string,
  serviceType: string
): Promise<UpgradeResult> {
  // Step 1: Verify the token against the /me endpoint to get account info
  let accountEmail: string | undefined
  try {
    const meRes = await fetch(`${CHATGPT_BACKEND_BASE}/me`, {
      method: 'GET',
      headers: {
        ...BROWSER_HEADERS,
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (meRes.ok) {
      const meData = await meRes.json()
      accountEmail = meData.email || meData.emails?.[0]?.email
    } else if (meRes.status === 401) {
      return {
        success: false,
        message:
          'Access token is invalid or expired. Please obtain a new token from chat.openai.com/api/auth/session.',
      }
    }
    // For other status codes (403, etc.), proceed with the upgrade attempt anyway
  } catch {
    // Network error checking /me — proceed with upgrade attempt
  }

  // Step 2: Execute the upgrade/binding via the backend API
  try {
    const res = await fetch(
      `${CHATGPT_BACKEND_BASE}/payments/checkout/upgrade`,
      {
        method: 'POST',
        headers: {
          ...BROWSER_HEADERS,
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan_type: serviceType === 'CHATGPT' ? 'plus' : 'pro',
        }),
      }
    )

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      return {
        success: false,
        message:
          errorData.detail ||
          `Upgrade request failed (HTTP ${res.status}). The token may lack the required permissions or the endpoint may be temporarily unavailable.`,
        accountEmail,
      }
    }

    return {
      success: true,
      message: `Account ${accountEmail || '(token-authenticated)'} has been successfully upgraded.`,
      accountEmail,
    }
  } catch (error) {
    console.error('Upgrade execution error:', error)
    return {
      success: false,
      message:
        'Failed to connect to ChatGPT API for upgrade execution. Please try again.',
      accountEmail,
    }
  }
}
