import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import CriteriaModalButton from "@/components/CriteriaModalButton";





export default async function Hero() {

  const title = `California Rental Assistance Program`;

  return (
    <section className="relative isolate overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 pt-28 pb-12 lg:pt-36 lg:pb-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {title}
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Helping qualified applicants cover rent costs quickly and easily.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="#apply">Apply Now</Link>
              </Button>
              <CriteriaModalButton />
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
