import Link from "next/link"
import { CheckCircle2, Clock, FileText, MailCheck, Tag } from "lucide-react"
import { Navbar } from "@/components/ui/resizable-navbar"
import { HeroHeader } from "@/components/Header"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"

export default async function ApplicationSubmittedPage({ searchParams }: { searchParams: Promise<{ ref?: string | string[] }> }) {
  const params = await searchParams
  const applicationNumber = Array.isArray(params?.ref) ? params.ref[0] : params?.ref
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar children={<HeroHeader />} />
      <main className="flex-1">
        <section className="relative overflow-hidden py-20 sm:py-28">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/3 top-10 h-40 w-[32rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute right-0 bottom-0 h-48 w-[28rem] translate-x-1/4 rounded-full bg-primary/10 blur-3xl" />
          </div>

          <div className="mx-auto max-w-4xl px-6">
            <div className="relative overflow-hidden rounded-[2rem] border border-primary/30 bg-linear-to-br from-background via-background to-primary/10 p-10 shadow-2xl">
              <div aria-hidden className="pointer-events-none absolute inset-x-16 -top-24 h-40 rounded-full bg-primary/20 blur-3xl opacity-60" />

              <div className="relative space-y-10">
                <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <span className="flex size-16 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-inner">
                      <CheckCircle2 className="h-9 w-9" aria-hidden />
                    </span>
                    <div className="space-y-2">
                      <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                        Application received
                      </p>
                      <h1 className="text-pretty text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                        Thanks! Your application is officially in review.
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        We&apos;ll keep the process moving and stay in touch as we verify your details.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {applicationNumber && (
                      <div className="flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary shadow-sm">
                        <Tag className="h-4 w-4" aria-hidden />
                        <span className="font-medium">Application number:</span>
                        <span className="font-semibold tracking-wide">{applicationNumber}</span>
                      </div>
                    )}
                    <div className="rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary shadow-sm">
                      Confirmation sent to the email you provided.
                    </div>
                  </div>
                </header>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-4 rounded-2xl border border-border/60 bg-background/95 p-5 shadow-sm backdrop-blur">
                    <div className="flex items-center gap-3 text-primary">
                      <MailCheck className="h-5 w-5" aria-hidden />
                      <span className="text-sm font-semibold uppercase tracking-widest text-primary">Inbox watch</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Expect an update within <span className="font-medium text-foreground">5 business days</span>. Our message may land in your promotions or spam folder, so give those a peek too.
                    </p>
                  </div>

                  <div className="space-y-4 rounded-2xl border border-border/60 bg-background/95 p-5 shadow-sm backdrop-blur">
                    <div className="flex items-center gap-3 text-primary">
                      <Clock className="h-5 w-5" aria-hidden />
                      <span className="text-sm font-semibold uppercase tracking-widest text-primary">What happens next</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Our eligibility team is reviewing your responses. We&apos;ll reach out shortly with any next steps or questions.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 rounded-2xl border border-primary/40 bg-primary/10 p-6 text-sm shadow-sm">
                  <div className="flex items-center gap-3 text-primary">
                    <FileText className="h-5 w-5" aria-hidden />
                    <span className="text-sm font-semibold uppercase tracking-widest text-primary">Document request</span>
                  </div>
                  <p className="text-muted-foreground">
                    We just sent an email asking for the following uploads to speed up your review: Most recent W2 and Any valid government ID (front & back clear pictures).
                  </p>
                  <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                    <li>Any valid government ID (front & back clear pictures)</li>
                    <li>Three months of recent bank statements</li>
                    <li>Most recent W2</li>
                  </ul>
                  <p className="text-muted-foreground">
                    Reply directly to the message with the attachments whenever you&apos;re ready. You can also add extra context if something has changed.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-muted-foreground">
                    Need to clarify anything else? The contact form is the fastest way to reach the program team.
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Button asChild>
                      <Link href="/#contact">Open contact form</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/">Return home</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
