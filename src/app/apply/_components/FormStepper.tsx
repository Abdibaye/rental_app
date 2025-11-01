"use client"

import { StepDefinition } from "./types"
import { cn } from "@/lib/utils"
import { Briefcase, Home, MapPin, Users, User, UserPlus } from "lucide-react"

export type FormStepperProps = {
  steps: StepDefinition[]
  activeIndex: number
}

export function FormStepper({ steps, activeIndex }: FormStepperProps) {
  const progress = Math.max(0, Math.min(1, (activeIndex + 1) / steps.length)) * 100
  const icons = [Home, User, Users, MapPin, UserPlus, Briefcase]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <span>Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all"
          style={{ width: `${progress}%` }}
          aria-hidden
        />
      </div>
      <ol className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {steps.map((step, index) => {
          const isActive = index === activeIndex
          const isComplete = index < activeIndex
          const Icon = icons[index] ?? Home

          return (
            <li
              key={step.id}
              className={cn(
                "group rounded-2xl border border-dashed px-3 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground transition duration-300",
                "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md",
                isComplete && "border-primary/40 bg-primary/5 text-primary",
                isActive && "border-primary bg-primary/10 text-primary shadow-lg"
              )}
            >
              <span className="mb-1 flex items-center gap-2 text-[11px] font-semibold text-muted-foreground/80 sm:text-xs">
                <Icon className={cn(
                  "h-3.5 w-3.5 transition",
                  isComplete || isActive ? "text-primary" : "text-muted-foreground/70"
                )} aria-hidden />
                Step {index + 1}
              </span>
              <span className="block truncate text-sm font-medium text-foreground">{step.title}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
