"use client"

import { useEffect, useState } from "react"
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion"

import { cn } from "@/lib/utils"

const LOGS = [
  { id: "boot", text: "Executing route transition...", pass: false },
  { id: "mdx", text: "[PASS] Fetching MDX content", pass: true },
  { id: "ui", text: "[PASS] Compiling UI components", pass: true },
  { id: "session", text: "[PASS] Validating session state", pass: true },
  { id: "progress", text: "[PASS] Hydrating progress store", pass: true },
  { id: "done", text: "Suite passed — revealing route", pass: false },
] as const

export function RouteLoading({
  fullScreen = false,
}: {
  fullScreen?: boolean
}) {
  const reduceMotion = useReducedMotion()
  const [visibleCount, setVisibleCount] = useState(reduceMotion ? LOGS.length : 1)
  const progress = useMotionValue(reduceMotion ? 100 : 0)
  const [percent, setPercent] = useState(reduceMotion ? 100 : 0)

  useMotionValueEvent(progress, "change", (value) => {
    setPercent(Math.round(value))
  })

  useEffect(() => {
    if (reduceMotion) {
      return
    }

    const controls = animate(progress, 100, {
      duration: 0.92,
      ease: [0.22, 1, 0.36, 1],
    })

    let index = 1
    const logTimer = window.setInterval(() => {
      index += 1
      setVisibleCount((current) => Math.min(LOGS.length, current + 1))
      if (index >= LOGS.length) {
        window.clearInterval(logTimer)
      }
    }, 95)

    return () => {
      controls.stop()
      window.clearInterval(logTimer)
    }
  }, [progress, reduceMotion])

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Running route test suite"
      className={cn(
        "flex w-full items-center justify-center p-4",
        fullScreen ? "min-h-svh" : "min-h-[min(28rem,70svh)]"
      )}
    >
      <div className="w-full max-w-xl overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0A] shadow-[0_0_48px_-18px_color-mix(in_srgb,var(--qa-primary)_40%,transparent)]">
        <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
          <span className="size-2.5 rounded-full bg-qa-bug/80" />
          <span className="size-2.5 rounded-full bg-amber-400/80" />
          <span className="size-2.5 rounded-full bg-qa-success/80" />
          <span className="ml-2 truncate font-mono text-[11px] tracking-wide text-zinc-500">
            npx playwright test route-transition.spec.ts
          </span>
        </div>

        <div className="min-h-48 space-y-1.5 px-4 py-4 font-mono text-[13px] leading-6 sm:text-sm">
          {LOGS.slice(0, visibleCount).map((line) => (
            <motion.p
              key={line.id}
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.16 }}
              className="text-zinc-300"
            >
              <span className="text-zinc-600">{"> "}</span>
              {line.pass ? (
                <>
                  <span className="font-semibold text-qa-success">[PASS]</span>
                  <span>{` ${line.text.replace("[PASS] ", "")}`}</span>
                </>
              ) : (
                line.text
              )}
            </motion.p>
          ))}
          {visibleCount < LOGS.length ? (
            <p className="text-qa-primary">
              <span className="inline-block h-3.5 w-[2px] animate-pulse bg-qa-primary" />
            </p>
          ) : null}
        </div>

        <div className="space-y-2 border-t border-white/10 px-4 py-3">
          <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500">
            <span>Coverage</span>
            <span className="tabular-nums text-qa-success">{percent}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-qa-success shadow-[0_0_16px_color-mix(in_srgb,var(--qa-success)_80%,transparent)]"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
      <span className="sr-only">Loading next page</span>
    </div>
  )
}
