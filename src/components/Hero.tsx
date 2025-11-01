import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CriteriaModalButton from "@/components/CriteriaModalButton";
import { ArrowUpRight, Sparkles } from "lucide-react";
import LocationTitle from "@/components/LocationTitle";

export default function Hero() {

  return (
    <section className="relative isolate overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 pt-28 pb-12 lg:pt-36 lg:pb-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-linear-to-r from-primary/80 via-primary to-primary/80 px-5 py-2 text-sm font-medium text-white/90 shadow-md shadow-primary/25 backdrop-blur dark:border-white/5">
              <Sparkles className="size-4 text-white" />
              <span className="flex flex-wrap items-center gap-2 leading-none text-white/80">
                <span className="text-white">Qualify for up to</span>
                <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-widest text-white shadow-sm shadow-primary/30">
                  1 year
                </span>
                <span className="text-white">rental assistance</span>
                <span className="text-white/60">if approved</span>
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              <LocationTitle defaultRegion="California" />
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Helping qualified applicants cover rent costs quickly and easily.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-linear-to-b from-primary to-primary/90 shadow-md transition-transform hover:shadow-lg active:shadow-sm -translate-y-0.5 hover:-translate-y-1 active:translate-y-0"
              >
                <Link href="apply">Apply Now</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 ring-1 ring-inset ring-black/5 dark:ring-white/10 bg-linear-to-b from-background to-background/90 dark:from-input/40 dark:to-input/60 shadow-sm transition-transform hover:shadow-md -translate-y-0.5 hover:-translate-y-1 active:translate-y-0"
              >
                <Link href={"/eligibility"}>
                  Read Criteria
                  <ArrowUpRight className="ml-2 inline-block size-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative h-64 w-full sm:h-80 md:h-96 lg:h-112">
            <Image
              src="/new_bg3.png"
              alt="People reviewing documents for rental assistance"
              fill
              sizes="(min-width: 1024px) 44rem, (min-width: 768px) 36rem, 100vw"
              className="object-contain drop-shadow-sm"
              priority
            />
          </div>
        </div>
      </div>

      {/* subtle gradient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -z-10 h-[480px] bg-linear-to-b from-slate-50 to-transparent dark:from-slate-900/40"/>
    </section>
  );
}
