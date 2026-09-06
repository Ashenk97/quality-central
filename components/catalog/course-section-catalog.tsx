"use client"

import { useMemo } from "react"

import { CatalogNavTabs } from "@/components/catalog/catalog-tabs"
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
  getCatalogFilterId,
  resolveCatalog,
  statusLabel,
  type CatalogFilterId,
} from "@/lib/catalog"
import { getSection } from "@/lib/curriculum"
import { useProgress } from "@/lib/progress"

export function CourseSectionCatalog({
  sectionHref,
}: {
  sectionHref: string
}) {
  const section = getSection(sectionHref)
  const filterId = getCatalogFilterId(section)
  const {
    ready,
    isComplete,
    getQuizScore,
    isSandboxBugResolved,
    getSandboxPoints,
  } = useProgress()
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

  const track = tracks.find((item) => item.filterId === filterId)
  const visible = modules.filter((item) => item.filterId === filterId)
  const active: CatalogFilterId = filterId ?? "foundation"

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              {section.title}
            </h1>
            {section.difficulty ? (
              <DifficultyBadge difficulty={section.difficulty} />
            ) : null}
            {track ? (
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
            ) : null}
          </div>
          <p className="max-w-2xl text-muted-foreground">{section.description}</p>
        </div>
        <CatalogNavTabs active={active} />
      </div>

      {track ? (
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-border/60">
            <CardTitle>Track progress</CardTitle>
            <CardDescription>
              {ready
                ? `${track.done} / ${track.total} complete`
                : "Loading progress…"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-6 pt-6">
            <RadialProgress
              value={ready ? track.percent : 0}
              size={112}
              strokeWidth={9}
              label={`${section.title} progress`}
            />
            <div className="min-w-60 flex-1 space-y-3">
              <p className="text-sm text-muted-foreground">
                Emerald marks completed work. Locked modules open when the
                previous lesson in this path is done.
              </p>
              <SuccessBar
                value={ready ? track.percent : 0}
                label={`${section.title} completion`}
              />
            </div>
          </CardContent>
        </Card>
      ) : null}

      {ready ? (
        <ModuleGrid modules={visible} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-52 rounded-xl" />
          ))}
        </div>
      )}
    </div>
  )
}
