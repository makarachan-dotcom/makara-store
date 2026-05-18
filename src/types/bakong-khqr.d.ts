declare module 'bakong-khqr' {
  export class BakongKHQR {
    static generateMerchant(merchantInfo: MerchantInfo): {
      data: { qr: string; md5: string }
    }
    static verify(md5: string, token: string): Promise<{
      data: {
        status: string
        transactionHash?: string
        amount?: number
        paidAt?: string
        senderAccount?: string
      }
    }>
  }

  export class MerchantInfo {
    constructor(
      accountId: string,
      merchantName: string,
      merchantCity: string,
      amount: number,
      currency: string,
      description: string
    )
  }

  export const khqrData: {
    currency: { usd: string; khr: string }
    TAG_TRANSACTION_CURRENCY: string
    TAG_TRANSACTION_AMOUNT: string
  }
}
