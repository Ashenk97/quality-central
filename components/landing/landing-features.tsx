import type { ReactNode } from "react"
import {
  AwardIcon,
  BugIcon,
  FlameIcon,
  LayoutDashboardIcon,
  MessagesSquareIcon,
  NetworkIcon,
  TerminalIcon,
  type LucideIcon,
} from "lucide-react"

import { MAX_SANDBOX_POINTS, SANDBOX_DEFECTS } from "@/lib/sandbox-defects"
import { cn } from "@/lib/utils"

function Panel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        // A shared height keeps the headings below each preview on one line
        // across a row of cards.
        "min-h-32 min-w-0 rounded-xl border border-white/5 bg-black/30 p-4 light:border-black/5 light:bg-white/60",
        className
      )}
    >
      {children}
    </div>
  )
}

function Ring({ value }: { value: number }) {
  const circumference = 2 * Math.PI * 22

  return (
    <div className="relative size-16 shrink-0">
      <svg viewBox="0 0 56 56" className="size-full -rotate-90">
        <circle
          cx="28"
          cy="28"
          r="22"
          fill="none"
          strokeWidth="5"
          className="stroke-white/10 light:stroke-black/10"
        />
        <circle
          cx="28"
          cy="28"
          r="22"
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - value / 100)}
          className="stroke-primary"
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-sm font-semibold">
        {value}%
      </span>
    </div>
  )
}

