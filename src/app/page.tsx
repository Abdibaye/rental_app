import { HeroHeader } from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorksSection from "@/components/HowItWorksSection";
import ContactSection from "@/components/ContactSection";
import { Navbar } from "@/components/ui/resizable-navbar";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar children={<HeroHeader />} />
      <main className="flex-1">
        <Hero />
        <HowItWorksSection />
        {/* Sections will be added in subsequent steps */}
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
