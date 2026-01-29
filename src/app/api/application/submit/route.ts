import { NextResponse } from "next/server"
import { sendMail } from "@/lib/mailer"

function escapeHtml(input: unknown): string {
  const value = String(input ?? "")
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;"
      case "<":
        return "&lt;"
      case ">":
        return "&gt;"
      case '"':
        return "&quot;"
      case "'":
        return "&#39;"
      default:
        return character
    }
  })
}

function valueOrDefault(input: unknown, fallback = "Not provided"): string {
  if (input === null || input === undefined) return fallback
  const value = String(input).trim()
  return value.length > 0 ? value : fallback
}

const employmentTypeLabels: Record<string, string> = {
  fullTime: "Full-time",
  partTime: "Part-time",
  gig: "Gig / contract",
  selfEmployed: "Self-employed",
  businessOwner: "Business owner"
}

function generateApplicationNumber() {
  const random = Math.floor(10000000 + Math.random() * 90000000)
  return String(random)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      applicantInfo,
      eligibility,
      address,
      household,
      employment
    } = body ?? {}

    const toTrimmed = (value: unknown) => (typeof value === "string" ? value.trim() : "")

    const applicantFirstName = toTrimmed(applicantInfo?.firstName)
    const applicantLastName = toTrimmed(applicantInfo?.lastName)
    const applicantEmail = toTrimmed(applicantInfo?.email)

    if (!applicantEmail || !applicantFirstName || !applicantLastName) {
      return NextResponse.json({ ok: false, error: "Missing applicant contact details." }, { status: 400 })
    }

  const applicationNumber = generateApplicationNumber()
  const fullName = `${applicantFirstName} ${applicantLastName}`.trim() || applicantFirstName
    const applicantNameDisplay = valueOrDefault(fullName)
    const applicantEmailDisplay = valueOrDefault(applicantEmail)
    const greetingName = applicantFirstName || applicantNameDisplay
  const documentsSubjectLine = `Application #${applicationNumber} - ${fullName}`

    const applicantPhone = valueOrDefault(toTrimmed(applicantInfo?.phone))

    const currentAddress = [address?.addressLine1, address?.unit, address?.city, address?.zipCode]
      .map(toTrimmed)
      .filter(Boolean)
      .join(", ")
    const currentAddressDisplay = currentAddress || "Not provided"

    const householdSizeDisplay = valueOrDefault(toTrimmed(eligibility?.householdSize))
    const monthlyIncomeDisplay = valueOrDefault(toTrimmed(eligibility?.monthlyIncome))

    const actualCityCandidate = toTrimmed(eligibility?.actualCity) || toTrimmed(eligibility?.detectedCity)
    const actualCityDisplay = valueOrDefault(actualCityCandidate)

    const assistanceTypeLabel = eligibility?.assistanceType === "moving"
      ? "New apartment"
      : eligibility?.assistanceType === "pastDue"
        ? "Past-due rent (unsupported)"
        : "Not provided"

    const newApartmentAddressRaw = [
      eligibility?.newApartmentStreet,
      eligibility?.newApartmentUnit,
      eligibility?.newApartmentCity,
      eligibility?.newApartmentState,
      eligibility?.newApartmentZip
    ]
      .map(toTrimmed)
      .filter(Boolean)
      .join(", ")

    const newApartmentAddress = eligibility?.assistanceType === "moving"
      ? newApartmentAddressRaw || "Pending applicant"
      : "Not requested"

    const newApartmentConfirmation = eligibility?.assistanceType === "moving"
      ? eligibility?.newApartmentAddressConfirmation === "yes"
        ? "Yes"
        : eligibility?.newApartmentAddressConfirmation === "no"
          ? "No"
          : "Not provided"
      : "Not requested"

    const livesInSfLabel = eligibility?.livesInSF === "yes"
      ? "Yes"
      : eligibility?.livesInSF === "no"
        ? "No"
        : "Not provided"

    const householdSituationDisplay = valueOrDefault(toTrimmed(household?.livingSituation))

    const employmentStatusLabel = employment?.employed === "yes"
      ? "Employed"
      : employment?.employed === "no"
        ? "Not employed"
        : "Not provided"

    const employmentTypeLabel = employment?.employmentType
      ? employmentTypeLabels[employment.employmentType] ?? employment.employmentType
      : "Not provided"

    const occupationDisplay = valueOrDefault(toTrimmed(employment?.occupation))
    const employerDisplay = valueOrDefault(toTrimmed(employment?.employerName))
    const previousOccupationDisplay = valueOrDefault(toTrimmed(employment?.previousOccupation))
    const previousEmployerDisplay = valueOrDefault(toTrimmed(employment?.previousEmployer))
    const selfEmploymentDetails = valueOrDefault(toTrimmed(employment?.selfEmploymentDescription))

    const summaryEntries: Array<{ label: string; value: string }> = [
      { label: "Applicant name", value: applicantNameDisplay },
      { label: "Applicant email", value: applicantEmailDisplay },
      { label: "Phone", value: applicantPhone },
      { label: "Date of birth", value: valueOrDefault(toTrimmed(applicantInfo?.dateOfBirth)) },
      { label: "Gender", value: valueOrDefault(toTrimmed(applicantInfo?.gender)) },
      { label: "Pronouns", value: valueOrDefault(toTrimmed(applicantInfo?.pronouns)) },
      { label: "Referral source", value: valueOrDefault(toTrimmed(applicantInfo?.referralSource)) },
      { label: "Referral note", value: valueOrDefault(toTrimmed(applicantInfo?.referralNote)) },
      { label: "Assistance since 2020", value: valueOrDefault(toTrimmed(applicantInfo?.assistanceSince2020)) },
      { label: "Current address", value: currentAddressDisplay },
      { label: "Household size", value: householdSizeDisplay },
      { label: "Monthly income", value: monthlyIncomeDisplay },
      { label: "Assistance type", value: assistanceTypeLabel },
      { label: "Detected city/region", value: valueOrDefault(`${toTrimmed(eligibility?.detectedCity)} ${toTrimmed(eligibility?.detectedRegion)} ${toTrimmed(eligibility?.detectedRegionCode)}`.trim()) },
      { label: "Current city", value: actualCityDisplay },
      { label: "Lives in San Francisco", value: livesInSfLabel },
      { label: "New apartment address", value: newApartmentAddress },
      { label: "Address confirmed", value: newApartmentConfirmation },
      { label: "Household living situation", value: householdSituationDisplay },
      { label: "Household members (list)", value: Array.isArray(household?.members) ? (household.members.join(", ") || "None") : "Not provided" },
      { label: "Household counts (infants/children/teens/adults)", value: `${valueOrDefault(toTrimmed(household?.infants))}/${valueOrDefault(toTrimmed(household?.children))}/${valueOrDefault(toTrimmed(household?.teens))}/${valueOrDefault(toTrimmed(household?.adults))}` },
      { label: "Employment status", value: employmentStatusLabel },
      { label: "Employment type", value: employmentTypeLabel },
      { label: "Occupation / role", value: occupationDisplay },
      { label: "Employer", value: employerDisplay }
    ]

    if (employment?.employmentType === "selfEmployed" || employment?.employmentType === "businessOwner") {
      summaryEntries.push({ label: "Business details", value: selfEmploymentDetails })
    }

    if (employment?.employed === "no") {
      summaryEntries.push({ label: "Previous occupation", value: previousOccupationDisplay })
      summaryEntries.push({ label: "Previous employer", value: previousEmployerDisplay })
    }

    const summaryLines = summaryEntries.map(({ label, value }) => `${label}: ${value}`)
    const summaryTableRows = summaryEntries
      .map((entry, index) => {
        const background = index % 2 === 0 ? "#ffffff" : "#f8fafc"
        const safeLabel = escapeHtml(entry.label)
        const safeValue = escapeHtml(entry.value).replace(/\n/g, "<br/>")
        return `
          <tr style="background:${background};">
            <td style="padding:12px 16px;font-weight:600;color:#0f172a;border-bottom:1px solid #e2e8f0;width:40%;">${safeLabel}</td>
            <td style="padding:12px 16px;color:#334155;border-bottom:1px solid #e2e8f0;">${safeValue}</td>
          </tr>
        `
      })
      .join("")

    const adminSubject = `New rental assistance application #${applicationNumber}`
    const adminHtml = `
      <div style="margin:0;padding:32px;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;color:#0f172a;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;margin:0 auto;background:#ffffff;border-radius:18px;border:1px solid #e2e8f0;box-shadow:0 20px 40px rgba(15,23,42,0.08);overflow:hidden;">
          <tr>
            <td style="padding:28px 32px;background:#1d4ed8;color:#ffffff;">
              <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;">Rental Assistance</p>
              <p style="margin:0;font-size:24px;font-weight:600;">New application received</p>
              <p style="margin:12px 0 0;font-size:14px;">Application number <strong>#${escapeHtml(applicationNumber)}</strong></p>
              <p style="margin:4px 0 0;font-size:14px;">Submitted by ${escapeHtml(applicantNameDisplay)} (${escapeHtml(applicantEmailDisplay)})</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;">
              <p style="margin:0 0 16px;font-size:16px;font-weight:600;color:#0f172a;">Quick summary</p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;border-radius:12px;overflow:hidden;">
                ${summaryTableRows}
              </table>
              <p style="margin:24px 0 0;font-size:13px;color:#64748b;">Reply to this email if you need to loop in the applicant or request more documentation.</p>
            </td>
          </tr>
        </table>
      </div>
    `

    const adminText = [
      `Application number: #${applicationNumber}`,
      `Applicant: ${applicantNameDisplay} (${applicantEmailDisplay})`,
      "",
      ...summaryLines
    ].join("\n")

    const confirmationSubject = `We received your rental assistance application (#${applicationNumber})`
    const confirmationHtml = `
      <div style="margin:0;padding:32px;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;color:#0f172a;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;margin:0 auto;background:#ffffff;border-radius:18px;border:1px solid #e2e8f0;box-shadow:0 20px 40px rgba(15,23,42,0.08);overflow:hidden;">
          <tr>
            <td style="padding:32px;">
              <p style="margin:0;font-size:14px;color:#64748b;">Hi ${escapeHtml(greetingName || "there")},</p>
              <p style="margin:8px 0 16px;font-size:26px;font-weight:600;color:#0f172a;">We received your rental assistance application.</p>
              <span style="display:inline-block;margin-bottom:24px;padding:10px 18px;border-radius:999px;background:#dbeafe;color:#1d4ed8;font-size:12px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;">Application #${escapeHtml(applicationNumber)}</span>
              <p style="margin:0 0 20px;font-size:15px;color:#334155;">Our team is reviewing your answers now. Expect an update within five business days.</p>

              <div style="margin:0 0 20px;padding:20px;border-radius:16px;background:#f8fafc;border:1px solid #e2e8f0;">
                <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:0.12em;">What happens next</p>
                <ul style="margin:0;padding:0 0 0 18px;font-size:14px;color:#334155;line-height:1.6;">
                  <li>Watch your inbox (and spam folder) for our confirmation within 5 business days.</li>
                  <li>Reply to that email with the documents listed below so we can move faster.</li>
                  <li>Let us know in the reply if anything about your situation changes.</li>
                </ul>
              </div>

              <div style="margin:0 0 20px;padding:20px;border-radius:16px;background:#eff6ff;border:1px solid #bfdbfe;">
                <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:0.12em;">Documents to send</p>
                <ul style="margin:0;padding:0 0 0 18px;font-size:14px;color:#1e3a8a;line-height:1.6;">
                  <li>Any valid government ID (front &amp; back clear pictures).</li>
                  <li>Three months of recent bank statements.</li>
                  <li>Most recent W2.</li>
                </ul>
                <p style="margin:12px 0 0;font-size:13px;color:#1d4ed8;">Attach these files when you reply to our email. Secure uploads help us verify eligibility quickly.</p>
                <p style="margin:12px 0 0;font-size:13px;color:#1d4ed8;">Use the subject line <strong>${escapeHtml(documentsSubjectLine)}</strong> so we can match your documents right away.</p>
              </div>

              <p style="margin:0;font-size:14px;color:#64748b;">Need anything else in the meantime? Reply to this message and our team will help.</p>

              <p style="margin:24px 0 0;font-size:14px;color:#334155;">Warmly,<br/>Rental Assistance Team</p>
            </td>
          </tr>
        </table>
      </div>
    `

    const confirmationText = [
      `Hi ${greetingName || "there"},`,
      "",
      "We received your rental assistance application.",
      `Application number: #${applicationNumber}`,
      "",
      "What happens next:",
      "- Watch your inbox (including spam) for our email within 5 business days.",
  "- Reply with Most recent W2 and Any valid government ID (front & back clear pictures).",
  `- Use the subject line "${documentsSubjectLine}" when you send those documents.`,
      "- Add any updates about your situation directly in that reply.",
      "",
      "We will reach out if we need anything else.",
      "",
      "Thanks,",
      "Rental Assistance Team"
    ].join("\n")

    const adminEmail = process.env.ZOHO_EMAIL

    await Promise.all([
      adminEmail ? sendMail({ to: adminEmail, subject: adminSubject, html: adminHtml, text: adminText }) : Promise.resolve(),
      sendMail({ to: applicantEmail, subject: confirmationSubject, html: confirmationHtml, text: confirmationText })
    ])

    return NextResponse.json({ ok: true, applicationNumber })
  } catch (error) {
    console.error("Failed to submit application", error)
    return NextResponse.json({ ok: false, error: "Unable to process application." }, { status: 500 })
  }
}
