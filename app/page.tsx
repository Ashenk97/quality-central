import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Brand } from "@/components/brand"
import { DifficultyBadge } from "@/components/difficulty-badge"
import { ModeToggle } from "@/components/mode-toggle"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { curriculum, type Difficulty } from "@/lib/curriculum"

const difficultyOrder: Difficulty[] = [
  "beginner",
  "intermediate",
  "advanced",
]

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border/80 bg-background/80 px-4 backdrop-blur-md md:px-8">
        <Brand />
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <ModeToggle />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-4 py-16 md:px-8">
        <section className="relative flex max-w-3xl flex-col gap-6 overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-16 -top-24 h-72 rounded-full bg-[radial-gradient(ellipse_at_top,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_70%)]"
          />
          <Badge
            variant="secondary"
            className="relative w-fit border border-primary/15 bg-primary/10 text-primary"
          >
            Learning hub
          </Badge>
          <h1 className="relative font-heading text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            Zero to Advanced QA Engineering
          </h1>
          <p className="relative max-w-2xl text-lg text-muted-foreground text-pretty">
            Quality Central is a structured path from testing fundamentals to
            API and UI automation, ending in a live sandbox for bug hunting.
            Lesson content is on the way — the routes and workspace are ready.
          </p>
          <div className="relative flex flex-wrap gap-2">
            {difficultyOrder.map((level) => (
              <DifficultyBadge key={level} difficulty={level} />
            ))}
          </div>
          <div className="relative flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/dashboard">
                Enter the hub
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/sandbox">Open The Sandbox</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          {curriculum.map((section) => (
            <Card
              key={section.href}
              className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/5 hover:ring-primary/25"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex size-8 items-center justify-center rounded-lg border border-border/80 bg-muted/60 text-primary transition-colors duration-200 group-hover/card:border-primary/20 group-hover/card:bg-primary/10">
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
              <CardContent>
                <Button variant="outline" size="sm" asChild>
                  <Link href={section.href}>
                    View {section.title}
                    <ArrowRightIcon data-icon="inline-end" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </div>
  )
}
