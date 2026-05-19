declare module 'bakong-khqr' {
  interface KHQRStatus {
    code: number
    errorCode: number | null
    message: string | null
  }

  interface KHQRResult {
    status: KHQRStatus
    data: { qr: string; md5: string } | null
  }

  interface CRCValidation {
    isValid: boolean
  }

  export class BakongKHQR {
    generateMerchant(merchantInfo: MerchantInfo): KHQRResult
    generateIndividual(individualInfo: IndividualInfo): KHQRResult
    static decode(khqrString: string): KHQRResult
    static verify(khqrString: string): CRCValidation
  }

  interface MerchantOptional {
    currency?: number
    amount?: number
    billNumber?: string
    storeLabel?: string
    terminalLabel?: string
    purposeOfTransaction?: string
    mobileNumber?: string
    languagePreference?: string
    merchantNameAlternateLanguage?: string
    merchantCityAlternateLanguage?: string
    expirationTimestamp?: string
    merchantCategoryCode?: string
    accountInformation?: string
    upiMerchantAccount?: string
  }

  export class IndividualInfo {
    constructor(
      bakongAccountID: string,
      merchantName: string,
      merchantCity: string,
      optional?: MerchantOptional
    )
  }

  export class MerchantInfo extends IndividualInfo {
    constructor(
      bakongAccountID: string,
      merchantName: string,
      merchantCity: string,
      merchantID: string,
      acquiringBank: string,
      optional?: MerchantOptional
    )
  }

  export const khqrData: {
    currency: { usd: number; khr: number }
    merchantType: { individual: string; merchant: string }
  }
}
