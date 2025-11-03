"use client"

import { ChangeEvent, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { fetchLocationWithCache } from "@/lib/locationClient"
import { BadgeCheck, Ban, Info, MapPin, ShieldCheck, Sparkles, Timer, Users, Wallet } from "lucide-react"
import { EligibilityFormState } from "./types"
const isSanFrancisco = (value: string) => /san\s*francisco/i.test(value)

export type EligibilityStepProps = {
  data: EligibilityFormState
  onChange: (value: Partial<EligibilityFormState>) => void
  disabled?: boolean
}

export function EligibilityStep({ data, onChange, disabled }: EligibilityStepProps) {
  const actualCityValue = data.actualCity ?? ""
  const detectedCityName = (data.detectedCity ?? "").trim()
  const detectedRegionName = (data.detectedRegion ?? "").trim()
  const detectedRegionCode = (data.detectedRegionCode ?? "").trim()
  const stateDescriptor = detectedRegionName || detectedRegionCode
  const stateLabelForDisplay = detectedRegionName || (detectedRegionCode ? detectedRegionCode.toUpperCase() : "")
  const overridePlaceholder = stateLabelForDisplay ? `e.g. City, ${stateLabelForDisplay}` : "e.g. City, State"
  const normalizedStateName = detectedRegionName.toLowerCase()
  const normalizedStateCode = detectedRegionCode.toLowerCase()
  const matchesStateName = (value: string) => (normalizedStateName ? value.includes(normalizedStateName) : false)
  const matchesStateCode = (value: string) => (normalizedStateCode ? new RegExp(`\\b${normalizedStateCode}\\b`).test(value) : false)
  const normalizedActualCity = actualCityValue.trim().toLowerCase()
  const hasStateInfo = Boolean(detectedRegionName || detectedRegionCode)
  const actualCityInvalid = hasStateInfo && normalizedActualCity.length > 0 && !matchesStateName(normalizedActualCity) && !matchesStateCode(normalizedActualCity)
  const detectedLocationRaw = [detectedCityName, stateDescriptor].filter(Boolean).join(", ")
  const hasDetectedLocation = detectedLocationRaw.length > 0
  const detectedLocationDisplay = hasDetectedLocation ? detectedLocationRaw : "Detecting location…"
  const newApartmentStreet = data.newApartmentStreet ?? ""
  const newApartmentUnit = data.newApartmentUnit ?? ""
  const newApartmentCity = data.newApartmentCity ?? ""
  const newApartmentState = data.newApartmentState ?? ""
  const newApartmentZip = data.newApartmentZip ?? ""
  const newApartmentAddressConfirmation = data.newApartmentAddressConfirmation ?? ""
  const isNewApartmentRequest = data.assistanceType === "moving"
  const normalizedNewApartmentZip = newApartmentZip.trim()
  const newApartmentZipInvalid = isNewApartmentRequest && normalizedNewApartmentZip.length > 0 && !/^\d{5}(?:-\d{4})?$/.test(normalizedNewApartmentZip)

  const handleAssistanceTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as EligibilityFormState["assistanceType"]
    if (value !== "moving") {
      onChange({
        assistanceType: value,
        newApartmentStreet: "",
        newApartmentUnit: "",
        newApartmentCity: "",
        newApartmentState: "",
        newApartmentZip: "",
        newApartmentAddressConfirmation: ""
      })
      return
    }
    onChange({ assistanceType: value })
  }

  useEffect(() => {
    if (!data.detectedCity || data.detectedRegion || data.detectedRegionCode) return
    if (!data.detectedCity.includes(",")) return
    const parts = data.detectedCity
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
    if (parts.length < 2) return
    const cityPart = parts.slice(0, -1).join(", ")
    const regionPart = parts[parts.length - 1]
    const payload: Partial<EligibilityFormState> = {}
    if (cityPart && cityPart !== data.detectedCity) payload.detectedCity = cityPart
    if (regionPart) payload.detectedRegion = regionPart
    if (Object.keys(payload).length > 0) {
      onChange(payload)
    }
  }, [data.detectedCity, data.detectedRegion, data.detectedRegionCode, onChange])

  useEffect(() => {
    let isCancelled = false
    const shouldFetch = !data.detectedCity || !data.detectedRegion || !data.detectedRegionCode
    if (!shouldFetch) return

    ;(async () => {
      const result = await fetchLocationWithCache()
      if (!result || isCancelled) return
      const city = (result.city ?? "").trim()
      const region = (result.region ?? "").trim()
      const regionCode = (result.region_code ?? "").trim()
      if (!city && !region && !regionCode) return
      const nextPayload: Partial<EligibilityFormState> = {}
      if (city && city !== data.detectedCity) nextPayload.detectedCity = city
      if (region && region !== data.detectedRegion) nextPayload.detectedRegion = region
      if (regionCode && regionCode !== data.detectedRegionCode) nextPayload.detectedRegionCode = regionCode
      if (Object.keys(nextPayload).length > 0) {
        onChange(nextPayload)
      }
    })()

    return () => {
      isCancelled = true
    }
  }, [data.detectedCity, data.detectedRegion, data.detectedRegionCode, onChange])

  useEffect(() => {
    const derivedDetected = detectedLocationRaw
    const resolved = actualCityValue.trim() || derivedDetected
    if (!resolved) return
    const next = isSanFrancisco(resolved) ? "yes" : "no"
    if (data.livesInSF !== next) {
      onChange({ livesInSF: next as EligibilityFormState["livesInSF"] })
    }
  }, [actualCityValue, detectedLocationRaw, data.livesInSF, onChange])

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

    <Card className="border-none bg-linear-to-br from-background via-background to-primary/5 shadow-xl backdrop-blur-md ring-1 ring-border/50">
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

          <fieldset className="space-y-6 rounded-3xl border border-border/60 bg-linear-to-br from-background/90 via-background/70 to-primary/10 p-6 shadow-sm">
            <legend className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">
              Location Check
            </legend>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">Where do you live currently?</h3>
              <p className="text-sm text-muted-foreground">
                {hasDetectedLocation ? (
                  <>
                    We auto-detected your region as <span className="font-medium text-foreground">{detectedLocationDisplay}</span>. Update it if this looks off.
                  </>
                ) : (
                  <>We&apos;re detecting your region. You can enter your city manually if it doesn&apos;t appear automatically.</>
                )}
              </p>
            </div>
            <div className="rounded-2xl border border-primary/20 bg-background/90 p-4 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">Auto-detected location</p>
                    <p className="text-xs text-muted-foreground">Based on your browser or IP. This field is read-only.</p>
                  </div>
                </div>
                <div className="relative w-full sm:max-w-xs">
                  <Input
                    id="detectedCity"
                    value={detectedLocationDisplay}
                    readOnly
                    className="h-11 rounded-xl border border-transparent bg-primary/10 pr-10 font-medium text-primary shadow-inner"
                    aria-readonly
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-primary/60">
                    <MapPin className="h-4 w-4" aria-hidden />
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="actualCity" className="text-sm font-medium text-foreground">
                Actual city (optional)
              </Label>
              <Input
                id="actualCity"
                placeholder={overridePlaceholder}
                value={actualCityValue}
                onChange={(event) => onChange({ actualCity: event.target.value })}
                disabled={disabled}
                aria-invalid={actualCityInvalid}
                className="h-11 rounded-xl border-border/70 bg-background/95 shadow-sm focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40"
              />
              <p className="text-xs text-muted-foreground">
                Leave blank to keep the detected location. If you change it, include the state name or abbreviation so we can confirm it matches your current state.
              </p>
              {actualCityValue.trim().length > 0 && (
                <p className="text-xs text-primary/80">
                  Make sure the city stays within {stateLabelForDisplay ? stateLabelForDisplay : "the same state you are currently in"}.
                </p>
              )}
              {actualCityInvalid && (
                <p className="text-xs font-medium text-destructive">
                  Please include {stateLabelForDisplay ? stateLabelForDisplay : "your state name or abbreviation"} so we know it&apos;s within your current state.
                </p>
              )}
            </div>

          </fieldset>

          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="householdSize" className="text-sm font-semibold text-foreground">
                  How many people are in your household? (include yourself)
                </Label>
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
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5" aria-hidden />
                  Include everyone who lives with you when determining the household size.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyIncome" className="text-sm font-semibold text-foreground">
                  What is your household&apos;s current monthly income?
                </Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  min={0}
                  step="100"
                  inputMode="decimal"
                  placeholder="Monthly income from the last 30 days"
                  value={data.monthlyIncome}
                  onChange={(event) => onChange({ monthlyIncome: event.target.value })}
                  disabled={disabled}
                  required
                />
                <p className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Info className="mt-0.5 h-3.5 w-3.5" aria-hidden />
                  Please include income from employment (formal or informal) and cash benefits from the last 30 days.
                </p>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-border/70 bg-background/70 p-5 shadow-sm">
              <Label htmlFor="assistanceType" className="text-sm font-semibold text-foreground">
                Are you applying for assistance with past-due rent or moving into a new apartment?
              </Label>
              <div className="relative">
                <select
                  id="assistanceType"
                  value={data.assistanceType}
                  onChange={handleAssistanceTypeChange}
                  className="h-12 w-full appearance-none rounded-xl border border-transparent bg-primary/10 px-4 text-sm font-medium text-primary shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={disabled}
                  required
                >
                  <option value="" disabled>
                    Select support type
                  </option>
                  <option value="pastDue">Past-due rent</option>
                  <option value="moving">New apartment</option>
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

            {data.assistanceType === "pastDue" && (
              <div className="space-y-2 rounded-2xl border border-destructive/40 bg-destructive/5 p-5 text-sm text-destructive" role="alert" aria-live="polite">
                <div className="flex items-start gap-3">
                  <Ban className="mt-0.5 h-5 w-5 flex-none" aria-hidden />
                  <span>
                    We currently cover move-in costs only. Because you selected past-due rent, we have to pause your application. Please check back soon—support for overdue rent is coming.
                  </span>
                </div>
              </div>
            )}

            {isNewApartmentRequest && (
              <fieldset className="space-y-5 rounded-2xl border border-primary/20 bg-background/90 p-6 shadow-sm lg:col-span-2">
                <legend className="px-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">New apartment address</legend>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Share the move-in address so we can match your rental assistance to the correct home.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="newApartmentStreet" className="text-sm font-medium text-foreground">
                      Street address
                    </Label>
                    <Input
                      id="newApartmentStreet"
                      value={newApartmentStreet}
                      onChange={(event) => onChange({ newApartmentStreet: event.target.value })}
                      disabled={disabled}
                      required
                      className="h-11 rounded-xl border-border/70 bg-background/95 shadow-sm focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newApartmentUnit" className="text-sm font-medium text-foreground">
                      Unit, Apt, or Suite (optional)
                    </Label>
                    <Input
                      id="newApartmentUnit"
                      value={newApartmentUnit}
                      onChange={(event) => onChange({ newApartmentUnit: event.target.value })}
                      disabled={disabled}
                      className="h-11 rounded-xl border-border/70 bg-background/95 shadow-sm focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newApartmentCity" className="text-sm font-medium text-foreground">
                      City
                    </Label>
                    <Input
                      id="newApartmentCity"
                      value={newApartmentCity}
                      onChange={(event) => onChange({ newApartmentCity: event.target.value })}
                      disabled={disabled}
                      required
                      className="h-11 rounded-xl border-border/70 bg-background/95 shadow-sm focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newApartmentState" className="text-sm font-medium text-foreground">
                      State
                    </Label>
                    <Input
                      id="newApartmentState"
                      value={newApartmentState}
                      onChange={(event) => onChange({ newApartmentState: event.target.value.toUpperCase() })}
                      disabled={disabled}
                      required
                      maxLength={2}
                      className="h-11 rounded-xl border-border/70 bg-background/95 uppercase shadow-sm focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="newApartmentZip" className="text-sm font-medium text-foreground">
                      ZIP code
                    </Label>
                    <Input
                      id="newApartmentZip"
                      value={newApartmentZip}
                      onChange={(event) => onChange({ newApartmentZip: event.target.value })}
                      disabled={disabled}
                      required
                      inputMode="numeric"
                      aria-invalid={newApartmentZipInvalid}
                      className="h-11 rounded-xl border-border/70 bg-background/95 shadow-sm focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                    {newApartmentZipInvalid && (
                      <p className="text-xs font-medium text-destructive">
                        Please enter a valid 5-digit ZIP code (add the +4 if available).
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newApartmentAddressConfirmation" className="text-sm font-semibold text-foreground">
                    Is this the address where you need rental assistance?
                  </Label>
                  <div className="relative">
                    <select
                      id="newApartmentAddressConfirmation"
                      value={newApartmentAddressConfirmation}
                      onChange={(event) => onChange({ newApartmentAddressConfirmation: event.target.value as EligibilityFormState["newApartmentAddressConfirmation"] })}
                      className="h-11 w-full appearance-none rounded-xl border border-border/70 bg-background/95 px-4 text-sm font-medium text-foreground shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                      disabled={disabled}
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                    <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-primary/50">
                      ▾
                    </span>
                  </div>
                </div>
              </fieldset>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
