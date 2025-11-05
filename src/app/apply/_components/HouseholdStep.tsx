"use client"

import { Fragment, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { HouseholdFormState } from "./types"
import { HouseholdMember } from "./types"
import { CirclePlus, MinusCircle, UsersRound } from "lucide-react"

const livingSituationOptions = [
  "Rental",
  "Shelter",
  "Living with family",
  "Living with friends",
  "Temporary hotel",
  "Other"
]

export type HouseholdStepProps = {
  data: HouseholdFormState
  onChange: (value: Partial<HouseholdFormState>) => void
  disabled?: boolean
}

const emptyMember: HouseholdMember = {
  name: "",
  age: "",
  relationship: ""
}

export function HouseholdStep({ data, onChange, disabled }: HouseholdStepProps) {
  const totalCount = useMemo(() => {
    const base = Number.parseInt(data.infants || "0", 10)
      + Number.parseInt(data.children || "0", 10)
      + Number.parseInt(data.teens || "0", 10)
      + Number.parseInt(data.adults || "0", 10)
    return Number.isNaN(base) ? 0 : base
  }, [data.infants, data.children, data.teens, data.adults])

  const handleMemberChange = (index: number, field: keyof HouseholdMember, value: string) => {
    const updated = data.members.map((member, current) => (current === index ? { ...member, [field]: value } : member))
    onChange({ members: updated })
  }

  const addMember = () => {
    onChange({ members: [...data.members, { ...emptyMember }] })
  }

  const removeMember = (index: number) => {
    onChange({ members: data.members.filter((_, current) => current !== index) })
  }

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <UsersRound className="h-3.5 w-3.5" />
          Household snapshot
        </span>
        <h2 className="text-3xl font-semibold tracking-tight">Tell us about everyone at home</h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          This helps us tailor resources. Add members and note any recent changes.
        </p>
      </header>

      <Card className="border-none bg-linear-to-br from-background via-background to-primary/5 shadow-xl ring-1 ring-border/60">
        <CardHeader className="gap-2">
          <CardTitle className="text-base">Household details</CardTitle>
          <CardDescription>We summarize everything dynamically so you can double-check in real time.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1.6fr]">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="livingSituation">Where are you currently living?</Label>
                <div className="relative">
                  <select
                    id="livingSituation"
                    value={data.livingSituation}
                    onChange={(event) => onChange({ livingSituation: event.target.value })}
                    className="h-12 w-full appearance-none rounded-xl border border-transparent bg-primary/10 px-4 text-sm font-medium text-primary shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    disabled={disabled}
                    required
                  >
                    <option value="" disabled>
                      Select living situation
                    </option>
                    {livingSituationOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-primary/70">
                    ▾
                  </span>
                </div>
              </div>

              <div className="grid gap-4 rounded-2xl border border-border/70 bg-background/70 p-5 text-xs text-muted-foreground">
                <div className="flex items-center justify-between text-sm font-semibold text-foreground">
                  <span>Household summary</span>
                  <span>{totalCount} people</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {[{
                    id: "infants",
                    label: "0-2 years",
                    value: data.infants,
                    placeholder: "0"
                  }, {
                    id: "children",
                    label: "3-12 years",
                    value: data.children,
                    placeholder: "0"
                  }, {
                    id: "teens",
                    label: "13-17 years",
                    value: data.teens,
                    placeholder: "0"
                  }, {
                    id: "adults",
                    label: "18+ years",
                    value: data.adults,
                    placeholder: "0"
                  }].map((group) => (
                    <div key={group.id} className="space-y-1">
                      <Label htmlFor={group.id} className="text-xs font-semibold">
                        {group.label}
                      </Label>
                      <Input
                        id={group.id}
                        type="number"
                        min={0}
                        inputMode="numeric"
                        value={group.value}
                        placeholder={group.placeholder}
                        onChange={(event) => onChange({ [group.id]: event.target.value } as Partial<HouseholdFormState>)}
                        disabled={disabled}
                      />
                    </div>
                  ))}
                </div>
                <p>Use these counts to match the household size entered earlier.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Any changes in the past 12 months?</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {["yes", "no"].map((option) => (
                      <label
                        key={option}
                        className={cn(
                          "flex cursor-pointer items-center justify-between rounded-2xl border border-border/70 bg-background/90 px-4 py-3 text-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md",
                          data.hasChanges === option && "border-primary/60 bg-primary/5 shadow-lg"
                        )}
                      >
                        <input
                          type="radio"
                          name="hasChanges"
                          className="sr-only"
                          value={option}
                          checked={data.hasChanges === option}
                          onChange={() => onChange({ hasChanges: option as HouseholdFormState["hasChanges"] })}
                          disabled={disabled}
                          required
                        />
                        <span className="capitalize">{option}</span>
                        <span
                          className={cn(
                            "inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-semibold uppercase",
                            data.hasChanges === option ? "border-primary bg-primary text-primary-foreground" : "border-muted text-muted-foreground"
                          )}
                          aria-hidden
                        >
                          {data.hasChanges === option ? "✓" : ""}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Pregnancy in household?</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {["yes", "no"].map((option) => (
                      <label
                        key={option}
                        className={cn(
                          "flex cursor-pointer items-center justify-between rounded-2xl border border-border/70 bg-background/90 px-4 py-3 text-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md",
                          data.expectingChild === option && "border-primary/60 bg-primary/5 shadow-lg"
                        )}
                      >
                        <input
                          type="radio"
                          name="expectingChild"
                          className="sr-only"
                          value={option}
                          checked={data.expectingChild === option}
                          onChange={() => onChange({ expectingChild: option as HouseholdFormState["expectingChild"] })}
                          disabled={disabled}
                          required
                        />
                        <span className="capitalize">{option}</span>
                        <span
                          className={cn(
                            "inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-semibold uppercase",
                            data.expectingChild === option ? "border-primary bg-primary text-primary-foreground" : "border-muted text-muted-foreground"
                          )}
                          aria-hidden
                        >
                          {data.expectingChild === option ? "✓" : ""}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Household members
                </h3>
                <Button type="button" size="sm" variant="outline" onClick={addMember} disabled={disabled} className="gap-2">
                  <CirclePlus className="h-4 w-4" aria-hidden />
                  Add member
                </Button>
              </div>
              {data.members.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border/70 bg-background/80 p-6 text-sm text-muted-foreground">
                  Start by adding adult household members. You can list minors if they contribute to rent.
                </div>
              )}
              <div className="space-y-5">
                {data.members.map((member, index) => (
                  <Fragment key={`member-${index}`}>
                    <div className="relative space-y-4 rounded-2xl border border-border/70 bg-background/90 p-5 shadow-sm">
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor={`member-name-${index}`}>Full name</Label>
                          <Input
                            id={`member-name-${index}`}
                            value={member.name}
                            onChange={(event) => handleMemberChange(index, "name", event.target.value)}
                            placeholder="Alex Soros"
                            disabled={disabled}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`member-age-${index}`}>Age</Label>
                          <Input
                            id={`member-age-${index}`}
                            type="number"
                            inputMode="numeric"
                            value={member.age}
                            onChange={(event) => handleMemberChange(index, "age", event.target.value)}
                            placeholder="35"
                            disabled={disabled}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`member-relationship-${index}`}>Relationship to applicant</Label>
                          <Input
                            id={`member-relationship-${index}`}
                            value={member.relationship}
                            onChange={(event) => handleMemberChange(index, "relationship", event.target.value)}
                            placeholder="Partner"
                            disabled={disabled}
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMember(index)}
                        disabled={disabled}
                        className="absolute -top-3 right-3 gap-2 rounded-full border border-border/70 bg-background/90 px-3 py-1 text-xs"
                      >
                        <MinusCircle className="h-4 w-4" aria-hidden />
                        Remove
                      </Button>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
