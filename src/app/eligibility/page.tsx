import { headers } from "next/headers"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"



export default async function EligibilityPage() {


  return (
    <div className="mx-auto max-w-3xl px-6 pt-28 pb-16 lg:pt-36 lg:pb-24">
      <header className="mb-8 space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Eligibility</h1>
        <p className="text-muted-foreground text-base md:text-lg">
          Review who qualifies, what to prepare, and key details for the Rental Assistance Program.
        </p>
      </header>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Eligibility Criteria</CardTitle>
            <CardDescription>Who can apply to the program</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5">
              <li>Must be a current resident of the state of California.</li>
              <li>Must have an annual income below $80,000.</li>
              <li>Must possess a valid, government-issued ID.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Things to Know</CardTitle>
            <CardDescription>Important program details</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5">
              <li>This program is currently for individuals seeking to move into a new rental unit.</li>
              <li>Assistance for back rent or for your current unit will be available soon.</li>
              <li>This program covers rent payments only. It does not cover security deposits, utilities, pet fees, or any other move-in costs.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documentation Required</CardTitle>
            <CardDescription>Have these ready to speed up your application</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5">
              <li>A valid government-issued ID.</li>
              <li>Recent pay stub(s).</li>
              <li>Bank statements from the last two months.</li>
              <li>Additional documentation may be requested if needed.</li>
            </ul>
          </CardContent>
        </Card>

        <p className="text-muted-foreground text-sm">
          Location awareness: The residency requirement reflects your detected location when available.
        </p>
      </div>
    </div>
  )
}
