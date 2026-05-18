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

const STORE_NAME = 'MAKARA STORE'
const STORE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://makara-store.vercel.app'
const STORE_LOCATION = 'Phnom Penh, Cambodia'
const STORE_PHONE = '+855 12 345 678'

function emailLayout(content: string, preheader?: string): string {
  return `<!DOCTYPE html>
<html lang="km" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <title>${STORE_NAME}</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <style>table,td,div,p,a,span{font-family:Arial,Helvetica,sans-serif!important;}</style>
  <![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body, table, td { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    body { background-color: #f0f2f5; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; max-width: 100%; }
    a { text-decoration: none; }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .email-content { padding: 24px 16px !important; }
      .code-display { font-size: 28px !important; letter-spacing: 6px !important; padding: 14px 20px !important; }
      .footer-content { padding: 24px 16px !important; }
      .header-content { padding: 28px 16px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f0f2f5; width: 100%;">
  ${preheader ? `<div style="display:none;font-size:1px;color:#f0f2f5;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</div>` : ''}

  <!-- Outer wrapper -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f0f2f5;">
    <tr>
      <td align="center" style="padding: 32px 12px;">

        <!-- Email container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="520" class="email-container" style="max-width: 520px; width: 100%; margin: 0 auto;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0B0F19 0%, #141B2D 50%, #0B0F19 100%); border-radius: 16px 16px 0 0; text-align: center;" class="header-content">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 36px 32px 28px; text-align: center;">
                    <!-- Logo circle -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                      <tr>
                        <td style="width: 56px; height: 56px; border-radius: 50%; border: 2px solid rgba(0,240,255,0.3); text-align: center; vertical-align: middle; background-color: #1a1f2e;">
                          <a href="${STORE_URL}" style="display: inline-block;">
                            <img src="${STORE_URL}/images/logo.jpg" alt="${STORE_NAME}" width="48" height="48" style="width: 48px; height: 48px; border-radius: 50%; display: block; margin: 2px auto;" />
                          </a>
                        </td>
                      </tr>
                    </table>
                    <h1 style="margin: 16px 0 0; font-size: 22px; font-weight: 700; letter-spacing: 2px;">
                      <span style="color: #00F0FF;">MAKARA</span><span style="color: #FFD700;"> STORE</span>
                    </h1>
                    <!-- Subtle divider line -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin-top: 20px;">
                      <tr>
                        <td style="width: 40px; height: 1px; background: linear-gradient(to right, transparent, rgba(0,240,255,0.4));"></td>
                        <td style="width: 8px; height: 3px; border-radius: 2px; background-color: #00F0FF;"></td>
                        <td style="width: 40px; height: 1px; background: linear-gradient(to left, transparent, rgba(0,240,255,0.4));"></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color: #ffffff;" class="email-content">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 36px 32px;">
                    ${content}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #fafbfc; border-top: 1px solid #e8eaed; border-radius: 0 0 16px 16px;" class="footer-content">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 28px 32px;">
                    <!-- Contact info -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="text-align: center; padding-bottom: 16px;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                            <tr>
                              <td style="padding-right: 6px; vertical-align: middle;">
                                <span style="font-size: 13px;">&#x1F4CD;</span>
                              </td>
                              <td style="vertical-align: middle;">
                                <span style="font-size: 13px; color: #5f6368;">${STORE_LOCATION}</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="text-align: center; padding-bottom: 20px;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                            <tr>
                              <td style="padding-right: 6px; vertical-align: middle;">
                                <span style="font-size: 13px;">&#x1F4DE;</span>
                              </td>
                              <td style="vertical-align: middle;">
                                <a href="tel:${STORE_PHONE.replace(/\s/g, '')}" style="font-size: 13px; color: #5f6368; text-decoration: none;">${STORE_PHONE}</a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Divider -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="height: 1px; background-color: #e8eaed; font-size: 0; line-height: 0;">&nbsp;</td>
                      </tr>
                    </table>

                    <!-- Copyright -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding-top: 16px; text-align: center;">
                          <p style="margin: 0; font-size: 12px; color: #9aa0a6; line-height: 1.6;">
                            &copy; ${new Date().getFullYear()} ${STORE_NAME}. All rights reserved.
                          </p>
                          <p style="margin: 4px 0 0; font-size: 11px; color: #bdc1c6;">
                            <a href="${STORE_URL}" style="color: #1a73e8; text-decoration: none;">makara-store.vercel.app</a>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!-- /Email container -->

      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function sendResetCode(to: string, code: string) {
  const content = `
    <!-- Greeting -->
    <p style="margin: 0 0 20px; font-size: 15px; color: #202124; line-height: 1.6;">
      អ្នកបានស្នើកំណត់ពាក្យសម្ងាត់ឡើងវិញសម្រាប់គណនី <strong>${STORE_NAME}</strong> របស់អ្នក។ សូមប្រើលេខកូដខាងក្រោមដើម្បីបន្ត៖
    </p>

    <!-- Code display -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 28px 0;">
      <tr>
        <td align="center">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="background-color: #f8f9fa; border: 2px solid #e8eaed; border-radius: 12px; padding: 18px 36px; text-align: center;" class="code-display">
                <span style="font-size: 34px; font-weight: 700; letter-spacing: 10px; color: #0B0F19; font-family: 'SF Mono', SFMono-Regular, Consolas, 'Liberation Mono', Menlo, Courier, monospace;">
                  ${code}
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Expiry notice -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
      <tr>
        <td style="background-color: #FFF8E1; border-left: 3px solid #FFB300; border-radius: 0 8px 8px 0; padding: 12px 16px;">
          <p style="margin: 0; font-size: 13px; color: #5f6368; line-height: 1.5;">
            <strong style="color: #E65100;">&#9888;</strong>&nbsp; លេខកូដនេះមានសុពលភាព <strong>15 នាទី</strong> ប៉ុណ្ណោះ។
          </p>
        </td>
      </tr>
    </table>

    <!-- Security notice -->
    <p style="margin: 0; font-size: 13px; color: #9aa0a6; line-height: 1.6; text-align: center;">
      ប្រសិនបើអ្នកមិនបានស្នើកំណត់ពាក្យសម្ងាត់ឡើងវិញ សូមមិនអើពើនឹងអ៊ីមែលនេះ។<br>
      គណនីរបស់អ្នកនៅតែមានសុវត្ថិភាព។
    </p>
  `

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: `${STORE_NAME} - លេខកូដកំណត់ពាក្យសម្ងាត់ឡើងវិញ`,
    html: emailLayout(content, 'លេខកូដកំណត់ពាក្យសម្ងាត់របស់អ្នកពី Makara Store'),
  })
}

