import Link from "next/link"
import { LockIcon } from "lucide-react"

import { Brand } from "@/components/brand"
import { DifficultyBadge } from "@/components/difficulty-badge"
import { LandingHero } from "@/components/landing/landing-hero"
import { ModeToggle } from "@/components/layout/mode-toggle"
import { PageTransition } from "@/components/layout/page-transition"
import { StaggerItem, StaggerList } from "@/components/stagger-list"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getCurrentUser } from "@/lib/auth/session"
import { curriculum } from "@/lib/curriculum"
import { cn } from "@/lib/utils"

// Bento layout: each row of the 6-column grid adds up to 6.
const bentoSpan: Record<string, string> = {
  "/dashboard": "lg:col-span-3",
  "/foundation": "lg:col-span-3",
  "/next-gen": "lg:col-span-6",
}

export default async function HomePage() {
  const user = await getCurrentUser()
  const isSignedIn = Boolean(user)

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
          className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-20 px-4 py-14 pb-24 md:px-8 md:py-20"
        >
          <LandingHero isSignedIn={isSignedIn} />

          <section id="curriculum" className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                The curriculum
              </h2>
              <p className="max-w-2xl text-muted-foreground">
                {isSignedIn
                  ? "Every track is unlocked on your account. Jump back in from the dashboard."
                  : "Nine tracks from manual QA fundamentals to Playwright automation and AI-assisted testing. Create a free account to unlock them and track your progress."}
              </p>
            </div>

            <StaggerList className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              {curriculum.map((section) => (
                <StaggerItem
                  key={section.href}
                  className={cn(
                    "h-full",
                    bentoSpan[section.href] ?? "lg:col-span-2"
                  )}
                >
                  <Card className="h-full border-white/5 bg-black/40 backdrop-blur-xl hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-[0_0_45px_-12px_rgb(99_102_241_/_0.5)] light:border-black/5 light:bg-white/70">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-primary transition-colors duration-300 group-hover/card:border-indigo-500/30 group-hover/card:bg-indigo-500/10 light:border-black/10 light:bg-black/5">
                            <section.icon className="size-4" />
                          </span>
                          <CardTitle>{section.title}</CardTitle>
                        </div>
                        {section.difficulty ? (
                          <DifficultyBadge difficulty={section.difficulty} />
                        ) : (
                          <Badge variant="outline">Overview</Badge>
                        )}
                      </div>
                      <CardDescription>{section.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerList>

            {isSignedIn ? null : (
              <div className="flex flex-col items-start gap-4 rounded-xl border border-white/5 bg-black/40 p-6 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between light:border-black/5 light:bg-white/70">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <LockIcon className="size-4 shrink-0 text-primary" aria-hidden />
                  Sign in to unlock every track, the sandbox, and your progress.
                </p>
                <Button asChild>
                  <Link href="/signup">Create a free account</Link>
                </Button>
              </div>
            )}
          </section>
        </main>
      </PageTransition>
    </div>
  )
}
