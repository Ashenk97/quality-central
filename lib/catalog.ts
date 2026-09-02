import {
  BookOpen,
  Bug,
  Globe,
  MonitorPlay,
  type LucideIcon,
} from "lucide-react"

import {
  curriculum,
  getSectionLessons,
  parseCourseHref,
  type CurriculumSection,
  type CurriculumTopic,
  type Difficulty,
} from "@/lib/curriculum"
import {
  MAX_SANDBOX_POINTS,
  SANDBOX_DEFECTS,
  type SandboxDefectId,
} from "@/lib/sandbox-defects"

export type CatalogFilterId =
  | "foundation"
  | "api-testing"
  | "ui-automation"
  | "sandbox"

export type ModuleStatus = "completed" | "in-progress" | "locked"

export type CatalogKind = "lesson" | "tool" | "sandbox"

export type CatalogTab = {
  id: CatalogFilterId
  label: string
  href: string
  icon: LucideIcon
}

export const CATALOG_TABS: CatalogTab[] = [
  {
    id: "foundation",
    label: "Foundation",
    href: "/foundation",
    icon: BookOpen,
  },
  {
    id: "api-testing",
    label: "API",
    href: "/api-testing",
    icon: Globe,
  },
  {
    id: "ui-automation",
    label: "UI Automation",
    href: "/ui-automation",
    icon: MonitorPlay,
  },
  {
    id: "sandbox",
    label: "Sandbox",
    href: "/sandbox",
    icon: Bug,
  },
]

export type CatalogModule = {
  id: string
  title: string
  href: string
  description: string
  kind: CatalogKind
  filterId: CatalogFilterId
  sectionTitle: string
  icon: LucideIcon
  difficulty?: Difficulty
  lessonId?: string
  category?: string
}

export type ResolvedModule = CatalogModule & {
  status: ModuleStatus
  quizScore: number | null
  progressPercent: number
  unlockHint?: string
}

export type TrackSummary = {
  filterId: CatalogFilterId
  title: string
  description: string
  href: string
  icon: LucideIcon
  difficulty?: Difficulty
  percent: number
  done: number
  total: number
  status: ModuleStatus
  unlocked: boolean
}

export function getCatalogTracks(): CurriculumSection[] {
  return curriculum.filter((section) => section.href !== "/dashboard")
}

export function getCatalogFilterId(
  section: CurriculumSection
): CatalogFilterId | null {
  const tab = CATALOG_TABS.find((item) => item.href === section.href)
  return tab?.id ?? null
}

export function statusLabel(
  status: ModuleStatus,
  kind: CatalogKind
): string {
  if (status === "completed") {
    return "Completed"
  }
  if (status === "locked") {
    return "Locked"
  }
  return kind === "tool" ? "Live" : "In progress"
}

function asCatalogModule(
  section: CurriculumSection,
  filterId: CatalogFilterId,
  topic?: CurriculumTopic
): CatalogModule {
  if (!topic) {
    return {
      id: filterId,
      title: section.title,
      href: section.href,
      description: section.description,
      kind: "sandbox",
      filterId,
      sectionTitle: section.title,
      icon: section.icon,
      difficulty: section.difficulty,
    }
  }

  return {
    id: topic.href,
    title: topic.title,
    href: topic.href,
    description: topic.description,
    kind: topic.kind === "tool" ? "tool" : "lesson",
    filterId,
    sectionTitle: section.title,
    icon: section.icon,
    difficulty: topic.difficulty ?? section.difficulty,
    lessonId: topic.lessonId,
    category: section.category,
  }
}

export function getCatalogModules(): CatalogModule[] {
  return getCatalogTracks().flatMap((section) => {
    const filterId = getCatalogFilterId(section)
    if (!filterId) {
      return []
    }

    if (filterId === "sandbox") {
      return [asCatalogModule(section, filterId)]
    }

    return (section.items ?? []).map((topic) =>
      asCatalogModule(section, filterId, topic)
    )
  })
}

export function countResolvedDefects(
  isResolved: (bugId: SandboxDefectId) => boolean
) {
  return SANDBOX_DEFECTS.filter((defect) => isResolved(defect.id)).length
}

