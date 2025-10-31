"use client"

import { useCallback, useMemo } from "react"
import { useLocalStorage } from "usehooks-ts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowRight, ChevronLeft } from "lucide-react"
import { EligibilityStep } from "./EligibilityStep"
import { ApplicantInformationStep } from "./ApplicantInformationStep"
import {
  MultiStepFormState,
  StepDefinition,
  StepKey,
  EligibilityFormState,
  ApplicantInfoFormState
} from "./types"
import { FormStepper } from "./FormStepper"

const FORM_STORAGE_KEY = "rental-application/form-state-v1"
const STEP_STORAGE_KEY = "rental-application/form-step-v1"

const stepDefinitions: StepDefinition[] = [
  {
    id: "eligibility",
    title: "Overview & Eligibility",
    description: "Screen applicants early with a few quick questions."
  },
  {
    id: "applicantInfo",
    title: "Applicant Info",
    description: "Collect the personal and contact details."
  },
  {
    id: "demographics",
    title: "Demographics",
    description: "Optional race, ethnicity, and gender information."
  },
  {
    id: "address",
    title: "Address",
    description: "Capture the current residence."
  },
  {
    id: "household",
    title: "Household",
    description: "Define the household composition."
  },
  {
    id: "employment",
    title: "Employment",
    description: "Understand the current work situation."
  }
]

const defaultFormState: MultiStepFormState = {
  eligibility: {
    livesInSF: "",
    householdSize: "",
    monthlyIncome: "",
    assistanceType: ""
  },
  applicantInfo: {
    referralSource: "",
    referralNote: "",
    assistanceSince2020: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    pronouns: "",
    phone: "",
    email: ""
  },
  demographics: {
    races: [],
    decline: false
  },
  address: {
    addressLine1: "",
    unit: "",
    city: "",
    zipCode: ""
  },
  household: {
    livingSituation: "",
    members: [],
    hasChanges: "",
    expectingChild: "",
    infants: "",
    children: "",
    teens: "",
    adults: ""
  },
  employment: {
    employed: "",
    employmentType: ""
  }
}

export function MultiStepForm() {
  const [formState, setFormState] = useLocalStorage<MultiStepFormState>(FORM_STORAGE_KEY, defaultFormState)
  const [currentStepIndex, setCurrentStepIndex] = useLocalStorage<number>(STEP_STORAGE_KEY, 0)

  const currentStep = stepDefinitions[currentStepIndex]

  const updateStep = useCallback(<K extends StepKey>(stepKey: K, value: Partial<MultiStepFormState[K]>) => {
    setFormState((prev) => ({
      ...prev,
      [stepKey]: {
        ...prev[stepKey],
        ...value
      }
    }))
  }, [setFormState])

  const goToStep = useCallback((index: number) => {
    setCurrentStepIndex(Math.max(0, Math.min(stepDefinitions.length - 1, index)))
  }, [setCurrentStepIndex])

  const isEligibilityValid = useMemo(() => {
    const values = formState.eligibility
    if (values.livesInSF !== "yes") return false
    if (!values.householdSize.trim()) return false
    if (!values.monthlyIncome.trim()) return false
    if (!values.assistanceType.trim()) return false
    const parsedSize = Number(values.householdSize)
    const parsedIncome = Number(values.monthlyIncome)
    return Number.isFinite(parsedSize) && parsedSize > 0 && Number.isFinite(parsedIncome) && parsedIncome >= 0
  }, [formState.eligibility])

  const isApplicantInfoValid = useMemo(() => {
    const values = formState.applicantInfo
    if (!values.referralSource) return false
    if (values.referralSource === "other" && !values.referralNote.trim()) return false
    if (!values.assistanceSince2020) return false
    if (!values.firstName.trim() || !values.lastName.trim()) return false
    if (!values.dateOfBirth) return false
    if (!values.phone.trim()) return false
    if (!values.email.trim()) return false
    const emailValid = /^\S+@\S+\.\S+$/.test(values.email)
    const phoneValid = /^\+?1?\d{10,15}$/.test(values.phone.replace(/[^0-9+]/g, ""))
    return emailValid && phoneValid
  }, [formState.applicantInfo])

  const isNextDisabled = useMemo(() => {
    if (!currentStep) return true
    switch (currentStep.id) {
      case "eligibility":
        return !isEligibilityValid
      case "applicantInfo":
        return !isApplicantInfoValid
      default:
        return true
    }
  }, [currentStep, isEligibilityValid, isApplicantInfoValid])

  const handleNext = useCallback(() => {
    if (isNextDisabled) return
    goToStep(currentStepIndex + 1)
  }, [currentStepIndex, goToStep, isNextDisabled])

  const handleBack = useCallback(() => {
    goToStep(currentStepIndex - 1)
  }, [currentStepIndex, goToStep])

  const renderStep = useCallback(() => {
    if (!currentStep) return null
    switch (currentStep.id) {
      case "eligibility":
        return (
          <EligibilityStep
            data={formState.eligibility as EligibilityFormState}
            onChange={(value) => updateStep("eligibility", value)}
          />
        )
      case "applicantInfo":
        return (
          <ApplicantInformationStep
            data={formState.applicantInfo as ApplicantInfoFormState}
            onChange={(value) => updateStep("applicantInfo", value)}
          />
        )
      default:
        return (
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">Coming soon</h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Steps {currentStepIndex + 1} to {stepDefinitions.length} will be implemented after your approval.
            </p>
          </div>
        )
    }
  }, [currentStep, currentStepIndex, formState.applicantInfo, formState.eligibility, updateStep])

  return (
    <div className="space-y-6">
      <FormStepper steps={stepDefinitions} activeIndex={currentStepIndex} />

      <Card className="border-none bg-gradient-to-br from-background via-background to-primary/10 shadow-xl backdrop-blur-sm ring-1 ring-border/60">
        <CardHeader className="border-b border-border/60 bg-background/60 backdrop-blur-sm">
          <CardTitle className="text-lg font-semibold text-foreground">{currentStep?.title}</CardTitle>
          {currentStep?.description && (
            <CardDescription className="max-w-2xl text-sm text-muted-foreground">
              {currentStep.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-8 p-6 sm:p-10">
          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 data-[active=true]:opacity-100" data-active={true} aria-hidden />
            <div className="space-y-8 transition-opacity duration-300" key={currentStep?.id}>
              {renderStep()}
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background/60 px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold uppercase text-primary">
                i
              </span>
              Progress saves automatically. You can leave and return anytime.
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStepIndex === 0}
                className="group gap-2 transition duration-300 hover:-translate-y-0.5"
              >
                <ChevronLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" aria-hidden />
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={isNextDisabled}
                className="group gap-2 bg-gradient-to-r from-primary to-primary/80 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:hover:translate-y-0"
              >
                {currentStepIndex >= stepDefinitions.length - 1 ? "Finish" : "Next"}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
