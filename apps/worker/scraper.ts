// ស្គ្រីបស្វ័យប្រវត្តិសម្រាប់ scrape ផលិតផលពី vipplus.pro
// ដំណើរការជា cron job ដើម្បីធ្វើសមកាលកម្មទិន្នន័យផលិតផល
import puppeteer from 'puppeteer'

// ប្រភេទទិន្នន័យផលិតផលដែលបាន scrape
interface ScrapedProduct {
  externalId: string
  nameEn: string
  nameKm: string
  price: number
  originalPrice: number
  image: string
  category: string
  stock: 'IN_STOCK' | 'OUT_OF_STOCK' | 'LOW_STOCK'
  sourceUrl: string
}

// URL គោលដៅសម្រាប់ scraping
const TARGET_URL = 'https://vipplus.pro/'

// ចន្លោះពេល cron (រាល់ 30 នាទី)
const SCRAPE_INTERVAL_MS = 30 * 60 * 1000

// Upsert ផលិតផលទៅ database (ក្នុង production ប្រើ Prisma)
async function upsertProduct(product: ScrapedProduct): Promise<void> {
  // ក្នុង production: ប្រើ Prisma client ដើម្បី upsert
  // await prisma.product.upsert({
  //   where: { externalId: product.externalId },
  //   update: {
  //     nameEn: product.nameEn,
  //     price: product.price,
  //     originalPrice: product.originalPrice,
  //     image: product.image,
  //     stock: product.stock,
  //     lastSyncedAt: new Date(),
  //   },
  //   create: {
  //     externalId: product.externalId,
  //     nameKm: product.nameKm,
  //     nameEn: product.nameEn,
  //     price: product.price,
  //     originalPrice: product.originalPrice,
  //     image: product.image,
  //     category: product.category,
  //     stock: product.stock,
  //     sourceUrl: product.sourceUrl,
  //     active: true,
  //     lastSyncedAt: new Date(),
  //   },
  // })
  console.log(`[UPSERT] ${product.nameEn} - $${product.price} (${product.stock})`)
}

// ស្រង់ផលិតផលពីទំព័រ
async function scrapeProducts(): Promise<ScrapedProduct[]> {
  console.log('[SCRAPER] កំពុងចាប់ផ្តើម scraping ពី', TARGET_URL)

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  })

  const products: ScrapedProduct[] = []

  try {
    const page = await browser.newPage()

    // កំណត់ user agent ដើម្បីជៀសវាងការរារាំង
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    )

    await page.goto(TARGET_URL, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    })

    // រង់ចាំឱ្យមាតិកាផ្ទុកពេញលេញ
    await page.waitForSelector('body', { timeout: 10000 })

    // ស្រង់បញ្ជីផលិតផល
    const scrapedData = await page.evaluate(() => {
      const items: Array<{
        name: string
        price: string
        originalPrice: string
        image: string
        link: string
        stock: string
      }> = []

      // Selector ទូទៅសម្រាប់ product cards
      const productCards = document.querySelectorAll(
        '.product-card, .product-item, [class*="product"], .card'
      )

      productCards.forEach((card, index) => {
        const nameEl = card.querySelector(
          'h2, h3, h4, .product-name, .product-title, [class*="title"], [class*="name"]'
        )
        const priceEl = card.querySelector(
          '.price, .product-price, [class*="price"], .amount'
        )
        const originalPriceEl = card.querySelector(
          '.original-price, .old-price, [class*="original"], del, s'
        )
        const imageEl = card.querySelector('img')
        const linkEl = card.querySelector('a')
        const stockEl = card.querySelector(
          '.stock, .availability, [class*="stock"]'
        )

        if (nameEl) {
          items.push({
            name: nameEl.textContent?.trim() || `Product ${index + 1}`,
            price: priceEl?.textContent?.trim() || '0',
            originalPrice: originalPriceEl?.textContent?.trim() || '0',
            image: imageEl?.getAttribute('src') || '',
            link: linkEl?.getAttribute('href') || '',
            stock: stockEl?.textContent?.trim() || 'available',
          })
        }
      })

      return items
    })

    // បម្លែងទិន្នន័យ scraped ទៅជា ScrapedProduct
    for (const item of scrapedData) {
      const price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0
      const originalPrice =
        parseFloat(item.originalPrice.replace(/[^0-9.]/g, '')) || price

      const stockText = item.stock.toLowerCase()
      let stock: ScrapedProduct['stock'] = 'IN_STOCK'
      if (
        stockText.includes('out') ||
        stockText.includes('sold') ||
        stockText.includes('unavailable')
      ) {
        stock = 'OUT_OF_STOCK'
      } else if (stockText.includes('low') || stockText.includes('limited')) {
        stock = 'LOW_STOCK'
      }

      products.push({
        externalId: `vipplus-${Buffer.from(item.name).toString('base64').slice(0, 20)}`,
        nameEn: item.name,
        nameKm: item.name, // ត្រូវការបកប្រែដោយដៃ
        price,
        originalPrice,
        image: item.image.startsWith('http')
          ? item.image
          : `${TARGET_URL}${item.image}`,
        category: 'imported',
        stock,
        sourceUrl: item.link.startsWith('http')
          ? item.link
          : `${TARGET_URL}${item.link}`,
      })
    }

    console.log(`[SCRAPER] រកឃើញ ${products.length} ផលិតផល`)
  } catch (error) {
    console.error('[SCRAPER] កំហុសក្នុងការ scrape:', error)
  } finally {
    await browser.close()
  }

  return products
}

// ដំណើរការសមកាលកម្មទិន្នន័យ
async function syncProducts(): Promise<void> {
  console.log('[SYNC] ចាប់ផ្តើមសមកាលកម្ម:', new Date().toISOString())

  try {
    const products = await scrapeProducts()

    if (products.length === 0) {
      console.log('[SYNC] គ្មានផលិតផលត្រូវបានរកឃើញ - រំលង upsert')
      return
    }

    // Upsert រាល់ផលិតផល
    for (const product of products) {
      await upsertProduct(product)
    }

    console.log(`[SYNC] បានសមកាលកម្ម ${products.length} ផលិតផលដោយជោគជ័យ`)
  } catch (error) {
    console.error('[SYNC] កំហុសក្នុងសមកាលកម្ម:', error)
  }
}

// ដំណើរការ cron loop
async function startCronJob(): Promise<void> {
  console.log('[CRON] Worker ចាប់ផ្តើម - ចន្លោះពេល:', SCRAPE_INTERVAL_MS / 1000, 'វិនាទី')

  // ដំណើរការភ្លាមៗពេលចាប់ផ្តើម
  await syncProducts()

  // បន្ទាប់មកដំណើរការតាមកាលកំណត់
  setInterval(async () => {
    await syncProducts()
  }, SCRAPE_INTERVAL_MS)
}

// ចាប់ផ្តើម worker
startCronJob().catch(console.error)
