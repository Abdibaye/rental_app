"use client"

import { useMemo, useState } from "react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { CheckCircle2, Loader2, Mail, Send } from "lucide-react"

type FormState = {
  name: string
  email: string
  subject: string
  message: string
  honeypot: string
}

const baseField =
  "block w-full rounded-xl border border-border/60 bg-background/70 px-4 py-3 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-ring/60 focus:ring-2 focus:ring-ring/30 dark:bg-input/30 backdrop-blur supports-[backdrop-filter]:bg-background/60"

export default function ContactSection({ className }: { className?: string }) {
  const [data, setData] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
    honeypot: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<null | string>(null)
  const [error, setError] = useState<null | string>(null)

  const isValidEmail = useMemo(() =>
    /^\S+@\S+\.\S+$/.test(data.email.trim())
  , [data.email])

  const canSubmit =
    data.name.trim().length > 1 &&
    isValidEmail &&
    data.subject.trim().length > 1 &&
    data.message.trim().length > 5 &&
  !data.honeypot &&
    !loading

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to send message")
      setSuccess("Thanks! We’ll get back to you shortly.")
  setData({ name: "", email: "", subject: "", message: "", honeypot: "" })
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className={cn("relative py-24", className)}>
      {/* Ambient gradient glow */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center">
        <div className="h-52 w-[60rem] rounded-full bg-gradient-to-b from-primary/25 to-transparent blur-3xl opacity-30 dark:opacity-40" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl"
        >
          <header className="mb-8 text-center">
            <p className="mx-auto mb-2 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground shadow-xs backdrop-blur">
              <Mail className="size-3.5" />
              Contact us
            </p>
            <h2 className="text-pretty text-3xl font-semibold tracking-tight sm:text-4xl">
              We’d love to hear from you
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Questions, feedback, or partnership ideas—drop us a line.
            </p>
          </header>

          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-card/60 sm:p-8"
          >
            {/* Hover halo */}
            <div aria-hidden className="pointer-events-none absolute inset-px -z-10 rounded-[calc(theme(borderRadius.xl)+6px)] bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  className={baseField}
                  placeholder="Theodore James"
                  value={data.name}
                  onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={cn(baseField, !isValidEmail && data.email ? "aria-[invalid=true]:border-destructive" : "")}
                  placeholder="Theodore@example.com"
                  value={data.email}
                  onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
                  aria-invalid={data.email.length > 0 && !isValidEmail}
                  required
                />
              </div>
            </div>

            <input
              tabIndex={-1}
              aria-hidden
              id="company"
              name="company"
              type="text"
              autoComplete="off"
              className="hidden"
              value={data.honeypot}
              onChange={(e) => setData((d) => ({ ...d, honeypot: e.target.value }))}
            />

            <div className="mt-5 space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <input
                id="subject"
                name="subject"
                type="text"
                className={baseField}
                placeholder="How can we help?"
                value={data.subject}
                onChange={(e) => setData((d) => ({ ...d, subject: e.target.value }))}
                required
              />
            </div>

            <div className="mt-5 space-y-2">
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className={cn(baseField, "min-h-32 resize-y leading-6")}
                placeholder="Write your message…"
                value={data.message}
                onChange={(e) => setData((d) => ({ ...d, message: e.target.value }))}
                required
              />
            </div>

            {/* Status */}
            <div className="mt-4 min-h-6">
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              {success && (
                <p className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-4" /> {success}
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button type="reset" variant="ghost" onClick={() => setData({ name: "", email: "", subject: "", message: "", honeypot: "" })}>
                Clear
              </Button>
              <Button type="submit" disabled={!canSubmit} className="px-6">
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    <Send className="size-4" /> Send message
                  </>
                )}
              </Button>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </section>
  )
}
