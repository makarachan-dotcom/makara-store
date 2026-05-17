// Product image mapping utility
// Maps product names/slugs to appropriate product images similar to vipplus.pro
// Falls back to Makara Store logo when no match is found

const PRODUCT_IMAGE_MAP: { keywords: string[]; image: string }[] = [
  {
    keywords: ['chatgpt', 'gpt', 'openai'],
    image: '/images/products/chatgpt.svg',
  },
  {
    keywords: ['claude', 'anthropic'],
    image: '/images/products/claude.svg',
  },
  {
    keywords: ['gemini', 'google ai', 'bard'],
    image: '/images/products/gemini.svg',
  },
  {
    keywords: ['grok', 'xai', 'x ai'],
    image: '/images/products/grok.svg',
  },
  {
    keywords: ['cursor'],
    image: '/images/products/cursor.svg',
  },
]

const FALLBACK_IMAGE = '/images/logo.jpg'

export function getProductImage(
  nameOrSlug: string,
  existingImage?: string | null
): string {
  if (
    existingImage &&
    existingImage !== FALLBACK_IMAGE &&
    existingImage !== '/images/logo.jpg'
  ) {
    return existingImage
  }

  const lower = nameOrSlug.toLowerCase()
  for (const entry of PRODUCT_IMAGE_MAP) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.image
    }
  }

  return FALLBACK_IMAGE
}