function ProgressPreview() {
  const tracks = [
    { label: "Foundation", value: 100 },
    { label: "API testing", value: 75 },
    { label: "UI automation", value: 40 },
  ]

  return (
    <Panel className="flex items-center gap-4">
      <Ring value={68} />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {tracks.map((track) => (
          <div key={track.label} className="flex flex-col gap-1">
            <span className="truncate text-[10px] text-muted-foreground">
              {track.label}
            </span>
            <span className="h-1.5 overflow-hidden rounded-full bg-white/10 light:bg-black/10">
              <span
                className="block h-full rounded-full bg-primary/80"
                style={{ width: `${track.value}%` }}
              />
            </span>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function SkillTreePreview() {
  const nodes = [
    { label: "Foundation", state: "done" },
    { label: "API", state: "done" },
    { label: "Automation", state: "locked" },
  ] as const

  return (
    <Panel className="flex items-center gap-1.5">
      {nodes.map((node, index) => (
        <div
          key={node.label}
          className={cn("flex min-w-0 items-center gap-1.5", index > 0 && "flex-1")}
        >
          {index > 0 ? (
            <span
              aria-hidden
              className="h-px flex-1 bg-white/15 light:bg-black/15"
            />
          ) : null}
          <span
            className={cn(
              "truncate rounded-full border px-2 py-1 text-[10px] font-medium",
              node.state === "done"
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-white/10 text-muted-foreground light:border-black/10"
            )}
          >
            {node.label}
          </span>
        </div>
      ))}
    </Panel>
  )
}

function DailyChallengePreview() {
  const options = [
    { label: "getByRole('button')", correct: true },
    { label: ".btn:nth-child(3)", correct: false },
  ]

  return (
    <Panel className="flex flex-col justify-center gap-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-[10px] text-muted-foreground">
          Which locator survives a re-render?
        </span>
        <span className="flex shrink-0 items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-300">
          <FlameIcon className="size-3" aria-hidden />4
        </span>
      </div>
      {options.map((option) => (
        <span
          key={option.label}
          className={cn(
            "truncate rounded-lg border px-2 py-1.5 font-mono text-[10px]",
            option.correct
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
              : "border-white/10 text-muted-foreground light:border-black/10"
          )}
        >
          {option.label}
        </span>
      ))}
    </Panel>
  )
}

function SandboxPreview() {
  return (
    <Panel className="flex flex-col justify-center gap-2">
      <span className="text-[10px] text-muted-foreground">
        Severity, steps, expected vs actual
      </span>
      <span className="truncate rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-muted-foreground light:border-black/10 light:bg-black/5">
        What did you expect to happen?
      </span>
      <div className="flex items-center gap-1.5">
        <span className="rounded-full border border-rose-500/40 bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-600 dark:text-rose-300">
          High
        </span>
        <span className="truncate rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-muted-foreground light:border-black/10">
          {SANDBOX_DEFECTS.length} seeded · {MAX_SANDBOX_POINTS} pts
        </span>
      </div>
    </Panel>
  )
}

function PlaygroundPreview() {
  const calls = [
    { method: "GET", status: 200, ok: true },
    { method: "POST", status: 500, ok: false },
  ]

  return (
    <Panel className="flex flex-col justify-center gap-2 font-mono text-[10px]">
      {calls.map((call) => (
        <div key={call.method} className="flex items-center gap-2">
          <span className="shrink-0 rounded border border-white/10 px-1.5 py-0.5 font-medium light:border-black/10">
            {call.method}
          </span>
          <span className="truncate text-muted-foreground">
            /api/playground
          </span>
          <span
            className={cn(
              "ml-auto shrink-0 rounded px-1.5 py-0.5 font-medium",
              call.ok
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
                : "bg-rose-500/15 text-rose-600 dark:text-rose-300"
            )}
          >
            {call.status}
          </span>
        </div>
      ))}
    </Panel>
  )
}

function MockInterviewPreview() {
  return (
    <Panel className="flex flex-col justify-center gap-2">
      <span className="max-w-[85%] truncate rounded-lg rounded-bl-sm border border-white/10 bg-white/5 px-2 py-1.5 text-[10px] light:border-black/10 light:bg-black/5">
        How would you triage a flaky login test?
      </span>
      <span className="ml-auto max-w-[85%] truncate rounded-lg rounded-br-sm bg-primary/15 px-2 py-1.5 text-[10px] text-primary">
        I&apos;d isolate the wait, then check state…
      </span>
    </Panel>
  )
}

function CertificatePreview() {
  return (
    <Panel className="flex items-center gap-3">
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 rounded-lg border border-primary/20 bg-primary/5 p-3">
        <span className="text-[9px] tracking-[0.2em] text-primary uppercase">
          Quality Central
        </span>
        <span className="truncate text-[10px] font-medium">
          Certificate of Completion
        </span>
        <span className="h-px w-full bg-white/10 light:bg-black/10" />
        <span className="text-[9px] text-muted-foreground">
          Capstone sprint · verified
        </span>
      </div>
      <span className="grid size-10 shrink-0 place-items-center rounded-full border border-primary/30 bg-primary/10 text-primary">
        <AwardIcon className="size-5" aria-hidden />
      </span>
    </Panel>
  )
}

type Feature = {
  title: string
  description: string
  icon: LucideIcon
  span: string
  preview: ReactNode
}

const features: Feature[] = [
  {
    title: "Your progress dashboard",
    description:
      "Every lesson you finish moves a ring. Pick up exactly where you stopped, on any device you sign in from.",
    icon: LayoutDashboardIcon,
    span: "lg:col-span-3",
    preview: <ProgressPreview />,
  },
  {
    title: "A skill tree that gates itself",
    description:
      "Foundation feeds API and SQL, then automation. Later nodes stay locked until you clear the track before them.",
    icon: NetworkIcon,
    span: "lg:col-span-3",
    preview: <SkillTreePreview />,
  },
  {
    title: "Daily challenge",
    description:
      "One quick-fire scenario a day, same prompt until midnight. Answer it to keep your streak alive.",
    icon: FlameIcon,
    span: "lg:col-span-2",
    preview: <DailyChallengePreview />,
  },
  {
    title: "The Sandbox",
    description: `A deliberately broken storefront with ${SANDBOX_DEFECTS.length} planted defects. Find them, file a real bug report, score the write-up.`,
    icon: BugIcon,
    span: "lg:col-span-2",
    preview: <SandboxPreview />,
  },
  {
    title: "Live playgrounds",
    description:
      "Fire real requests at a dummy API, host your own mock endpoints, and run Playwright selectors in the browser.",
    icon: TerminalIcon,
    span: "lg:col-span-2",
    preview: <PlaygroundPreview />,
  },
  {
    title: "AI mock interviewer",
    description:
      "Answer QA interview questions in your own words and get feedback on what a hiring manager would still be missing.",
    icon: MessagesSquareIcon,
    span: "lg:col-span-3",
    preview: <MockInterviewPreview />,
  },
  {
    title: "Capstone and certificate",
    description:
      "Close it out with a full sprint simulation, then print a certificate that names the tracks you actually finished.",
    icon: AwardIcon,
    span: "lg:col-span-3",
    preview: <CertificatePreview />,
  },
]

export function LandingFeatures() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
      {features.map((feature) => (
        <article
          key={feature.title}
          className={cn(
            "group/card flex min-w-0 flex-col gap-4 rounded-xl border border-white/5 bg-black/40 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-[0_0_45px_-12px_rgb(99_102_241_/_0.5)] light:border-black/5 light:bg-white/70",
            feature.span
          )}
        >
          {feature.preview}
          <div className="flex flex-col gap-2">
            <h3 className="flex items-center gap-2 font-heading font-semibold tracking-tight">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-primary transition-colors duration-300 group-hover/card:border-indigo-500/30 group-hover/card:bg-indigo-500/10 light:border-black/10 light:bg-black/5">
                <feature.icon className="size-4" aria-hidden />
              </span>
              {feature.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        </article>
      ))}
    </div>
  )
}
