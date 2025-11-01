"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DemographicsFormState } from "./types"
import { CheckCheck, CircleAlert, Users } from "lucide-react"

const raceOptions = [
  "American Indian or Alaska Native",
  "Asian",
  "Black or African American",
  "Latino or Hispanic",
  "Middle Eastern or North African",
  "Native Hawaiian or Pacific Islander",
  "White",
  "Prefer to self-describe"
]

export type DemographicsStepProps = {
  data: DemographicsFormState
  onChange: (value: Partial<DemographicsFormState>) => void
  disabled?: boolean
}

export function DemographicsStep({ data, onChange, disabled }: DemographicsStepProps) {
  const selectedCount = data.races.length

  const helperText = useMemo(() => {
    if (data.decline) return "You chose not to disclose."
    if (selectedCount === 0) return "Optional, but helps us direct resources."
    if (selectedCount === 1) return "1 category selected."
    return `${selectedCount} categories selected.`
  }, [data.decline, selectedCount])

  const toggleRace = (value: string) => {
    if (data.decline) return
    onChange({
      races: data.races.includes(value)
        ? data.races.filter((item) => item !== value)
        : [...data.races, value]
    })
  }

  const handleDecline = () => {
    onChange({ decline: !data.decline, races: [] })
  }

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Users className="h-3.5 w-3.5" />
          Optional insights
        </span>
        <h2 className="text-3xl font-semibold tracking-tight">Race &amp; ethnicity</h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          Sharing helps us ensure equitable access. You may select more than one or choose not to respond.
        </p>
      </header>

      <Card className="border-none bg-linear-to-br from-background via-background to-primary/5 shadow-xl ring-1 ring-border/60">
        <CardHeader className="gap-2">
          <CardTitle className="text-base">Demographics (optional)</CardTitle>
          <CardDescription>
            These answers are never shared with landlords. We use them to report anonymized outcomes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-xs text-muted-foreground">
            <span>{helperText}</span>
            <Button
              variant={data.decline ? "default" : "outline"}
              size="sm"
              type="button"
              onClick={handleDecline}
              disabled={disabled}
              className={cn(
                "gap-2",
                data.decline && "bg-primary text-primary-foreground"
              )}
            >
              <CircleAlert className="h-3.5 w-3.5" aria-hidden />
              {data.decline ? "Undo decline" : "Decline to state"}
            </Button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {raceOptions.map((option) => {
              const checked = data.races.includes(option)
              return (
                <label
                  key={option}
                  className={cn(
                    "group flex cursor-pointer items-start gap-3 rounded-2xl border border-border/70 bg-background/90 p-4 text-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md",
                    checked && "border-primary/60 bg-primary/5 shadow-lg",
                    data.decline && "pointer-events-none opacity-40"
                  )}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => toggleRace(option)}
                    disabled={disabled || data.decline}
                  />
                  <span className="flex-1">
                    <span className="font-medium text-foreground">{option}</span>
                  </span>
                  <span
                    className={cn(
                      "inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-semibold uppercase transition",
                      checked ? "border-primary bg-primary text-primary-foreground" : "border-muted text-muted-foreground"
                    )}
                    aria-hidden
                  >
                    {checked ? "✓" : ""}
                  </span>
                </label>
              )
            })}
          </div>

          <p className="text-xs text-muted-foreground">
            Selecting categories helps us demonstrate impact. You can update this later.
          </p>

          {data.decline && (
            <div className="flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-xs text-primary">
              <CheckCheck className="h-4 w-4" aria-hidden />
              Thanks for letting us know. We&apos;ll skip demographic follow-up questions.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
