"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { CheckIcon } from "lucide-react"

import { StaggerItem, StaggerList } from "@/components/stagger-list"
import { ProMemberBadge } from "@/components/pro-member-badge"
import { DailyChallenge } from "@/components/DailyChallenge"
import { MockInterviewer } from "@/components/MockInterviewer"
import { SkillTree } from "@/components/SkillTree"
import { CatalogFilterTabs } from "@/components/catalog/catalog-tabs"
import { ModuleGrid } from "@/components/catalog/module-card"
import { DifficultyBadge } from "@/components/difficulty-badge"
import { RadialProgress, SuccessBar } from "@/components/progress-visuals"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  countResolvedDefects,
  resolveCatalog,
  statusLabel,
  type CatalogFilterId,
} from "@/lib/catalog"
import { getAllTopics, parseCourseHref } from "@/lib/curriculum"
import { useProgress } from "@/lib/progress"
import {
  MAX_SANDBOX_POINTS,
  SANDBOX_DEFECTS,
} from "@/lib/sandbox-defects"
import { cn } from "@/lib/utils"

export function DashboardProgress({
  isProMember = false,
}: {
  isProMember?: boolean
}) {
  const {
    ready,
    isComplete,
    getQuizScore,
    source,
    syncError,
    isSandboxBugResolved,
    getSandboxPoints,
  } = useProgress()
  const [filter, setFilter] = useState<CatalogFilterId | "all">("all")
  const sandboxResolved = countResolvedDefects(isSandboxBugResolved)

  const { modules, tracks } = useMemo(
    () =>
      resolveCatalog({
        isComplete,
        getQuizScore,
        sandboxResolved,
        sandboxPoints: getSandboxPoints(),
      }),
    [getQuizScore, getSandboxPoints, isComplete, sandboxResolved]
  )

  const lessons = getAllTopics()
  const completedCount = lessons.filter((topic) => {
    const parsed = parseCourseHref(topic.href)
    return parsed ? isComplete(parsed.category, parsed.lessonId) : false
  }).length
  const overall =
    lessons.length === 0
      ? 0
      : Math.round((completedCount / lessons.length) * 100)
  const quizScores = lessons
    .map((topic) => {
      const parsed = parseCourseHref(topic.href)
      return parsed ? getQuizScore(parsed.category, parsed.lessonId) : null
    })
    .filter((score): score is number => score != null)
  const averageQuiz =
    quizScores.length === 0
      ? 0
      : Math.round(
          quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length
        )
  const tracksComplete = tracks.filter(
    (track) => track.filterId !== "sandbox" && track.status === "completed"
  ).length
  const lessonTracks = tracks.filter((track) => track.filterId !== "sandbox")
  const sandboxPoints = getSandboxPoints()
  const sandboxPercent = Math.round(
    (sandboxPoints / MAX_SANDBOX_POINTS) * 100
  )

  const persistenceHint = syncError
    ? "Supabase sync failed; showing locally cached progress."
    : source === "supabase"
      ? "Progress and quiz scores are loaded from your account."
      : "Progress is stored in this browser. Sign in to sync across devices."

  const visibleModules =
    filter === "all"
      ? modules
      : modules.filter((module) => module.filterId === filter)

  return (
    <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-8 -top-10 h-48 rounded-full bg-[radial-gradient(ellipse_at_top,color-mix(in_oklch,var(--success)_16%,transparent),transparent_70%)]"
      />

      <div className="relative space-y-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Dashboard
          </h1>
          {isProMember ? <ProMemberBadge /> : null}
        </div>
        <p className="text-muted-foreground">{persistenceHint}</p>
      </div>

      <DailyChallenge />
      <SkillTree />
      <MockInterviewer />

      <div className="relative grid gap-4 lg:grid-cols-4 sm:grid-cols-2">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardDescription>Overall progress</CardDescription>
            <CardTitle className="font-heading">Learning path</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <RadialProgress
              value={ready ? overall : 0}
              size={128}
              strokeWidth={10}
              label="Overall learning progress"
            />
            <SuccessBar
              value={ready ? overall : 0}
              label="Overall learning progress"
            />
            <p className="text-center text-xs text-muted-foreground">
              {ready
                ? `${completedCount} / ${lessons.length} lessons complete`
                : "Loading progress…"}
            </p>
          </CardContent>
        </Card>

        <StatRingCard
          label="Path tracks"
          value={ready ? `${tracksComplete} / ${lessonTracks.length}` : "—"}
          percent={
            ready && lessonTracks.length > 0
              ? Math.round((tracksComplete / lessonTracks.length) * 100)
              : 0
          }
          hint="Foundation through Interview, plus Capstone"
        />
        <StatRingCard
          label="Average quiz"
          value={
            ready
              ? quizScores.length === 0
                ? "—"
                : `${averageQuiz}%`
              : "—"
          }
          percent={ready ? averageQuiz : 0}
          hint={
            quizScores.length === 0
              ? "No quizzes submitted yet"
              : `${quizScores.length} scored ${quizScores.length === 1 ? "quiz" : "quizzes"}`
          }
        />
        <StatRingCard
          label="Sandbox hunter"
          value={ready ? `${sandboxPoints} / ${MAX_SANDBOX_POINTS}` : "—"}
          percent={ready ? sandboxPercent : 0}
          hint={
            ready
              ? `${sandboxResolved} / ${SANDBOX_DEFECTS.length} defects verified`
              : "Loading sandbox finds…"
          }
        />
      </div>

      <StaggerList className="grid gap-4 lg:grid-cols-4 sm:grid-cols-2">
        {tracks.map((track) => (
          <StaggerItem key={track.filterId} className="h-full">
          <button
            type="button"
            aria-pressed={filter === track.filterId}
            onClick={() => setFilter(track.filterId)}
            className="h-full w-full text-left"
          >
            <Card
              interactive
              className={cn(
                "h-full",
                filter === track.filterId && "border-qa-primary/50"
              )}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <track.icon className="size-4 text-success" />
                    <CardTitle>{track.title}</CardTitle>
                  </div>
                  {track.difficulty ? (
                    <DifficultyBadge difficulty={track.difficulty} />
                  ) : null}
                </div>
                <CardDescription>{track.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <RadialProgress
                  value={ready ? track.percent : 0}
                  size={72}
                  strokeWidth={7}
                  label={`${track.title} progress`}
                />
                <div className="min-w-0 space-y-2">
                  <Badge
                    variant={
                      track.status === "completed"
                        ? "success"
                        : track.status === "locked"
                          ? "outline"
                          : "secondary"
                    }
                  >
                    {ready ? statusLabel(track.status, "lesson") : "…"}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {ready
                      ? `${track.done} / ${track.total}`
                      : "Loading…"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </button>
          </StaggerItem>
        ))}
      </StaggerList>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CatalogFilterTabs value={filter} onChange={setFilter} />
          <StatusLegend />
        </div>
        {ready ? (
          <ModuleGrid modules={visibleModules} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-52 rounded-xl" />
            ))}
          </div>
        )}
      </div>

      <SandboxHunterCard
        ready={ready}
        points={sandboxPoints}
        resolvedCount={sandboxResolved}
        isResolved={isSandboxBugResolved}
      />
    </div>
  )
}

