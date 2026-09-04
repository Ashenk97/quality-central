"use client"

import { useEffect, useState, useSyncExternalStore } from "react"

import { cn } from "@/lib/utils"

export const HERO_SCRIPT = "expect(QA_Skills).toBe('Advanced');"

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

function subscribeToMotionPreference(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

// This component renders a different number of characters depending on the
// motion preference, which the server cannot know. Reading it through
// useSyncExternalStore makes hydration reuse the server value, so the first
// client render matches and the real preference lands in the pass after it.
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToMotionPreference,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false
  )
}

function tokenClass(index: number) {
  if (index < 6) {
    return "text-indigo-300"
  }
  if (index < 17) {
    return "text-zinc-100"
  }
  if (index < 22) {
    return "text-sky-300"
  }
  if (index < 34) {
    return "text-emerald-400"
  }
  return "text-zinc-500"
}

export function HeroTyping({
  className,
}: {
  className?: string
}) {
  const reduceMotion = usePrefersReducedMotion()
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (reduceMotion) {
      return
    }

    if (count >= HERO_SCRIPT.length) {
      const pause = window.setTimeout(() => setCount(0), 2200)
      return () => window.clearTimeout(pause)
    }

    const tick = window.setTimeout(
      () => setCount((current) => current + 1),
      count === 0 ? 420 : 52
    )
    return () => window.clearTimeout(tick)
  }, [count, reduceMotion])

  const visible = reduceMotion ? HERO_SCRIPT.length : count

  return (
    <p
      aria-label={HERO_SCRIPT}
      className={cn(
        "flex min-h-8 flex-wrap items-center font-mono text-sm sm:text-base",
        className
      )}
    >
      <span aria-hidden className="text-zinc-500">
        {"> "}
      </span>
      <span aria-hidden>
        {HERO_SCRIPT.split("").slice(0, visible).map((char, index) => (
          <span key={`${char}-${index}`} className={tokenClass(index)}>
            {char}
          </span>
        ))}
      </span>
      <span
        aria-hidden
        className="ml-0.5 inline-block h-4 w-[2px] translate-y-px bg-qa-primary sm:h-5"
        style={{
          animation: reduceMotion
            ? undefined
            : "qc-caret-blink 1s step-end infinite",
        }}
      />
    </p>
  )
}
