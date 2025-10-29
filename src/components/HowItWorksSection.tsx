import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  CheckCircle2,
  FileText,
  Upload,
  BadgeCheck,
} from "lucide-react"

type Step = {
  title: string
  description: string
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const steps: Step[] = [
  {
    title: "Check Eligibility",
    description: "Confirm you meet the basic requirements to apply.",
    Icon: CheckCircle2,
  },
  {
    title: "Fill Application Form",
    description: "Complete a short form with your personal details.",
    Icon: FileText,
  },
  {
    title: "Submit Documents",
    description: "Upload ID, income proof, and bank statements.",
    Icon: Upload,
  },
  {
    title: "Receive Assistance Approval",
    description: "We review quickly and notify you of the decision.",
    Icon: BadgeCheck,
  },
]

export default function HowItWorksSection({ className }: { className?: string }) {
  return (
    <section id="how-it-works" className={cn("py-16 mt-12", className)}>
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          How It Works
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map(({ title, description, Icon }, idx) => (
            <Card
              key={idx}
              className="group h-full rounded-xl border bg-card/60 text-card-foreground transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground transition-colors group-hover:bg-accent/90">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold leading-6">{title}</h3>
                    <p className="text-sm font-normal text-muted-foreground leading-6">
                      {description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