function StatRingCard({
  label,
  value,
  percent,
  hint,
}: {
  label: string
  value: string
  percent: number
  hint: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="font-mono text-2xl">{value}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3">
        <RadialProgress value={percent} size={88} strokeWidth={8} label={label} />
        <SuccessBar value={percent} label={label} />
        <p className="text-center text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  )
}

function StatusLegend() {
  return (
    <ul className="flex flex-wrap gap-3 text-xs text-muted-foreground">
      <li className="flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-success" />
        Completed
      </li>
      <li className="flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-primary" />
        In progress
      </li>
      <li className="flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-muted-foreground/40" />
        Locked
      </li>
    </ul>
  )
}

function SandboxHunterCard({
  ready,
  points,
  resolvedCount,
  isResolved,
}: {
  ready: boolean
  points: number
  resolvedCount: number
  isResolved: (bugId: (typeof SANDBOX_DEFECTS)[number]["id"]) => boolean
}) {
  const complete = resolvedCount === SANDBOX_DEFECTS.length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Sandbox hunter</CardTitle>
            <CardDescription>
              {ready
                ? `${resolvedCount} / ${SANDBOX_DEFECTS.length} seeded defects verified`
                : "Loading sandbox finds…"}
            </CardDescription>
          </div>
          <Badge variant={complete ? "success" : "warning"}>
            {ready ? `${points} / ${MAX_SANDBOX_POINTS} pts` : "…"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <SuccessBar
          value={ready ? (points / MAX_SANDBOX_POINTS) * 100 : 0}
          label="Sandbox hunter progress"
        />
        <ul className="grid gap-2 sm:grid-cols-3">
          {SANDBOX_DEFECTS.map((defect) => {
            const resolved = ready && isResolved(defect.id)
            return (
              <li key={defect.id}>
                {resolved ? (
                  <Badge
                    variant="success"
                    className="h-auto gap-1 py-1 whitespace-normal"
                  >
                    <CheckIcon data-icon="inline-start" aria-hidden />
                    Bug Resolved · {defect.title}
                  </Badge>
                ) : (
                  <Badge
                    variant="warning"
                    className="h-auto py-1 whitespace-normal"
                  >
                    Undiscovered defect
                  </Badge>
                )}
              </li>
            )
          })}
        </ul>
        <p className="text-xs text-muted-foreground">
          File matching reports from{" "}
          <Link
            href="/sandbox"
            className="font-medium text-foreground underline underline-offset-4"
          >
            The Sandbox
          </Link>{" "}
          to earn points. Unverified slots stay hidden so the hunt is not spoiled.
        </p>
      </CardContent>
    </Card>
  )
}
