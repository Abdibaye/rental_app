"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ApplicantInfoFormState } from "./types"
import { cn } from "@/lib/utils"
import { Calendar, Mail, MessageCircle, PhoneCall, Shield, Sparkles, User, Users } from "lucide-react"

export type ApplicantInformationStepProps = {
  data: ApplicantInfoFormState
  onChange: (value: Partial<ApplicantInfoFormState>) => void
  disabled?: boolean
}

const referralOptions: Array<{ label: string; value: ApplicantInfoFormState["referralSource"] }> = [
  { label: "Friend or family", value: "friend" },
  { label: "Community organization", value: "community" },
  { label: "Online search", value: "online" },
  { label: "Other", value: "other" }
]

export function ApplicantInformationStep({ data, onChange, disabled }: ApplicantInformationStepProps) {
  const emailError = useMemo(() => {
    if (!data.email) return ""
    return /^\S+@\S+\.\S+$/.test(data.email) ? "" : "Enter a valid email address"
  }, [data.email])

  const phoneError = useMemo(() => {
    if (!data.phone) return ""
    return /^\+?1?\d{10,15}$/.test(data.phone.replace(/[^0-9+]/g, "")) ? "" : "Enter a valid phone number"
  }, [data.phone])

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Users className="h-3.5 w-3.5" />
          About you
        </span>
        <h2 className="text-3xl font-semibold tracking-tight">Applicant information</h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          Help us personalize support and keep you in the loop. Inputs auto-validate as you go.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        {[{
          icon: Sparkles,
          title: "Smart autofill",
          description: "We advance focus to the next field automatically."
        }, {
          icon: PhoneCall,
          title: "Instant validation",
          description: "Phone & email check in real-time."
        }, {
          icon: Shield,
          title: "Privacy first",
          description: "Identity fields are optional and protected."
        }].map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.title}
              className="group flex items-center gap-3 rounded-2xl border border-border/70 bg-background/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <span className="space-y-1">
                <span className="block text-sm font-semibold text-foreground">{item.title}</span>
                <span className="block text-xs text-muted-foreground">{item.description}</span>
              </span>
            </div>
          )
        })}
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.4fr_1.8fr]">
        <Card className="border-none bg-gradient-to-br from-primary/15 via-background to-background shadow-lg ring-1 ring-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageCircle className="h-4 w-4 text-primary" />
              Program context
            </CardTitle>
            <CardDescription>Let us know how you discovered the program and any previous aid.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>How did you hear about us?</Label>
              <div className="grid gap-3">
                {referralOptions.map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      "group flex cursor-pointer items-start gap-3 rounded-2xl border border-border/80 bg-background/90 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-within:ring-2 focus-within:ring-primary",
                      data.referralSource === option.value && "border-primary/60 bg-primary/5 shadow-lg"
                    )}
                  >
                    <input
                      type="radio"
                      name="referralSource"
                      value={option.value}
                      checked={data.referralSource === option.value}
                      onChange={() => onChange({ referralSource: option.value })}
                      className="sr-only"
                      disabled={disabled}
                      required
                    />
                    <span className="flex w-full flex-col gap-1">
                      <span className="text-sm font-semibold text-foreground">{option.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {option.value === "friend" && "Community referrals help us broaden outreach."}
                        {option.value === "community" && "Partners keep us informed about those in need."}
                        {option.value === "online" && "Great! Search helps applicants discover us quickly."}
                        {option.value === "other" && "Tell us more so we can continue improving access."}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {data.referralSource === "other" && (
              <div className="space-y-2">
                <Label htmlFor="referralNote">Tell us more</Label>
                <Input
                  id="referralNote"
                  value={data.referralNote}
                  onChange={(event) => onChange({ referralNote: event.target.value })}
                  placeholder="Share a few words"
                  disabled={disabled}
                  autoFocus
                  required
                />
              </div>
            )}

            <fieldset className="space-y-3">
              <legend className="text-sm font-medium">Have you received other assistance since 2020?</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {["yes", "no"].map((option) => (
                  <label
                    key={option}
                    className={cn(
                      "group flex cursor-pointer items-center justify-between rounded-2xl border border-border/80 bg-background/90 px-4 py-3 text-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-within:ring-2 focus-within:ring-primary",
                      data.assistanceSince2020 === option && "border-primary/60 bg-primary/5 shadow-lg"
                    )}
                  >
                    <input
                      type="radio"
                      name="assistanceSince2020"
                      value={option}
                      checked={data.assistanceSince2020 === option}
                      onChange={() => onChange({ assistanceSince2020: option as ApplicantInfoFormState["assistanceSince2020"] })}
                      className="sr-only"
                      disabled={disabled}
                      required
                    />
                    <span className="capitalize">{option}</span>
                    <span
                      className={cn(
                        "inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-semibold uppercase",
                        data.assistanceSince2020 === option ? "border-primary bg-primary text-primary-foreground" : "border-muted text-muted-foreground"
                      )}
                      aria-hidden
                    >
                      {data.assistanceSince2020 === option ? "✓" : ""}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card className="border-none shadow-lg ring-1 ring-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4 text-primary" />
                Personal information
              </CardTitle>
              <CardDescription>Keep it consistent with your legal documents.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  value={data.firstName}
                  onChange={(event) => onChange({ firstName: event.target.value })}
                  disabled={disabled}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  value={data.lastName}
                  onChange={(event) => onChange({ lastName: event.target.value })}
                  disabled={disabled}
                  required
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="dateOfBirth">Date of birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={data.dateOfBirth}
                  onChange={(event) => onChange({ dateOfBirth: event.target.value })}
                  disabled={disabled}
                  required
                />
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" aria-hidden />
                  We use this to verify age-based eligibility.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg ring-1 ring-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4 text-primary" />
                Identity (optional)
              </CardTitle>
              <CardDescription>Share only what you are comfortable with.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Input
                  id="gender"
                  value={data.gender}
                  onChange={(event) => onChange({ gender: event.target.value })}
                  placeholder="Optional"
                  disabled={disabled}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pronouns">Pronouns</Label>
                <Input
                  id="pronouns"
                  value={data.pronouns}
                  onChange={(event) => onChange({ pronouns: event.target.value })}
                  placeholder="Optional"
                  disabled={disabled}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg ring-1 ring-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Mail className="h-4 w-4 text-primary" />
                Contact details
              </CardTitle>
              <CardDescription>We will use this information to update you.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  placeholder="(415) 555-1234"
                  value={data.phone}
                  onChange={(event) => onChange({ phone: event.target.value })}
                  disabled={disabled}
                  required
                  aria-invalid={Boolean(phoneError)}
                />
                {phoneError && <p className="text-destructive text-xs">{phoneError}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  placeholder="you@example.com"
                  value={data.email}
                  onChange={(event) => onChange({ email: event.target.value })}
                  disabled={disabled}
                  required
                  aria-invalid={Boolean(emailError)}
                />
                {emailError && <p className="text-destructive text-xs">{emailError}</p>}
                {!emailError && data.email && (
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" aria-hidden />
                    Looks good! We’ll send confirmations here.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