export async function sendOrderConfirmation(to: string, orderNumber: string, items: string, total: string) {
  const content = `
    <!-- Order confirmation icon -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
      <tr>
        <td align="center">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="width: 52px; height: 52px; border-radius: 50%; background-color: #E8F5E9; text-align: center; vertical-align: middle;">
                <span style="font-size: 24px; line-height: 52px;">&#10003;</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <h2 style="margin: 0 0 8px; font-size: 20px; font-weight: 700; color: #202124; text-align: center;">
      ការបញ្ជាទិញបានជោគជ័យ!
    </h2>
    <p style="margin: 0 0 24px; font-size: 14px; color: #5f6368; text-align: center; line-height: 1.5;">
      សូមអរគុណសម្រាប់ការទិញពី ${STORE_NAME}
    </p>

    <!-- Order details card -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa; border-radius: 12px; margin-bottom: 24px;">
      <tr>
        <td style="padding: 20px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td style="padding-bottom: 12px; border-bottom: 1px solid #e8eaed;">
                <span style="font-size: 12px; color: #9aa0a6; text-transform: uppercase; letter-spacing: 1px;">Order Number</span><br>
                <span style="font-size: 15px; font-weight: 600; color: #202124; font-family: 'SF Mono', SFMono-Regular, Consolas, monospace;">${orderNumber}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e8eaed;">
                <span style="font-size: 12px; color: #9aa0a6; text-transform: uppercase; letter-spacing: 1px;">Items</span><br>
                <span style="font-size: 14px; color: #202124; line-height: 1.6;">${items}</span>
              </td>
            </tr>
            <tr>
              <td style="padding-top: 12px;">
                <span style="font-size: 12px; color: #9aa0a6; text-transform: uppercase; letter-spacing: 1px;">Total</span><br>
                <span style="font-size: 20px; font-weight: 700; color: #0B0F19;">$${total}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- CTA button -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td align="center">
          <a href="${STORE_URL}/purchase-history" style="display: inline-block; background-color: #0B0F19; color: #ffffff; font-size: 14px; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none;">
            មើលប្រវត្តិការបញ្ជាទិញ &rarr;
          </a>
        </td>
      </tr>
    </table>
  `

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: `${STORE_NAME} - ការបញ្ជាទិញ #${orderNumber} បានជោគជ័យ`,
    html: emailLayout(content, `ការបញ្ជាទិញ #${orderNumber} របស់អ្នកពី Makara Store បានជោគជ័យ`),
  })
}

