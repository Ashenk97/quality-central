"use client"

import { useMemo } from "react"
import Link from "next/link"
import { BugIcon, MonitorPlayIcon, SparklesIcon, WandSparklesIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  FEATURED_BADGES,
  isBadgeEarned,
  type BadgeDefinition,
} from "@/lib/badges"
import {
  countResolvedDefects,
  resolveCatalog,
  type CatalogFilterId,
  type ModuleStatus,
  type TrackSummary,
} from "@/lib/catalog"
import { useProgress } from "@/lib/progress"
import { cn } from "@/lib/utils"

type TreeNode = {
  id: CatalogFilterId
  label: string
  x: number
  y: number
}

const TREE_NODES: TreeNode[] = [
  { id: "foundation", label: "Foundation", x: 50, y: 10 },
  { id: "api-testing", label: "API", x: 22, y: 34 },
  { id: "technical-core", label: "SQL", x: 78, y: 34 },
  { id: "ui-automation", label: "Automation", x: 50, y: 54 },
  { id: "sandbox", label: "Sandbox", x: 18, y: 74 },
  { id: "interview-prep", label: "Interview", x: 82, y: 74 },
  { id: "capstone", label: "Capstone", x: 50, y: 88 },
  { id: "next-gen", label: "Next-Gen", x: 50, y: 98 },
]

const TREE_EDGES: [CatalogFilterId, CatalogFilterId][] = [
  ["foundation", "api-testing"],
  ["foundation", "technical-core"],
  ["api-testing", "ui-automation"],
  ["technical-core", "ui-automation"],
  ["ui-automation", "sandbox"],
  ["ui-automation", "interview-prep"],
  ["sandbox", "capstone"],
  ["interview-prep", "capstone"],
  ["capstone", "next-gen"],
]

function nodeById(id: CatalogFilterId) {
  return TREE_NODES.find((node) => node.id === id)
}

function featuredIcon(badge: BadgeDefinition) {
  if (badge.id === "bug-hunter") {
    return BugIcon
  }
  if (badge.id === "api-wizard") {
    return WandSparklesIcon
  }
  if (badge.id === "automation-apprentice") {
    return MonitorPlayIcon
  }
  return SparklesIcon
}

export function SkillTree() {
  const {
    ready,
    isComplete,
    getQuizScore,
    isSandboxBugResolved,
    getSandboxPoints,
  } = useProgress()
  const sandboxResolved = countResolvedDefects(isSandboxBugResolved)

  const { tracks } = useMemo(
    () =>
      resolveCatalog({
        isComplete,
        getQuizScore,
        sandboxResolved,
        sandboxPoints: getSandboxPoints(),
      }),
    [getQuizScore, getSandboxPoints, isComplete, sandboxResolved]
  )

  const trackMap = useMemo(() => {
    const map = new Map<CatalogFilterId, TrackSummary>()
    for (const track of tracks) {
      map.set(track.filterId, track)
    }
    return map
  }, [tracks])

  return (
    <Card className="overflow-visible">
      <CardHeader>
        <CardTitle className="font-heading">Skill tree</CardTitle>
        <CardDescription>
          Foundation feeds API and SQL, then Automation. Locked nodes stay
          greyed until you finish the previous track.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-3">
          {FEATURED_BADGES.map((badge) => {
            const earned =
              ready &&
              isBadgeEarned(badge, {
                isComplete,
                getQuizScore,
                isSandboxBugResolved,
                getSandboxPoints,
              })
            const Icon = featuredIcon(badge)
            return (
              <div
                key={badge.id}
                className={cn(
                  "rounded-xl border px-3 py-3 transition-all duration-300",
                  earned
                    ? "border-success/40 bg-success/10 shadow-[0_0_20px_color-mix(in_oklch,var(--success)_35%,transparent)]"
                    : "border-border/70 bg-muted/30 grayscale"
                )}
              >
                <div className="flex items-start gap-2">
                  <Icon
                    className={cn(
                      "mt-0.5 size-4 shrink-0",
                      earned ? "text-success" : "text-muted-foreground"
                    )}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{badge.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {badge.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="relative mx-auto aspect-[4/5] w-full max-w-xl">
          <svg
            viewBox="0 0 100 108"
            className="absolute inset-0 size-full"
            aria-hidden
          >
            {TREE_EDGES.map(([from, to]) => {
              const start = nodeById(from)
              const end = nodeById(to)
              const fromTrack = trackMap.get(from)
              const toTrack = trackMap.get(to)
              if (!start || !end) {
                return null
              }
              const bothComplete =
                fromTrack?.status === "completed" &&
                toTrack?.status === "completed"
              const lit = Boolean(fromTrack?.unlocked && toTrack?.unlocked)
              return (
                <line
                  key={`${from}-${to}`}
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  className={cn(
                    bothComplete
                      ? "stroke-success"
                      : lit
                        ? "stroke-primary"
                        : "stroke-muted-foreground/25"
                  )}
                  strokeWidth={bothComplete || lit ? 0.7 : 0.45}
                />
              )
            })}
          </svg>

          {TREE_NODES.map((node) => {
            const track = trackMap.get(node.id)
            const status: ModuleStatus = track?.status ?? "locked"
            const unlocked = track?.unlocked ?? false
            return (
              <SkillNode
                key={node.id}
                node={node}
                href={track?.href ?? "/dashboard"}
                status={ready ? status : "locked"}
                unlocked={ready ? unlocked : false}
                percent={ready ? (track?.percent ?? 0) : 0}
              />
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function SkillNode({
  node,
  href,
  status,
  unlocked,
  percent,
}: {
  node: TreeNode
  href: string
  status: ModuleStatus
  unlocked: boolean
  percent: number
}) {
  const complete = status === "completed"
  const active = unlocked && !complete

  return (
    <Link
      href={href}
      aria-disabled={!unlocked}
      aria-label={`${node.label}, ${complete ? "mastered" : unlocked ? `${percent} percent` : "locked"}`}
      tabIndex={unlocked ? 0 : -1}
      className={cn(
        "absolute flex size-[4.5rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border text-center no-underline transition-all duration-300",
        complete &&
          "border-success/60 bg-success/15 text-foreground shadow-[0_0_28px_color-mix(in_oklch,var(--success)_50%,transparent)]",
        active &&
          "border-primary/70 bg-primary/15 text-foreground shadow-[0_0_28px_color-mix(in_oklch,var(--primary)_55%,transparent)]",
        !unlocked &&
          "pointer-events-none border-border/60 bg-muted/40 text-muted-foreground grayscale blur-[1.5px] opacity-70"
      )}
      style={{ left: `${node.x}%`, top: `${node.y}%` }}
    >
      <span className="px-1 text-[11px] leading-tight font-medium">
        {node.label}
      </span>
      <Badge
        variant={complete ? "success" : active ? "default" : "outline"}
        className="mt-1 h-4 px-1.5 text-[9px]"
      >
        {complete ? "Mastered" : unlocked ? `${percent}%` : "Locked"}
      </Badge>
    </Link>
  )
}
