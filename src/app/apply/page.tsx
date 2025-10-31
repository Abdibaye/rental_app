import { Navbar } from "@/components/ui/resizable-navbar"
import { HeroHeader } from "@/components/Header"
import Footer from "@/components/Footer"
import { MultiStepForm } from "./_components/MultiStepForm"

export default function ApplyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar children={<HeroHeader />} />
      <main className="flex-1">
        <section className="relative">
          {/* <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-24 h-40 w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/20 to-primary/5 blur-3xl" />
            <div className="absolute right-0 bottom-20 h-40 w-[28rem] translate-x-1/3 rounded-full bg-gradient-to-r from-primary/15 to-primary/5 blur-3xl" />
          </div>   */}

          <div className="mx-auto max-w-5xl px-6 py-20 lg:py-24">
            <header className="mb-10 space-y-3 text-center sm:text-left">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/15">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Rental assistance application
              </span>
              <h1 className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
                Let&apos;s get you set up
              </h1>
              <p className="text-muted-foreground text-base md:text-lg">
                A lightweight, guided form broken into focused steps. Save progress automatically and return when you&apos;re ready.
              </p>
            </header>

            <MultiStepForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