type ProgressReader = {
  isComplete: (category: string, lessonId: string) => boolean
  getQuizScore: (category: string, lessonId: string) => number | null
  sandboxResolved: number
  sandboxPoints: number
}

function lessonComplete(
  topic: CurriculumTopic,
  isComplete: ProgressReader["isComplete"]
) {
  const parsed = parseCourseHref(topic.href)
  return parsed ? isComplete(parsed.category, parsed.lessonId) : false
}

function trackLessonsComplete(
  section: CurriculumSection,
  isComplete: ProgressReader["isComplete"]
) {
  const lessons = getSectionLessons(section)
  return (
    lessons.length > 0 &&
    lessons.every((topic) => lessonComplete(topic, isComplete))
  )
}

export function resolveCatalog(progress: ProgressReader): {
  modules: ResolvedModule[]
  tracks: TrackSummary[]
} {
  const tracks: TrackSummary[] = []
  const modules: ResolvedModule[] = []
  const catalogTracks = getCatalogTracks()
  let previousTrackComplete: boolean = true
  let previousTrackTitle: string | undefined

  for (const section of catalogTracks) {
    const filterId = getCatalogFilterId(section)
    if (!filterId) {
      continue
    }

    const unlocked: boolean = previousTrackComplete
    const lessons = getSectionLessons(section)
    const unlockHint = !unlocked
      ? `Complete ${previousTrackTitle ?? "the previous track"} to unlock`
      : undefined

    if (filterId === "sandbox") {
      const total = SANDBOX_DEFECTS.length
      const done = progress.sandboxResolved
      const percent =
        total === 0 ? 0 : Math.round((done / total) * 100)
      const status: ModuleStatus = !unlocked
        ? "locked"
        : done === total
          ? "completed"
          : "in-progress"

      tracks.push({
        filterId,
        title: section.title,
        description: section.description,
        href: section.href,
        icon: section.icon,
        difficulty: section.difficulty,
        percent,
        done,
        total,
        status,
        unlocked,
      })

      modules.push({
        ...asCatalogModule(section, filterId),
        status,
        quizScore: null,
        progressPercent: Math.round(
          (progress.sandboxPoints / MAX_SANDBOX_POINTS) * 100
        ),
        unlockHint,
      })

      previousTrackComplete = status === "completed"
      previousTrackTitle = section.title
      continue
    }

    const done = lessons.filter((topic) =>
      lessonComplete(topic, progress.isComplete)
    ).length
    const percent =
      lessons.length === 0 ? 0 : Math.round((done / lessons.length) * 100)
    const trackStatus: ModuleStatus = !unlocked
      ? "locked"
      : done === lessons.length && lessons.length > 0
        ? "completed"
        : "in-progress"

    tracks.push({
      filterId,
      title: section.title,
      description: section.description,
      href: section.href,
      icon: section.icon,
      difficulty: section.difficulty,
      percent,
      done,
      total: lessons.length,
      status: trackStatus,
      unlocked,
    })

    let previousLessonComplete = true
    let previousLessonTitle: string | undefined

    for (const topic of section.items ?? []) {
      const parsed = parseCourseHref(topic.href)
      const complete = parsed
        ? progress.isComplete(parsed.category, parsed.lessonId)
        : false
      const quizScore = parsed
        ? progress.getQuizScore(parsed.category, parsed.lessonId)
        : null
      const isTool = topic.kind === "tool"

      let status: ModuleStatus
      let itemHint: string | undefined

      if (!unlocked) {
        status = "locked"
        itemHint = unlockHint
      } else if (!previousLessonComplete) {
        status = "locked"
        itemHint = `Complete ${previousLessonTitle ?? "the previous module"} to unlock`
      } else if (isTool) {
        status = "in-progress"
      } else if (complete) {
        status = "completed"
      } else {
        status = "in-progress"
      }

      const progressPercent = complete
        ? 100
        : quizScore != null
          ? quizScore
          : 0

      modules.push({
        ...asCatalogModule(section, filterId, topic),
        status,
        quizScore,
        progressPercent,
        unlockHint: itemHint,
      })

      if (!isTool) {
        previousLessonComplete = complete
        previousLessonTitle = topic.title
      }
    }

    previousTrackComplete = trackLessonsComplete(section, progress.isComplete)
    previousTrackTitle = section.title
  }

  return { modules, tracks }
}
