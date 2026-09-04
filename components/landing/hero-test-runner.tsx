"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"

type RunLine =
  | { kind: "command"; text: string }
  | { kind: "info"; text: string }
  | { kind: "retry"; browser: string; spec: string }
  | {
      kind: "result"
      status: "pass" | "fail"
      browser: string
      spec: string
      title: string
      time: string
    }
  | { kind: "summary"; text: string; time: string }

const RUN: RunLine[] = [
  { kind: "command", text: "npx playwright test" },
  { kind: "info", text: "Running 42 tests using 4 workers" },
  {
    kind: "result",
    status: "pass",
    browser: "chromium",
    spec: "foundation/login.spec.ts",
    title: "empty password",
    time: "412ms",
  },
  {
    kind: "result",
    status: "pass",
    browser: "chromium",
    spec: "foundation/test-design.spec.ts",
    title: "boundaries",
    time: "318ms",
  },
  {
    kind: "result",
    status: "pass",
    browser: "chromium",
    spec: "api/status-codes.spec.ts",
    title: "401 without a token",
    time: "204ms",
  },
  {
    kind: "result",
    status: "fail",
    browser: "webkit",
    spec: "checkout/discount.spec.ts",
    title: "SAVE20 applies",
    time: "1.2s",
  },
  { kind: "retry", browser: "webkit", spec: "checkout/discount.spec.ts" },
  {
    kind: "result",
    status: "pass",
    browser: "webkit",
    spec: "checkout/discount.spec.ts",
    title: "SAVE20 applies",
    time: "864ms",
  },
  {
    kind: "result",
    status: "pass",
    browser: "firefox",
    spec: "ui/locators.spec.ts",
    title: "roles over CSS",
    time: "287ms",
  },
  {
    kind: "result",
    status: "pass",
    browser: "firefox",
    spec: "capstone/regression.spec.ts",
    title: "sprint flow",
    time: "1.1s",
  },
  { kind: "summary", text: "42 passed", time: "18.4s" },
]

const VISIBLE_LINES = 7
const LINE_DELAY = 420

function lineAt(index: number) {
  return RUN[((index % RUN.length) + RUN.length) % RUN.length]
}

function LineContent({ line }: { line: RunLine }) {
  if (line.kind === "command") {
    return (
      <>
        <span className="text-qa-success">$ </span>
        <span className="text-zinc-200">{line.text}</span>
      </>
    )
  }

  if (line.kind === "info") {
    return <span className="text-zinc-500">{line.text}</span>
  }

  if (line.kind === "retry") {
    return (
      <>
        <span className="text-amber-400/90">{"\u21ba"} Retry #1</span>{" "}
        <span className="text-amber-200/70">[{line.browser}]</span>{" "}
        <span className="text-zinc-500">{line.spec}</span>
      </>
    )
  }

  if (line.kind === "summary") {
    return (
      <>
        <span className="text-qa-success">
          {"\u2714"} {line.text}
        </span>
        <span className="text-zinc-600"> ({line.time})</span>
      </>
    )
  }

  const passed = line.status === "pass"

  return (
    <>
      <span className={passed ? "text-qa-success" : "text-qa-bug"}>
        {passed ? "\u2714" : "\u2718"}
      </span>{" "}
      <span className="text-indigo-300">[{line.browser}]</span>{" "}
      <span className="text-zinc-600">{"\u203a"}</span>{" "}
      <span className="text-zinc-300">{line.spec}</span>{" "}
      <span className="text-zinc-600">{"\u203a"}</span>{" "}
      <span className={passed ? "text-zinc-400" : "text-rose-300"}>
        {line.title}
      </span>{" "}
      <span className="text-zinc-600">({line.time})</span>
    </>
  )
}

export function HeroTestRunner() {
  const reduceMotion = useReducedMotion()
  // `head` is the absolute index of the newest line; the viewport always shows
  // the last VISIBLE_LINES so the terminal never renders half-empty.
  const [head, setHead] = useState(VISIBLE_LINES - 1)

  useEffect(() => {
    if (reduceMotion) {
      return
    }

    const tick = window.setInterval(
      () => setHead((current) => current + 1),
      LINE_DELAY
    )
    return () => window.clearInterval(tick)
  }, [reduceMotion])

  const visible = Array.from({ length: VISIBLE_LINES }, (_, offset) => {
    const index = head - VISIBLE_LINES + 1 + offset
    return { index, line: lineAt(index) }
  })

  const cyclePosition = ((head % RUN.length) + RUN.length) % RUN.length
  const running = lineAt(head).kind !== "summary"
  const passedSoFar = RUN.slice(0, cyclePosition + 1).filter(
    (line) => line.kind === "result" && line.status === "pass"
  ).length

  return (
    <div
      aria-hidden
      className="relative mx-auto w-full min-w-0 max-w-xl lg:max-w-none"
    >
      <div className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-qa-primary/15 blur-[80px]" />

      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0E0E12] shadow-[0_0_70px_-18px_rgb(99_102_241_/_0.55),0_24px_60px_-30px_rgb(0_0_0_/_0.9)]">
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-3 py-2.5">
          <span className="size-2.5 rounded-full bg-[#FF5F57]" />
          <span className="size-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="size-2.5 rounded-full bg-[#28C840]" />
          <span className="ml-2 truncate font-mono text-[11px] tracking-wide text-zinc-500">
            playwright — test runner
          </span>
        </div>

        <div className="h-[13.5rem] overflow-hidden px-3 py-3 font-mono text-[11px] leading-6">
          {visible.map(({ index, line }) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.22, ease: "easeOut" }
              }
              className="truncate"
            >
              <LineContent line={line} />
            </motion.div>
          ))}

          <div className="text-qa-primary">{"\u2588"}</div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-white/[0.02] px-3 py-2 font-mono text-[10px] text-zinc-500">
          <span className="truncate">
            {running ? "Running…" : "Run complete"} · 4 workers
          </span>
          <span className="flex shrink-0 items-center gap-2">
            <span className="text-qa-success">{passedSoFar} passed</span>
            <span className="hidden text-zinc-700 sm:inline">|</span>
            <span className="hidden text-zinc-500 sm:inline">
              chromium · firefox · webkit
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}
