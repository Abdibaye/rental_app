"use client"

import { useCallback, useMemo, useState } from "react"
import { useLocalStorage } from "usehooks-ts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowRight, Check, CheckCircle2, ChevronLeft, ShieldCheck, Sparkles, X } from "lucide-react"
import { EligibilityStep } from "./EligibilityStep"
import { ApplicantInformationStep } from "./ApplicantInformationStep"
import { DemographicsStep } from "./DemographicsStep"
import { AddressStep } from "./AddressStep"
import { HouseholdStep } from "./HouseholdStep"
import { EmploymentStep } from "./EmploymentStep"
import {
  MultiStepFormState,
  StepDefinition,
  StepKey,
  EligibilityFormState,
  ApplicantInfoFormState,
  DemographicsFormState,
  AddressFormState,
  HouseholdFormState,
  EmploymentFormState
} from "./types"
import { FormStepper } from "./FormStepper"
import BasicModal from "@/components/smoothui/ui/BasicModal"

const FORM_STORAGE_KEY = "rental-application/form-state-v1"
const STEP_STORAGE_KEY = "rental-application/form-step-v1"
const APPROVAL_STORAGE_KEY = "rental-application/form-approval-v1"

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
    assistanceType: "",
    detectedCity: "",
    detectedRegion: "",
    detectedRegionCode: "",
    actualCity: "",
    newApartmentStreet: "",
    newApartmentUnit: "",
    newApartmentCity: "",
    newApartmentState: "",
    newApartmentZip: "",
    newApartmentAddressConfirmation: ""
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
    employmentType: "",
    occupation: "",
    employerName: "",
    selfEmploymentDescription: "",
    previousOccupation: "",
    previousEmployer: ""
  }
}

