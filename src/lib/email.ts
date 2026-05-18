import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const STORE_NAME = 'Makara Store'
const STORE_LOCATION = process.env.STORE_LOCATION || 'Phnom Penh, Cambodia'
const STORE_PHONE = process.env.STORE_PHONE || '+855 XX XXX XXXX'
const STORE_EMAIL = process.env.SMTP_FROM || process.env.SMTP_USER || 'support@makarastore.com'

interface EmailOptions {
  to: string
  subject: string
  preheader?: string
  heading: string
  body: string
  ctaText?: string
  ctaUrl?: string
  footerNote?: string
}

function buildEmailTemplate(options: EmailOptions): string {
  const { subject, preheader, heading, body, ctaText, ctaUrl, footerNote } = options
  void subject

  const ctaBlock = ctaText && ctaUrl ? `
    <tr>
      <td align="center" style="padding: 32px 0 8px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="border-radius: 8px; background: linear-gradient(135deg, #00E5FF 0%, #0091EA 100%);">
              <a href="${ctaUrl}" target="_blank" style="display: inline-block; padding: 14px 40px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 700; color: #ffffff; text-decoration: none; letter-spacing: 0.3px;">
                ${ctaText}
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>` : ''

  return `<!DOCTYPE html>
<html lang="km" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>${STORE_NAME}</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .fluid { max-width: 100% !important; height: auto !important; }
      .stack-column { display: block !important; width: 100% !important; }
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f0f2f5; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  ${preheader ? `<div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;">${preheader}</div>` : ''}

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f0f2f5;">
    <tr>
      <td align="center" style="padding: 40px 16px;">

        <!-- Email Container -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" class="email-container" style="max-width: 560px; width: 100%;">

          <!-- Logo Header -->
          <tr>
            <td align="center" style="padding: 0 0 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background: #0B0F19; border-radius: 12px 12px 0 0; padding: 28px 40px;" align="center">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-right: 12px;" valign="middle">
                          <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #00E5FF 0%, #0091EA 100%); text-align: center; line-height: 36px; font-size: 18px; font-weight: bold; color: #0B0F19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">M</div>
                        </td>
                        <td valign="middle">
                          <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 20px; font-weight: 800; letter-spacing: 2px;">
                            <span style="color: #00E5FF;">MAKARA</span>
                            <span style="color: #FFD54F;"> STORE</span>
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background: #ffffff; border-radius: 0 0 12px 12px; box-shadow: 0 2px 16px rgba(0,0,0,0.06);">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">

                <!-- Accent Bar -->
                <tr>
                  <td style="height: 3px; background: linear-gradient(90deg, #00E5FF 0%, #0091EA 40%, #FFD54F 100%); font-size: 0; line-height: 0;">&nbsp;</td>
                </tr>

                <!-- Heading -->
                <tr>
                  <td class="mobile-padding" style="padding: 36px 40px 0;">
                    <h1 style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 22px; font-weight: 700; color: #1a1a2e; line-height: 1.35;">
                      ${heading}
                    </h1>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td class="mobile-padding" style="padding: 20px 40px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.7; color: #4a4a5a;">
                    ${body}
                  </td>
                </tr>

                <!-- CTA -->
                ${ctaBlock}

                <!-- Footer Note -->
                ${footerNote ? `
                <tr>
                  <td class="mobile-padding" style="padding: 28px 40px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: #9e9e9e; line-height: 1.6;">
                    ${footerNote}
                  </td>
                </tr>` : ''}

                <!-- Spacer -->
                <tr><td style="height: 36px;"></td></tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 28px 16px 0;" align="center">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <!-- Divider -->
                <tr>
                  <td style="height: 1px; background: #e0e0e0; font-size: 0; line-height: 0;">&nbsp;</td>
                </tr>
                <!-- Contact Info -->
                <tr>
                  <td style="padding: 20px 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; text-align: center;">
                    <p style="margin: 0 0 4px; font-size: 13px; font-weight: 600; color: #1a1a2e;">${STORE_NAME}</p>
                    <p style="margin: 0 0 2px; font-size: 12px; color: #9e9e9e;">${STORE_LOCATION}</p>
                    <p style="margin: 0 0 2px; font-size: 12px; color: #9e9e9e;">${STORE_PHONE}</p>
                    <p style="margin: 0; font-size: 12px; color: #9e9e9e;">${STORE_EMAIL}</p>
                  </td>
                </tr>
                <!-- Copyright -->
                <tr>
                  <td style="padding: 16px 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; color: #bdbdbd; text-align: center;">
                    &copy; ${new Date().getFullYear()} ${STORE_NAME}. All rights reserved.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function sendResetCode(to: string, code: string) {
  const html = buildEmailTemplate({
    to,
    subject: `${STORE_NAME} - លេខកូដកំណត់ពាក្យសម្ងាត់ឡើងវិញ`,
    preheader: `Your password reset code is ${code}`,
    heading: 'កំណត់ពាក្យសម្ងាត់ឡើងវិញ',
    body: `
      <p style="margin: 0 0 16px;">អ្នកបានស្នើកំណត់ពាក្យសម្ងាត់ឡើងវិញ។ សូមប្រើលេខកូដខាងក្រោម៖</p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td align="center" style="padding: 16px 0;">
            <div style="display: inline-block; padding: 16px 32px; background: #f5f5fa; border: 2px dashed #00E5FF; border-radius: 10px;">
              <span style="font-family: 'SF Mono', 'Fira Code', monospace, sans-serif; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #0091EA;">${code}</span>
            </div>
          </td>
        </tr>
      </table>
      <p style="margin: 16px 0 0; text-align: center; font-size: 13px; color: #9e9e9e;">លេខកូដនេះមានសុពលភាព 15 នាទី។</p>
    `,
    footerNote: 'ប្រសិនបើអ្នកមិនបានស្នើកំណត់ពាក្យសម្ងាត់ឡើងវិញ សូមមិនអើពើនឹងអ៊ីមែលនេះ។',
  })

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: `${STORE_NAME} - លេខកូដកំណត់ពាក្យសម្ងាត់ឡើងវិញ`,
    html,
  })
}

