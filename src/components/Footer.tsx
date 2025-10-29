import Link from "next/link"
import { Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Contact Us */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-tight">Contact Us</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4" aria-hidden="true" />
                <span>support@staterent.example</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4" aria-hidden="true" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4" aria-hidden="true" />
                <span>123 Main Street, Suite 200, Anytown, USA</span>
              </li>
            </ul>
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
                <Link href="#apply" className="text-muted-foreground hover:text-foreground transition-colors">Apply Now</Link>
              </li>
              <li>
                <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</Link>
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
