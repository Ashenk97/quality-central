"use client"

import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { motion } from "framer-motion"

import { HeroTestRunner } from "@/components/landing/hero-test-runner"
import { HeroTyping } from "@/components/landing/hero-typing"
import { DifficultyBadge } from "@/components/difficulty-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Difficulty } from "@/lib/curriculum"

const levels: Difficulty[] = ["beginner", "intermediate", "advanced"]

export function LandingHero({ isSignedIn = false }: { isSignedIn?: boolean }) {
  return (
    <section className="relative grid items-center gap-14 overflow-x-clip lg:grid-cols-2 lg:gap-12">
      <div className="relative flex min-w-0 flex-col gap-7">
        <Badge
          variant="secondary"
          className="w-fit border border-primary/15 bg-primary/10 font-mono text-[11px] tracking-wide text-primary uppercase"
        >
          QA engineering path
        </Badge>

        <h1 className="font-heading text-5xl leading-tight font-bold tracking-tighter text-balance sm:text-6xl lg:text-7xl">
          <span className="bg-gradient-to-br from-white via-indigo-50 to-indigo-300/80 bg-clip-text text-transparent light:from-zinc-900 light:via-zinc-800 light:to-indigo-700">
            Write tests that survive production.
          </span>
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
              href={isSignedIn ? "/dashboard" : "/signup"}
              className="qc-gradient-border shadow-[0_0_28px_-8px_color-mix(in_srgb,var(--qa-primary)_70%,transparent)]"
            >
              <span className="relative z-10 inline-flex h-12 items-center gap-2 rounded-[0.68rem] bg-background px-6 font-heading text-sm font-semibold tracking-tight text-foreground">
                {isSignedIn ? "Go to Dashboard" : "Start Learning Free"}
                <ArrowRightIcon className="size-4" />
              </span>
            </Link>
          </motion.div>
          <Button variant="outline" size="lg" asChild>
            <Link href="#curriculum">Explore the curriculum</Link>
          </Button>
        </div>
      </div>

      <HeroTestRunner />
    </section>
  )
}
