import { HeroHeader } from "@/components/Header";
import Hero from "@/components/Hero";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <HeroHeader />
      <main className="flex-1">
        <Hero />
        {/* Sections will be added in subsequent steps */}
      </main>
    </div>
  )
}
