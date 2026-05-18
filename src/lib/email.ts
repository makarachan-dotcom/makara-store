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

export async function sendResetCode(to: string, code: string) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: 'Makara Store - លេខកូដកំណត់ពាក្យសម្ងាត់ឡើងវិញ',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #0a0a0f; color: #fff; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #00f0ff; margin: 0;">MAKARA STORE</h1>
        </div>
        <p style="color: #ccc; font-size: 14px;">អ្នកបានស្នើកំណត់ពាក្យសម្ងាត់ឡើងវិញ។ សូមប្រើលេខកូដខាងក្រោម៖</p>
        <div style="text-align: center; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #00f0ff; background: #1a1a2e; padding: 12px 24px; border-radius: 8px; display: inline-block;">
            ${code}
          </span>
        </div>
        <p style="color: #888; font-size: 12px; text-align: center;">លេខកូដនេះមានសុពលភាព 15 នាទី។</p>
        <p style="color: #666; font-size: 11px; text-align: center; margin-top: 24px;">ប្រសិនបើអ្នកមិនបានស្នើកំណត់ពាក្យសម្ងាត់ឡើងវិញ សូមមិនអើពើនឹងអ៊ីមែលនេះ។</p>
      </div>
    `,
  })
}
