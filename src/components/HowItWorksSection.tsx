"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"
import { CheckCircle2, FileText, Upload, BadgeCheck } from "lucide-react"

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
    description: "Upload ID (front/back) plus your most recent W2.",
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
    <section id="how-it-works" className={cn("relative mt-12 py-20", className)}>
      {/* Ambient gradient glow background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center"
      >
        <div className="h-44 w-[56rem] rounded-full bg-gradient-to-b from-primary/25 to-transparent blur-3xl opacity-30 dark:opacity-40" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-balance text-center text-3xl font-semibold tracking-tight sm:text-4xl">
          <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent dark:from-white dark:to-white/70">
            How it works
          </span>
        </h2>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 16 },
            show: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.08, delayChildren: 0.05 },
            },
          }}
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8"
        >
          {steps.map(({ title, description, Icon }, idx) => (
            <motion.article
              key={idx}
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="h-full"
            >
              <Card
                className="group relative h-full overflow-hidden rounded-2xl border border-border/60 bg-card/70 text-card-foreground shadow-sm backdrop-blur-md transition-all duration-300"
              >
                {/* Hover halo */}
                <div className="pointer-events-none absolute inset-px -z-10 rounded-[calc(theme(borderRadius.xl)+2px)] bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 text-accent-foreground ring-1 ring-border/70 transition-colors group-hover:from-primary/25 group-hover:to-accent/20">
                      <Icon className="size-5 text-foreground/90 dark:text-white" aria-hidden="true" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground">Step {idx + 1}</div>
                      <h3 className="text-base font-semibold leading-6 tracking-tight">{title}</h3>
                      <p className="text-sm leading-6 text-muted-foreground">{description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
