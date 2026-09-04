"use client"

import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { motion } from "framer-motion"

import { HeroCodeVsUi } from "@/components/landing/hero-code-vs-ui"
import { HeroTyping } from "@/components/landing/hero-typing"
import { DifficultyBadge } from "@/components/difficulty-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Difficulty } from "@/lib/curriculum"

const levels: Difficulty[] = ["beginner", "intermediate", "advanced"]

export function LandingHero() {
  return (
    <section className="relative grid items-center gap-12 overflow-x-clip lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-80 rounded-full bg-[radial-gradient(ellipse_at_top,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_70%)] lg:right-1/3"
      />

      <div className="relative flex flex-col gap-6">
        <Badge
          variant="secondary"
          className="w-fit border border-primary/15 bg-primary/10 font-mono text-[11px] tracking-wide text-primary uppercase"
        >
          QA engineering path
        </Badge>

        <h1 className="font-heading text-5xl leading-[0.95] font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
          Write tests
          <span className="block bg-gradient-to-br from-white via-indigo-100 to-qa-primary bg-clip-text text-transparent light:from-zinc-900 light:via-indigo-800 light:to-qa-primary">
            that survive
          </span>
          production.
        </h1>

        <div className="rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 backdrop-blur-md light:border-black/10 light:bg-white/60">
          <HeroTyping />
        </div>

        <div className="flex flex-wrap gap-2">
          {levels.map((level) => (
            <DifficultyBadge key={level} difficulty={level} />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <motion.div whileTap={{ scale: 0.95 }} className="inline-flex">
            <Link
              href="/dashboard"
              className="qc-gradient-border shadow-[0_0_28px_-8px_color-mix(in_srgb,var(--qa-primary)_70%,transparent)]"
            >
              <span className="relative z-10 inline-flex h-12 items-center gap-2 rounded-[0.68rem] bg-background px-6 font-heading text-sm font-semibold tracking-tight text-foreground">
                Start Learning
                <ArrowRightIcon className="size-4" />
              </span>
            </Link>
          </motion.div>
          <Button variant="outline" size="lg" asChild>
            <Link href="/sandbox">Open The Sandbox</Link>
          </Button>
        </div>
      </div>

      <HeroCodeVsUi />
    </section>
  )
}
