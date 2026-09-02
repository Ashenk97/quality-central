import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Brand } from "@/components/brand"
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
import { curriculum } from "@/lib/curriculum"

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex h-14 items-center justify-between border-b px-4 md:px-8">
        <Brand />
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <ModeToggle />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-4 py-16 md:px-8">
        <section className="flex max-w-3xl flex-col gap-6">
          <Badge variant="secondary" className="w-fit">
            Learning hub
          </Badge>
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            Zero to Advanced QA Engineering
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground text-pretty">
            Quality Central is a structured path from testing fundamentals to
            API and UI automation, ending in a live sandbox for bug hunting.
            Lesson content is on the way — the routes and workspace are ready.
          </p>
          <div className="flex flex-wrap gap-3">
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
            <Card key={section.href}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <section.icon className="size-4 text-muted-foreground" />
                  <CardTitle>{section.title}</CardTitle>
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
