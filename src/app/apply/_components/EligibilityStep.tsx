"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { BadgeCheck, Building2, Info, LifeBuoy, ShieldCheck, Sparkles, Timer, Users, Wallet } from "lucide-react"
import { EligibilityFormState } from "./types"

export type EligibilityStepProps = {
  data: EligibilityFormState
  onChange: (value: Partial<EligibilityFormState>) => void
  disabled?: boolean
}

export function EligibilityStep({ data, onChange, disabled }: EligibilityStepProps) {
  const showIneligibleNotice = data.livesInSF === "no"

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <BadgeCheck className="h-3.5 w-3.5" />
          Quick pre-check
        </span>
        <h2 className="text-3xl font-semibold tracking-tight">Before you begin</h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          Three lightweight questions help us confirm you qualify. Your progress saves automatically.
        </p>
      </div>

      <Card className="border-none bg-gradient-to-br from-background via-background to-primary/5 shadow-xl backdrop-blur-md ring-1 ring-border/50">
        <CardHeader className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Overview &amp; eligibility</CardTitle>
            <p className="text-muted-foreground text-sm">
              Keep it under a minute. We’ll unlock the full application once you’re eligible.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Info className="h-3.5 w-3.5" aria-hidden />
            Required to continue
          </div>
        </CardHeader>
        <CardContent className="space-y-10">
          <div className="grid gap-3 sm:grid-cols-3">
            {[{
              icon: Sparkles,
              title: "Takes < 1 minute",
              description: "Three questions to unlock the rest."
            }, {
              icon: Timer,
              title: "Auto-save on",
              description: "Leave and pick up right where you left off."
            }, {
              icon: ShieldCheck,
              title: "Secure review",
              description: "We only surface the steps you need."
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

          <fieldset className="space-y-4">
            <legend className="text-base font-medium text-foreground">Do you currently live in San Francisco?</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {[{
                label: "Yes, I live in San Francisco",
                value: "yes",
                description: "Unlocks the full application.",
                icon: Building2
              }, {
                label: "No, I live elsewhere",
                value: "no",
                description: "We’ll point you to alternate resources.",
                icon: LifeBuoy
              }].map((option) => {
                const Icon = option.icon

                return (
                  <label
                    key={option.value}
                    className={cn(
                      "group flex cursor-pointer items-start gap-3 rounded-2xl border border-border/80 bg-background/90 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-within:ring-2 focus-within:ring-primary",
                      data.livesInSF === option.value && "border-primary/60 bg-primary/5 shadow-lg"
                    )}
                  >
                    <input
                      type="radio"
                      name="livesInSF"
                      value={option.value}
                      checked={data.livesInSF === option.value}
                      onChange={() => onChange({ livesInSF: option.value as EligibilityFormState["livesInSF"] })}
                      className="sr-only"
                      disabled={disabled}
                      required
                    />
                    <span className="flex w-full flex-col gap-2">
                      <span className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <Icon className="h-4 w-4 text-primary" aria-hidden />
                          {option.label}
                        </span>
                        <span
                          className={cn(
                            "inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-semibold uppercase transition",
                            data.livesInSF === option.value ? "border-primary bg-primary text-primary-foreground" : "border-muted text-muted-foreground"
                          )}
                          aria-hidden
                        >
                          {data.livesInSF === option.value ? "✓" : ""}
                        </span>
                      </span>
                      <span className="text-xs text-muted-foreground">{option.description}</span>
                    </span>
                  </label>
                )
              })}
            </div>
            <div role="status" aria-live="polite">
              {showIneligibleNotice && (
                <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  We currently support San Francisco residents only. Please reach out to our team for other assistance options.
                </p>
              )}
            </div>
          </fieldset>

          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <div className="space-y-4">
              <Label htmlFor="householdSize" className="text-sm font-semibold text-foreground">
                Household size
              </Label>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  id="householdSize"
                  type="number"
                  min={1}
                  inputMode="numeric"
                  placeholder="Number of people"
                  value={data.householdSize}
                  onChange={(event) => onChange({ householdSize: event.target.value })}
                  disabled={disabled}
                  required
                />
                <Input
                  id="monthlyIncome"
                  type="number"
                  min={0}
                  step="100"
                  inputMode="decimal"
                  placeholder="Monthly income (USD)"
                  value={data.monthlyIncome}
                  onChange={(event) => onChange({ monthlyIncome: event.target.value })}
                  disabled={disabled}
                  required
                />
              </div>
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" aria-hidden />
                This helps us estimate assistance levels for your household.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-border/70 bg-background/70 p-5 shadow-sm">
              <Label htmlFor="assistanceType" className="text-sm font-semibold text-foreground">
                What are you applying for?
              </Label>
              <div className="relative">
                <select
                  id="assistanceType"
                  value={data.assistanceType}
                  onChange={(event) => onChange({ assistanceType: event.target.value as EligibilityFormState["assistanceType"] })}
                  className="h-12 w-full appearance-none rounded-xl border border-transparent bg-primary/10 px-4 text-sm font-medium text-primary shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={disabled}
                  required
                >
                  <option value="" disabled>
                    Select support type
                  </option>
                  <option value="pastDue">Past-due rent</option>
                  <option value="moving">Moving assistance</option>
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-primary/70">
                  ▾
                </span>
              </div>
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Wallet className="h-3.5 w-3.5" aria-hidden />
                We tailor document checklists based on the assistance you select.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
