"use client"

import Link from "next/link"
import {
  ArrowRightIcon,
  CheckIcon,
  LockIcon,
} from "lucide-react"

import { DifficultyBadge } from "@/components/difficulty-badge"
import { SuccessBar } from "@/components/progress-visuals"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { StaggerItem, StaggerList } from "@/components/stagger-list"
import { statusLabel, type ResolvedModule } from "@/lib/catalog"
import { cn } from "@/lib/utils"

const statusStyles: Record<ResolvedModule["status"], string> = {
  completed: "border-l-success",
  "in-progress": "border-l-primary",
  locked: "border-l-border opacity-80",
}

export function ModuleCard({ module }: { module: ResolvedModule }) {
  const locked = module.status === "locked"
  const label = statusLabel(module.status, module.kind)
  const cta =
    module.kind === "tool"
      ? "Open playground"
      : module.kind === "sandbox"
        ? "Open The Sandbox"
        : module.status === "completed"
          ? "Review lesson"
          : "Open lesson"

  return (
    <Card
      data-status={module.status}
      interactive={!locked}
      className={cn("h-full border-l-2", statusStyles[module.status])}
    >
      <CardHeader className="gap-2.5">
        <div className="flex items-start gap-2.5">
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-muted/60",
              module.status === "completed" &&
                "border-success/20 bg-success/10 text-success",
              module.status === "in-progress" &&
                "border-primary/20 bg-primary/10 text-primary",
              locked && "text-muted-foreground"
            )}
          >
            {module.status === "completed" ? (
              <CheckIcon className="size-4" aria-hidden />
            ) : locked ? (
              <LockIcon className="size-4" aria-hidden />
            ) : (
              <module.icon className="size-4" aria-hidden />
            )}
          </span>
          <CardTitle
            title={module.title}
            className="min-h-10 flex-1 text-base leading-snug text-balance"
          >
            <span className="line-clamp-2">{module.title}</span>
          </CardTitle>
        </div>

        <div className="flex min-h-6 flex-wrap items-center gap-1.5">
          {module.difficulty ? (
            <DifficultyBadge difficulty={module.difficulty} />
          ) : null}
          <Badge
            variant={
              module.status === "completed"
                ? "success"
                : module.status === "locked"
                  ? "outline"
                  : "secondary"
            }
          >
            {label}
          </Badge>
        </div>

        <CardDescription
          title={module.description}
          className="min-h-10 line-clamp-2"
        >
          {module.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-end gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>
              {module.kind === "sandbox"
                ? "Hunter progress"
                : module.quizScore != null
                  ? `Quiz ${module.quizScore}%`
                  : module.status === "completed"
                    ? "Module complete"
                    : "Not started"}
            </span>
            <span className="font-mono tabular-nums">
              {module.progressPercent}%
            </span>
          </div>
          <SuccessBar
            value={locked ? 0 : module.progressPercent}
            label={`${module.title} progress`}
          />
        </div>
        {locked ? (
          <p className="min-h-8 text-xs leading-relaxed text-muted-foreground">
            {module.unlockHint ?? "Locked until the previous module is complete."}
          </p>
        ) : (
          <Button variant="outline" size="sm" asChild className="w-fit">
            <Link href={module.href}>
              {cta}
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export function ModuleGrid({ modules }: { modules: ResolvedModule[] }) {
  if (modules.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No modules in this category.
      </p>
    )
  }

  return (
    <StaggerList
      key={modules.map((module) => module.id).join("|")}
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      {modules.map((module) => (
        <StaggerItem key={module.id} className="h-full">
          <ModuleCard module={module} />
        </StaggerItem>
      ))}
    </StaggerList>
  )
}