export async function sendWelcomeEmail(to: string, name: string) {
  const content = `
    <h2 style="margin: 0 0 8px; font-size: 20px; font-weight: 700; color: #202124; text-align: center;">
      សូមស្វាគមន៍មកកាន់ ${STORE_NAME}!
    </h2>
    <p style="margin: 0 0 24px; font-size: 14px; color: #5f6368; text-align: center; line-height: 1.5;">
      សួស្តី <strong>${name}</strong>, គណនីរបស់អ្នកត្រូវបានបង្កើតដោយជោគជ័យ។
    </p>

    <!-- Feature cards -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
      <tr>
        <td style="padding: 14px 16px; background-color: #f8f9fa; border-radius: 10px; margin-bottom: 8px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td style="width: 36px; vertical-align: top;">
                <span style="font-size: 18px;">&#127918;</span>
              </td>
              <td>
                <p style="margin: 0; font-size: 14px; font-weight: 600; color: #202124;">ផលិតផលឌីជីថលបុព្វលាភ</p>
                <p style="margin: 4px 0 0; font-size: 13px; color: #5f6368;">ChatGPT, Claude, Gemini, និងច្រើនទៀត</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr><td style="height: 8px;"></td></tr>
      <tr>
        <td style="padding: 14px 16px; background-color: #f8f9fa; border-radius: 10px; margin-bottom: 8px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td style="width: 36px; vertical-align: top;">
                <span style="font-size: 18px;">&#128179;</span>
              </td>
              <td>
                <p style="margin: 0; font-size: 14px; font-weight: 600; color: #202124;">ការបង់ប្រាក់ងាយស្រួល</p>
                <p style="margin: 4px 0 0; font-size: 13px; color: #5f6368;">Bakong KHQR, Stripe, និង ABA</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr><td style="height: 8px;"></td></tr>
      <tr>
        <td style="padding: 14px 16px; background-color: #f8f9fa; border-radius: 10px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td style="width: 36px; vertical-align: top;">
                <span style="font-size: 18px;">&#9889;</span>
              </td>
              <td>
                <p style="margin: 0; font-size: 14px; font-weight: 600; color: #202124;">ដំណើរការរហ័ស</p>
                <p style="margin: 4px 0 0; font-size: 13px; color: #5f6368;">ទទួលបានផលិតផលភ្លាមៗបន្ទាប់ពីបង់ប្រាក់</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- CTA button -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td align="center">
          <a href="${STORE_URL}" style="display: inline-block; background-color: #0B0F19; color: #ffffff; font-size: 14px; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none;">
            ចាប់ផ្ដើមទិញឥឡូវ &rarr;
          </a>
        </td>
      </tr>
    </table>
  `

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: `សូមស្វាគមន៍មកកាន់ ${STORE_NAME}! 🎮`,
    html: emailLayout(content, `សូមស្វាគមន៍មកកាន់ ${STORE_NAME}, ${name}!`),
  })
}

export { emailLayout }
