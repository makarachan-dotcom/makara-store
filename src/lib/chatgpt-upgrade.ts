/**
 * ChatGPT Access Token Upgrade Service
 *
 * Validates a ChatGPT access token and executes the premium upgrade
 * binding process using the token against the ChatGPT API.
 */

const CHATGPT_API_BASE = 'https://chat.openai.com'
const CHATGPT_BACKEND_BASE = 'https://chatgpt.com/backend-api'

interface TokenValidationResult {
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
 * Validate a ChatGPT access token by checking the session endpoint.
 */
export async function validateAccessToken(
  accessToken: string
): Promise<TokenValidationResult> {
  try {
    const res = await fetch(`${CHATGPT_BACKEND_BASE}/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      return {
        valid: false,
        error:
          res.status === 401
            ? 'Access token is invalid or expired. Please obtain a new token.'
            : `Token validation failed (HTTP ${res.status})`,
      }
    }

    const data = await res.json()
    const email = data.email || data.emails?.[0]?.email

    return { valid: true, email }
  } catch (error) {
    console.error('Token validation error:', error)
    return {
      valid: false,
      error: 'Failed to connect to ChatGPT API for token validation.',
    }
  }
}

/**
 * Execute the premium upgrade sequence using the provided access token.
 *
 * This calls the ChatGPT backend to bind the upgrade/subscription
 * change to the account identified by the token.
 */
export async function executeUpgrade(
  accessToken: string,
  serviceType: string
): Promise<UpgradeResult> {
  // Step 1: Validate the token and retrieve the account info
  const validation = await validateAccessToken(accessToken)
  if (!validation.valid) {
    return {
      success: false,
      message: validation.error || 'Invalid access token',
    }
  }

  // Step 2: Execute the upgrade/binding via the backend API
  try {
    const res = await fetch(
      `${CHATGPT_BACKEND_BASE}/payments/checkout/upgrade`,
      {
        method: 'POST',
        headers: {
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
          `Upgrade request failed (HTTP ${res.status}). The token may lack the required permissions.`,
        accountEmail: validation.email,
      }
    }

    return {
      success: true,
      message: `Account ${validation.email || 'unknown'} has been successfully upgraded.`,
      accountEmail: validation.email,
    }
  } catch (error) {
    console.error('Upgrade execution error:', error)
    return {
      success: false,
      message:
        'Failed to connect to ChatGPT API for upgrade execution. Please try again.',
      accountEmail: validation.email,
    }
  }
}
