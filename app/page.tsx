import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

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
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { curriculum } from "@/lib/curriculum"

export default function HomePage() {
  return (
    <PageTransition>
      <div className="flex min-h-svh flex-col">
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

        <main
          id="main-content"
          className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 px-4 py-14 pb-24 md:px-8 md:py-20"
        >
          <LandingHero />

          <StaggerList className="grid gap-4 sm:grid-cols-2">
            {curriculum.map((section) => (
              <StaggerItem key={section.href} className="h-full">
                <Card interactive className="h-full">
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
              </StaggerItem>
            ))}
          </StaggerList>
        </main>
      </div>
    </PageTransition>
  )
}
