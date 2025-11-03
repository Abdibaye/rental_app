import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Contact CTA */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-tight">Need support?</h3>
            <p className="text-sm text-muted-foreground">
              We&apos;re a free service, so the quickest way to reach the team is through our contact form. Drop us a note and we&apos;ll follow up soon.
            </p>
            <Link
              href="/#contact"
              className="inline-flex w-fit items-center justify-center rounded-full border border-primary/40 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
            >
              Open contact form
            </Link>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-tight">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/eligibility" className="text-muted-foreground hover:text-foreground transition-colors">Eligibility</Link>
              </li>
              <li>
                <Link href="/#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact form</Link>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-tight">Follow Us</h3>
            <div className="flex items-center gap-3">
              <Link aria-label="Facebook" href="#" className="rounded-full border p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <Facebook className="size-4" />
              </Link>
              <Link aria-label="Twitter" href="#" className="rounded-full border p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <Twitter className="size-4" />
              </Link>
              <Link aria-label="Instagram" href="#" className="rounded-full border p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <Instagram className="size-4" />
              </Link>
              <Link aria-label="LinkedIn" href="#" className="rounded-full border p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <Linkedin className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto max-w-6xl px-6 py-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} StateRent Assistance. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
