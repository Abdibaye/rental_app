import { createTransport } from "nodemailer"

const defaultHost = "smtp.zoho.com"
const defaultPort = 465

export function getMailer() {
  const user = process.env.ZOHO_EMAIL
  const pass = process.env.ZOHO_APP_PASSWORD
  const host = process.env.ZOHO_SMTP_HOST ?? defaultHost
  const portValue = process.env.ZOHO_SMTP_PORT
  const port = portValue ? Number(portValue) : defaultPort

  if (!user || !pass) {
    throw new Error("Zoho SMTP credentials are missing. Set ZOHO_EMAIL and ZOHO_APP_PASSWORD.")
  }

  const transport = createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  })

  return transport
}

export async function sendMail(options: { to: string; subject: string; html: string; text?: string; cc?: string; bcc?: string }) {
  const transporter = getMailer()
  await transporter.sendMail({
    from: process.env.ZOHO_EMAIL,
    ...options
  })
}