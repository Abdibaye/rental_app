import { NextResponse } from "next/server"
import { sendMail } from "@/lib/mailer"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, subject, message, honeypot } = body || {}

    if (typeof honeypot === "string" && honeypot.trim().length > 0) {
      return NextResponse.json({ ok: true })
    }

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof subject !== "string" ||
      typeof message !== "string"
    ) {
      return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 })
    }

    const supportEmail = process.env.ZOHO_EMAIL
    if (supportEmail) {
      const subjectLine = `[Contact] ${subject}`
      const html = `
        <div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#0f172a;">
          <h2 style="color:#2563eb;">New contact form submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br/>")}</p>
        </div>
      `
      const text = [
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject}`,
        "",
        message
      ].join("\n")

      await sendMail({ to: supportEmail, subject: subjectLine, html, text })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 })
  }
}
