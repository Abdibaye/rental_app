import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CriteriaModalButton from "@/components/CriteriaModalButton";
import { ArrowUpRight } from "lucide-react";
import LocationTitle from "@/components/LocationTitle";

export default function Hero() {

  return (
    <section className="relative isolate overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 pt-28 pb-12 lg:pt-36 lg:pb-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="space-y-6">
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
                <Link href="#apply">Apply Now</Link>
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