export async function sendOrderConfirmation(to: string, orderData: {
  orderNumber: string
  totalAmount: number
  currency: string
  items: Array<{ name: string; quantity: number; price: number }>
  paymentMethod: string
}) {
  const itemRows = orderData.items.map((item) =>
    `<tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #4a4a5a;">${item.name}</td>
      <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #4a4a5a; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; font-weight: 600; color: #1a1a2e; text-align: right;">$${item.price.toFixed(2)}</td>
    </tr>`
  ).join('')

  const html = buildEmailTemplate({
    to,
    subject: `${STORE_NAME} - Order #${orderData.orderNumber} Confirmed`,
    preheader: `Your order #${orderData.orderNumber} has been confirmed`,
    heading: `Order #${orderData.orderNumber}`,
    body: `
      <p style="margin: 0 0 20px;">សូមអរគុណសម្រាប់ការបញ្ជាទិញ! ខាងក្រោមនេះជាព័ត៌មានលម្អិតនៃការបញ្ជាទិញរបស់អ្នក៖</p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 20px;">
        <tr style="background: #f8f9fa;">
          <td style="padding: 10px 12px; font-size: 12px; font-weight: 700; color: #6b6b7b; text-transform: uppercase; letter-spacing: 0.5px;">Item</td>
          <td style="padding: 10px 12px; font-size: 12px; font-weight: 700; color: #6b6b7b; text-transform: uppercase; letter-spacing: 0.5px; text-align: center;">Qty</td>
          <td style="padding: 10px 12px; font-size: 12px; font-weight: 700; color: #6b6b7b; text-transform: uppercase; letter-spacing: 0.5px; text-align: right;">Price</td>
        </tr>
        ${itemRows}
        <tr>
          <td colspan="2" style="padding: 14px 12px 0; font-size: 15px; font-weight: 700; color: #1a1a2e;">Total</td>
          <td style="padding: 14px 12px 0; font-size: 18px; font-weight: 800; color: #0091EA; text-align: right;">$${orderData.totalAmount.toFixed(2)}</td>
        </tr>
      </table>
      <div style="background: #f8f9fa; border-radius: 8px; padding: 14px 16px; font-size: 13px; color: #6b6b7b;">
        <strong style="color: #1a1a2e;">Payment:</strong> ${orderData.paymentMethod}
      </div>
    `,
    footerNote: 'If you have any questions about your order, please contact our support team.',
  })

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: `${STORE_NAME} - Order #${orderData.orderNumber} Confirmed`,
    html,
  })
}

export async function sendWelcomeEmail(to: string, userName: string) {
  const html = buildEmailTemplate({
    to,
    subject: `Welcome to ${STORE_NAME}!`,
    preheader: `Welcome to ${STORE_NAME}, ${userName}!`,
    heading: `Welcome, ${userName}!`,
    body: `
      <p style="margin: 0 0 16px;">សូមស្វាគមន៍មក ${STORE_NAME}! គណនីរបស់អ្នកត្រូវបានបង្កើតដោយជោគជ័យ។</p>
      <p style="margin: 0 0 16px;">អ្នកអាចចាប់ផ្តើមរុករកផលិតផលឌីជីថលគុណភាពខ្ពស់របស់យើងបានភ្លាមៗ។</p>
    `,
    ctaText: 'Browse Products',
    ctaUrl: process.env.NEXTAUTH_URL || 'https://makarastore.com',
  })

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: `Welcome to ${STORE_NAME}!`,
    html,
  })
}

export { buildEmailTemplate }
