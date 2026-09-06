import Link from "next/link"
import { LockIcon } from "lucide-react"

import { Brand } from "@/components/brand"
import { LandingFeatures } from "@/components/landing/landing-features"
import { LandingHero } from "@/components/landing/landing-hero"
import { LandingStats } from "@/components/landing/landing-stats"
import { ModeToggle } from "@/components/layout/mode-toggle"
import { PageTransition } from "@/components/layout/page-transition"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth/session"
import { getAllTopics } from "@/lib/curriculum"

export default async function HomePage() {
  const user = await getCurrentUser()
  const isSignedIn = Boolean(user)
  const lessonCount = getAllTopics().length

  return (
    <div className="relative flex min-h-svh flex-col overflow-x-clip">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-radial-[ellipse_at_top] from-indigo-900/20 via-background to-background light:from-indigo-300/30"
      />

      <header className="sticky top-0 z-20 border-b border-border/80 bg-background/80 pt-[env(safe-area-inset-top,0px)] backdrop-blur-md">
        <div className="flex h-14 min-w-0 items-center justify-between gap-2 px-4 md:px-8">
          <Brand className="min-w-0" />
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            {isSignedIn ? (
              <Button variant="ghost" asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/signup">Create account</Link>
                </Button>
              </>
            )}
            <ModeToggle />
          </div>
        </div>
      </header>

      <PageTransition>
        <main
          id="main-content"
          className="mx-auto flex w-full min-w-0 max-w-7xl flex-1 flex-col gap-20 px-4 py-14 pb-24 md:px-8 md:py-20"
        >
          <LandingHero isSignedIn={isSignedIn} />

          <LandingStats />

          {isSignedIn ? null : (
            <section className="relative overflow-hidden rounded-2xl border border-white/5 bg-black/40 p-8 backdrop-blur-xl light:border-black/5 light:bg-white/70 md:p-12">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 -top-32 h-64 bg-radial-[ellipse_at_center] from-indigo-500/25 to-transparent"
              />
              <div className="relative flex flex-col items-center gap-5 text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground light:border-black/10">
                  <LockIcon className="size-3.5 text-primary" aria-hidden />
                  Free account, no card required
                </span>
                <h2 className="max-w-xl font-heading text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                  Create an account and the whole workspace opens up.
                </h2>
                <p className="max-w-lg text-muted-foreground">
                  All {lessonCount} lessons, the playgrounds, the sandbox, and
                  the capstone certificate, tracked against your progress from
                  the first lesson on.
                </p>
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/signup">Create a free account</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/login">I already have one</Link>
                  </Button>
                </div>
              </div>
            </section>
          )}

          <section id="features" className="flex scroll-mt-20 flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                {isSignedIn
                  ? "What is on your account"
                  : "What you unlock when you sign in"}
              </h2>
              <p className="max-w-2xl text-muted-foreground">
                {isSignedIn
                  ? "All of it is live on your account. The dashboard is the way in."
                  : "There is no half-open version of this. One free account turns on the whole workspace, and your progress follows you to any device you sign in from."}
              </p>
            </div>

            <LandingFeatures />
          </section>


        </main>
      </PageTransition>
    </div>
  )
}
