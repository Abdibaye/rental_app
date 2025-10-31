"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { AddressFormState } from "./types"
import { MapPin, Navigation, Sparkles, Wand2 } from "lucide-react"
import { useEffect } from "react"

export type AddressStepProps = {
  data: AddressFormState
  onChange: (value: Partial<AddressFormState>) => void
  inferredCity?: string
  disabled?: boolean
}

export function AddressStep({ data, onChange, inferredCity, disabled }: AddressStepProps) {
  useEffect(() => {
    if (inferredCity && !data.city.trim()) {
      onChange({ city: inferredCity })
    }
  }, [inferredCity, data.city, onChange])

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <MapPin className="h-3.5 w-3.5" />
          Your location
        </span>
        <h2 className="text-3xl font-semibold tracking-tight">Current address</h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          We pre-fill what we can. Fine-tune details if anything looks off.
        </p>
      </header>

      <Card className="border-none bg-linear-to-br from-background via-background to-primary/5 shadow-xl ring-1 ring-border/60">
        <CardHeader>
          <CardTitle className="text-base">Where you&apos;re staying</CardTitle>
          <CardDescription>
            Provide your current location. This confirms eligibility and helps us coordinate local support.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-3">
            {[{
              icon: Sparkles,
              title: "Smart suggestions",
              description: "Auto-complete kicks in as you type."
            }, {
              icon: Wand2,
              title: "San Francisco ready",
              description: "We pre-set SF when you qualify."
            }, {
              icon: Navigation,
              title: "Map verified",
              description: "We only collect what we need."
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

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="addressLine1">Address line 1</Label>
              <Input
                id="addressLine1"
                value={data.addressLine1}
                onChange={(event) => onChange({ addressLine1: event.target.value })}
                placeholder="123 Mission St"
                disabled={disabled}
                required
                autoComplete="address-line1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit or apartment (optional)</Label>
              <Input
                id="unit"
                value={data.unit}
                onChange={(event) => onChange({ unit: event.target.value })}
                placeholder="Apt 4B"
                disabled={disabled}
                autoComplete="address-line2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={data.city}
                onChange={(event) => onChange({ city: event.target.value })}
                placeholder="San Francisco"
                disabled={disabled}
                required
                autoComplete="address-level2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP code</Label>
              <Input
                id="zipCode"
                value={data.zipCode}
                onChange={(event) => onChange({ zipCode: event.target.value })}
                placeholder="94105"
                disabled={disabled}
                required
                inputMode="numeric"
                autoComplete="postal-code"
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Tip: Type a few characters and we&apos;ll surface matching San Francisco addresses.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