export function MultiStepForm() {
  const [formState, setFormState] = useLocalStorage<MultiStepFormState>(FORM_STORAGE_KEY, defaultFormState)
  const [currentStepIndex, setCurrentStepIndex] = useLocalStorage<number>(STEP_STORAGE_KEY, 0)
  const [approvalGranted, setApprovalGranted] = useLocalStorage<boolean>(APPROVAL_STORAGE_KEY, false)
  const [approvalPromptOpen, setApprovalPromptOpen] = useState(false)
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false)

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
    if (!values.livesInSF) return false
    if (!values.householdSize.trim()) return false
    if (!values.monthlyIncome.trim()) return false
    if (!values.assistanceType.trim()) return false
    if (values.assistanceType === "pastDue") return false
    if (values.assistanceType === "moving") {
      const street = (values.newApartmentStreet ?? "").trim()
      const city = (values.newApartmentCity ?? "").trim()
      const state = (values.newApartmentState ?? "").trim()
      const zip = (values.newApartmentZip ?? "").trim()
      const confirmation = values.newApartmentAddressConfirmation ?? ""
      if (!street || !city || !state || !zip) return false
      if (!/^\d{5}(?:-\d{4})?$/.test(zip)) return false
      if (!confirmation) return false
    }
    const actualCity = (values.actualCity ?? "").trim()
    const detectedState = (values.detectedRegion || values.detectedRegionCode || "").trim().toLowerCase()
    const detectedStateCode = (values.detectedRegionCode || "").trim().toLowerCase()
    if (actualCity && detectedState) {
      const actualLower = actualCity.toLowerCase()
      const matchesStateName = detectedState && actualLower.includes(detectedState)
      const matchesStateCode = detectedStateCode ? new RegExp(`\\b${detectedStateCode}\\b`).test(actualLower) : false
      if (!matchesStateName && !matchesStateCode) return false
    }
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

  const isAddressValid = useMemo(() => {
    const values = formState.address
    if (!values.addressLine1.trim()) return false
    if (!values.city.trim()) return false
    if (!values.zipCode.trim()) return false
    return /^\d{5}(?:-\d{4})?$/.test(values.zipCode.trim())
  }, [formState.address])

  const isHouseholdValid = useMemo(() => {
    const values = formState.household
    if (!values.livingSituation) return false
    if (!values.hasChanges) return false
    if (!values.expectingChild) return false
    const counts = [values.infants, values.children, values.teens, values.adults]
    return counts.every((entry) => entry === "" || Number(entry) >= 0)
  }, [formState.household])

  const isEmploymentValid = useMemo(() => {
    const values = formState.employment
    if (!values.employed) return false
    if (values.employed === "yes") {
      if (!values.employmentType) return false
      const occupation = (values.occupation ?? "").trim()
      const employer = (values.employerName ?? "").trim()
      if (!occupation || !employer) return false
      const description = (values.selfEmploymentDescription ?? "").trim()
      if ((values.employmentType === "selfEmployed" || values.employmentType === "businessOwner") && !description) {
        return false
      }
    }
    if (values.employed === "no") {
      const previousOccupation = (values.previousOccupation ?? "").trim()
      const previousEmployer = (values.previousEmployer ?? "").trim()
      if (!previousOccupation || !previousEmployer) {
        return false
      }
    }
    return true
  }, [formState.employment])

  const isNextDisabled = useMemo(() => {
    if (!currentStep) return true
    switch (currentStep.id) {
      case "eligibility":
        return !isEligibilityValid
      case "applicantInfo":
        return !isApplicantInfoValid
      case "demographics":
        return false
      case "address":
        return !isAddressValid
      case "household":
        return !isHouseholdValid
      case "employment":
        return !isEmploymentValid
      default:
        return true
    }
  }, [currentStep, isEligibilityValid, isApplicantInfoValid, isAddressValid, isHouseholdValid, isEmploymentValid])

  const handleNext = useCallback(() => {
    if (isNextDisabled) return
    if (currentStep?.id === "applicantInfo" && !approvalGranted) {
      setApprovalPromptOpen(true)
      return
    }
    if (currentStepIndex >= stepDefinitions.length - 1) {
      setSubmissionModalOpen(true)
      setFormState(defaultFormState)
      setCurrentStepIndex(0)
      setApprovalGranted(false)
      return
    }
    goToStep(currentStepIndex + 1)
  }, [approvalGranted, currentStep?.id, currentStepIndex, goToStep, isNextDisabled, setApprovalGranted, setCurrentStepIndex, setFormState, setSubmissionModalOpen])

  const handleBack = useCallback(() => {
    goToStep(currentStepIndex - 1)
  }, [currentStepIndex, goToStep])

  const handleApprovalDecline = useCallback(() => {
    setApprovalPromptOpen(false)
  }, [])

  const handleApprovalConfirm = useCallback(() => {
    setApprovalGranted(true)
    setApprovalPromptOpen(false)
    goToStep(currentStepIndex + 1)
  }, [currentStepIndex, goToStep, setApprovalGranted])

  const handleCloseSubmissionModal = useCallback(() => {
    setSubmissionModalOpen(false)
  }, [])

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
      case "demographics":
        return (
          <DemographicsStep
            data={formState.demographics as DemographicsFormState}
            onChange={(value) => updateStep("demographics", value)}
          />
        )
      case "address":
        return (
          <AddressStep
            data={formState.address as AddressFormState}
            onChange={(value) => updateStep("address", value)}
            inferredCity={formState.eligibility.livesInSF === "yes" ? "San Francisco" : undefined}
          />
        )
      case "household":
        return (
          <HouseholdStep
            data={formState.household as HouseholdFormState}
            onChange={(value) => updateStep("household", value)}
          />
        )
      case "employment":
        return (
          <EmploymentStep
            data={formState.employment as EmploymentFormState}
            onChange={(value) => updateStep("employment", value)}
          />
        )
      default:
        return null
    }
  }, [currentStep, formState.address, formState.applicantInfo, formState.demographics, formState.eligibility.livesInSF, formState.employment, formState.household, updateStep])

  return (
    <div className="space-y-6">
      <FormStepper steps={stepDefinitions} activeIndex={currentStepIndex} />

      <Card className="border-none bg-linear-to-br from-background via-background to-primary/10 shadow-xl backdrop-blur-sm ring-1 ring-border/60">
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
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 data-[active=true]:opacity-100" data-active={true} aria-hidden />
            <div className="space-y-8 transition-opacity duration-300" key={currentStep?.id}>
              {renderStep()}
            </div>
            {approvalPromptOpen && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <div className="max-w-sm space-y-4 rounded-3xl border border-primary/30 bg-background/95 p-6 text-center shadow-xl">
                  <span className="inline-flex items-center justify-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                    Confirm next steps
                  </span>
                  <h3 className="text-xl font-semibold text-foreground">Ready to move forward?</h3>
                  <p className="text-sm text-muted-foreground">
                    Steps 3–6 capture sensitive household details. Please approve before we reveal them.
                  </p>
                  <div className="flex items-center justify-center gap-4 pt-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
                      Progress stays saved
                    </span>
                  </div>
                  <div className="flex justify-center gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleApprovalDecline}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" aria-hidden />
                      Keep reviewing
                    </Button>
                    <Button
                      type="button"
                      onClick={handleApprovalConfirm}
                      className="gap-2 bg-linear-to-br from-primary to-primary/80"
                    >
                      Approve &amp; continue
                      <Check className="h-4 w-4" aria-hidden />
                    </Button>
                  </div>
                </div>
              </div>
            )}
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
                className="group gap-2 from-primary to-primary/80 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:hover:translate-y-0"
              >
                {currentStepIndex >= stepDefinitions.length - 1 ? "Finish" : "Next"}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <BasicModal
        isOpen={submissionModalOpen}
        onClose={handleCloseSubmissionModal}
        title="Application submitted"
        size="md"
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="h-10 w-10" aria-hidden />
          </div>
          <div className="space-y-1">
            <h4 className="text-xl font-semibold text-foreground">Thank you!</h4>
            <p className="text-sm text-muted-foreground">
              Your application has been submitted. Our team will review the details and follow up shortly.
            </p>
          </div>
          <Button onClick={handleCloseSubmissionModal} className="px-6">
            Close
          </Button>
        </div>
      </BasicModal>
    </div>
  )
}
