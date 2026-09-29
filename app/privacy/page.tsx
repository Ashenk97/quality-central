import type { Metadata } from "next"
import Link from "next/link"

import { Brand } from "@/components/brand"
import { ModeToggle } from "@/components/layout/mode-toggle"

export const metadata: Metadata = {
  title: "Privacy",
}

const CONTACT_EMAIL = "akavinda97@gmail.com"
const LAST_UPDATED = "30 September 2026"

export default function PrivacyPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b pt-[env(safe-area-inset-top,0px)]">
        <div className="flex h-14 items-center justify-between px-4 md:px-8">
          <Brand />
          <ModeToggle />
        </div>
      </header>
      <main
        id="main-content"
        className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 pb-24"
      >
        <article className="grid gap-8 text-sm leading-relaxed text-muted-foreground">
          <div className="space-y-2">
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
              Privacy
            </h1>
            <p>Last updated {LAST_UPDATED}</p>
            <p>
              Quality Central is a free learning project. This page explains
              what it stores about you, who else sees it, and how to have it
              removed.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              What we store
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-foreground">Account:</strong> your
                email address, and your name if you sign in with GitHub.
              </li>
              <li>
                <strong className="text-foreground">Learning progress:</strong>{" "}
                completed lessons, quiz scores, Sandbox results, badges, and
                your daily challenge streak.
              </li>
              <li>
                <strong className="text-foreground">Things you write:</strong>{" "}
                lesson comments and votes, bug reports, feedback, and the mock
                API endpoints you create.
              </li>
              <li>
                <strong className="text-foreground">Usage limits:</strong> how
                many Mock Interviewer answers you have sent today, so the daily
                limit can be applied.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              What other people can see
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Lesson comments are public, together with the name shown on
                the comment.
              </li>
              <li>
                Mock API endpoints you create can be called by anyone who
                knows their URL, so do not put personal data in them.
              </li>
              <li>Everything else is visible only to you.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Services that process your data
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-foreground">Supabase</strong> stores
                your account and everything listed above.
              </li>
              <li>
                <strong className="text-foreground">Vercel</strong> hosts the
                site and keeps standard request logs.
              </li>
              <li>
                <strong className="text-foreground">Vercel AI Gateway</strong>{" "}
                sends your Mock Interviewer answers to an AI model provider to
                generate feedback. Do not include personal details in answers.
              </li>
              <li>
                <strong className="text-foreground">GitHub</strong> shares your
                name and email with us if you choose to sign in with it.
              </li>
            </ul>
            <p>
              We do not sell your data, show ads, or use analytics or
              tracking cookies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Cookies and local storage
            </h2>
            <p>
              The site uses cookies only to keep you signed in, and your
              browser&apos;s local storage to remember progress and settings
              such as the colour theme.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Removing your data
            </h2>
            <p>
              You can clear your progress, quiz scores, Sandbox results, and
              badges at any time with <em>Reset progress</em> on the
              dashboard. To delete your account and everything linked to it,
              email{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-foreground underline underline-offset-4"
              >
                {CONTACT_EMAIL}
              </a>{" "}
              from the address you signed up with.
            </p>
          </section>

          <p>
            <Link
              href="/"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Back to Quality Central
            </Link>
          </p>
        </article>
      </main>
    </div>
  )
}
