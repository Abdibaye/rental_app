"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { EmploymentFormState } from "./types"
import { BriefcaseBusiness, Clock3, Home, Leaf } from "lucide-react"

const employmentTypes = [
  { value: "fullTime", label: "Full-time", helper: "40+ hours weekly" },
  { value: "partTime", label: "Part-time", helper: "Up to 39 hours weekly" },
  { value: "gig", label: "Gig / contract", helper: "Freelance or contract income" },
  { value: "selfEmployed", label: "Self-employed", helper: "Run your own business" },
  { value: "businessOwner", label: "Business owner", helper: "Own a company or storefront" }
]

export type EmploymentStepProps = {
  data: EmploymentFormState
  onChange: (value: Partial<EmploymentFormState>) => void
  disabled?: boolean
}

export function EmploymentStep({ data, onChange, disabled }: EmploymentStepProps) {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <BriefcaseBusiness className="h-3.5 w-3.5" />
          Work snapshot
        </span>
        <h2 className="text-3xl font-semibold tracking-tight">Employment &amp; income</h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          We only ask for what affects eligibility. Skip the income type section if you&apos;re not working right now.
        </p>
      </header>

      <Card className="border-none bg-linear-to-br from-background via-background to-primary/5 shadow-xl ring-1 ring-border/60">
        <CardHeader className="gap-2">
          <CardTitle className="text-base">Current status</CardTitle>
          <CardDescription>Choose the option that best reflects your situation today.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-3">
            {[{
              icon: BriefcaseBusiness,
              title: "Employment aware",
              description: "We tailor document lists depending on your status."
            }, {
              icon: Clock3,
              title: "Quick follow-up",
              description: "Takes seconds to complete either way."
            }, {
              icon: Leaf,
              title: "Support ready",
              description: "We connect non-employed applicants with community resources."
            }].map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="group flex items-center gap-3 rounded-2xl border border-border/70 bg-background/80 p-4 text-xs text-muted-foreground shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="space-y-1 text-left">
                    <span className="block text-sm font-semibold text-foreground">{item.title}</span>
                    <span className="block text-xs text-muted-foreground">{item.description}</span>
                  </span>
                </div>
              )
            })}
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-foreground">Are you currently employed?</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {["yes", "no"].map((option) => (
                <label
                  key={option}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-2xl border border-border/70 bg-background/90 px-4 py-3 text-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md",
                    data.employed === option && "border-primary/60 bg-primary/5 shadow-lg"
                  )}
                >
                  <input
                    type="radio"
                    name="employed"
                    value={option}
                    checked={data.employed === option}
                    onChange={() => onChange({
                      employed: option as EmploymentFormState["employed"],
                      employmentType: "",
                      occupation: "",
                      employerName: "",
                      selfEmploymentDescription: "",
                      previousOccupation: "",
                      previousEmployer: ""
                    })}
                    className="sr-only"
                    disabled={disabled}
                    required
                  />
                  <span className="capitalize">{option}</span>
                  <span
                    className={cn(
                      "inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-semibold uppercase",
                      data.employed === option ? "border-primary bg-primary text-primary-foreground" : "border-muted text-muted-foreground"
                    )}
                    aria-hidden
                  >
                    {data.employed === option ? "✓" : ""}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {data.employed === "yes" ? (
            <div className="space-y-5">
              <div className="space-y-4">
                <Label>What type of employment applies?</Label>
                <div className="grid gap-3 md:grid-cols-2">
                  {employmentTypes.map((item) => (
                    <label
                      key={item.value}
                      className={cn(
                        "flex cursor-pointer flex-col gap-2 rounded-2xl border border-border/70 bg-background/90 p-4 text-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md",
                        data.employmentType === item.value && "border-primary/60 bg-primary/5 shadow-lg"
                      )}
                    >
                      <input
                        type="radio"
                        className="sr-only"
                        name="employmentType"
                        value={item.value}
                        checked={data.employmentType === item.value}
                        onChange={() => {
                          const requiresDescription = item.value === "selfEmployed" || item.value === "businessOwner"
                          onChange({
                            employmentType: item.value as EmploymentFormState["employmentType"],
                            selfEmploymentDescription: requiresDescription ? data.selfEmploymentDescription : ""
                          })
                        }}
                        disabled={disabled}
                        required
                      />
                      <span className="font-semibold text-foreground">{item.label}</span>
                      <span className="text-xs text-muted-foreground">{item.helper}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="occupation" className="text-sm font-medium text-foreground">
                    Occupation / role
                  </Label>
                  <Input
                    id="occupation"
                    value={data.occupation}
                    onChange={(event) => onChange({ occupation: event.target.value })}
                    disabled={disabled}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employerName" className="text-sm font-medium text-foreground">
                    Employer name
                  </Label>
                  <Input
                    id="employerName"
                    value={data.employerName}
                    onChange={(event) => onChange({ employerName: event.target.value })}
                    disabled={disabled}
                    required
                  />
                </div>
              </div>

              {(data.employmentType === "selfEmployed" || data.employmentType === "businessOwner") && (
                <div className="space-y-2">
                  <Label htmlFor="selfEmploymentDescription" className="text-sm font-medium text-foreground">
                    Describe what you do or the nature of your business
                  </Label>
                  <textarea
                    id="selfEmploymentDescription"
                    value={data.selfEmploymentDescription}
                    onChange={(event) => onChange({ selfEmploymentDescription: event.target.value })}
                    disabled={disabled}
                    required
                    rows={4}
                    className="min-h-[112px] w-full rounded-2xl border border-border/70 bg-background/95 p-3 text-sm text-foreground shadow-sm focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              <div className="rounded-2xl border border-dashed border-border/70 bg-background/80 p-5 text-sm text-muted-foreground">
                <div className="flex items-center gap-3 text-primary">
                  <Home className="h-4 w-4" aria-hidden />
                  Looking for work or on leave?
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  We&apos;ll connect you with partner organizations and focus your application on housing and stability resources.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="previousOccupation" className="text-sm font-medium text-foreground">
                    Previous occupation / role
                  </Label>
                  <Input
                    id="previousOccupation"
                    value={data.previousOccupation}
                    onChange={(event) => onChange({ previousOccupation: event.target.value })}
                    disabled={disabled}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="previousEmployer" className="text-sm font-medium text-foreground">
                    Previous employer
                  </Label>
                  <Input
                    id="previousEmployer"
                    value={data.previousEmployer}
                    onChange={(event) => onChange({ previousEmployer: event.target.value })}
                    disabled={disabled}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <Button type="button" variant="ghost" size="sm" className="self-start text-xs text-muted-foreground" disabled>
            You can update employment later in your dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
