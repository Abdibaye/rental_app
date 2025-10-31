import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Navbar } from "@/components/ui/resizable-navbar"
import { HeroHeader } from "@/components/Header"
import Footer from "@/components/Footer"
import { CheckCircle2, Info, FileText } from "lucide-react"
import LocationRegion from "@/components/LocationRegion"



export default function EligibilityPage() {


  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar children={<HeroHeader />} />
      <main className="relative flex-1 overflow-hidden">
        {/* Decorative background */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-24 h-40 w-xl -translate-x-1/2 rounded-full bg-linear-to-r from-primary/20 to-primary/5 blur-3xl" />
          <div className="absolute -right-24 bottom-20 h-40 w-md rounded-full bg-linear-to-r from-primary/10 to-primary/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-3xl px-6 pt-28 pb-16 lg:pt-36 lg:pb-24">
          <header className="mb-8 space-y-3 text-center sm:text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/15">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Program details
            </span>
            <h1 className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
              Eligibility
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Review who qualifies, what to prepare, and key details for the Rental Assistance Program.
            </p>
          </header>

          <div className="space-y-6">
            <Card className="fade-in-up transition-all duration-300 hover:shadow-md hover:ring-1 hover:ring-primary/30" style={{ animationDelay: "80ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Eligibility Criteria
                </CardTitle>
                <CardDescription>Who can apply to the program</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-primary" />
                    <span>
                      Must be a current resident of the state of <LocationRegion defaultRegion="California" />.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-primary" />
                    <span>Must have an annual income below $80,000.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-primary" />
                    <span>Must possess a valid, government-issued ID.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="fade-in-up transition-all duration-300 hover:shadow-md hover:ring-1 hover:ring-primary/30" style={{ animationDelay: "160ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Things to Know
                </CardTitle>
                <CardDescription>Important program details</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Info className="mt-0.5 h-5 w-5 flex-none text-primary" />
                    <span>This program is currently for individuals seeking to move into a new rental unit.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Info className="mt-0.5 h-5 w-5 flex-none text-primary" />
                    <span>Assistance for back rent or for your current unit will be available soon.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Info className="mt-0.5 h-5 w-5 flex-none text-primary" />
                    <span>This program covers rent payments only. It does not cover security deposits, utilities, pet fees, or any other move-in costs.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="fade-in-up transition-all duration-300 hover:shadow-md hover:ring-1 hover:ring-primary/30" style={{ animationDelay: "240ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Documentation Required
                </CardTitle>
                <CardDescription>Have these ready to speed up your application</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <FileText className="mt-0.5 h-5 w-5 flex-none text-primary" />
                    <span>A valid government-issued ID.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FileText className="mt-0.5 h-5 w-5 flex-none text-primary" />
                    <span>Recent pay stub(s).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FileText className="mt-0.5 h-5 w-5 flex-none text-primary" />
                    <span>Bank statements from the last two months.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FileText className="mt-0.5 h-5 w-5 flex-none text-primary" />
                    <span>Additional documentation may be requested if needed.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <p className="fade-in-up text-muted-foreground text-sm" style={{ animationDelay: "320ms" }}>
              Location awareness: The residency requirement reflects your detected location when available.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
