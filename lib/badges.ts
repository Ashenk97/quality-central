import {
  resolveCatalog,
  type CatalogFilterId,
  type TrackSummary,
} from "@/lib/catalog"
import { SANDBOX_DEFECTS, type SandboxDefectId } from "@/lib/sandbox-defects"

export type BadgeKind = "achievement" | "node"

export type BadgeDefinition = {
  id: string
  title: string
  description: string
  kind: BadgeKind
  filterId?: CatalogFilterId
}

export const BADGE_CATALOG: BadgeDefinition[] = [
  {
    id: "bug-hunter",
    title: "Bug Hunter",
    description: "Verified every planted defect in The Sandbox",
    kind: "achievement",
    filterId: "sandbox",
  },
  {
    id: "api-wizard",
    title: "API Wizard",
    description: "Completed a Postman lesson in the API track",
    kind: "achievement",
    filterId: "api-testing",
  },
  {
    id: "automation-apprentice",
    title: "Automation Apprentice",
    description: "Completed Your First Playwright Test",
    kind: "achievement",
    filterId: "ui-automation",
  },
  {
    id: "node-foundation",
    title: "Foundation node",
    description: "Opened the Foundation branch of the skill tree",
    kind: "node",
    filterId: "foundation",
  },
  {
    id: "node-api-testing",
    title: "API node",
    description: "Unlocked the API Testing branch",
    kind: "node",
    filterId: "api-testing",
  },
  {
    id: "node-technical-core",
    title: "SQL node",
    description: "Unlocked the Technical Core branch",
    kind: "node",
    filterId: "technical-core",
  },
  {
    id: "node-ui-automation",
    title: "Automation node",
    description: "Unlocked the UI Automation branch",
    kind: "node",
    filterId: "ui-automation",
  },
  {
    id: "node-interview-prep",
    title: "Interview node",
    description: "Unlocked Interview Prep",
    kind: "node",
    filterId: "interview-prep",
  },
  {
    id: "node-sandbox",
    title: "Sandbox node",
    description: "Unlocked The Sandbox",
    kind: "node",
    filterId: "sandbox",
  },
  {
    id: "node-capstone",
    title: "Capstone node",
    description: "Unlocked the Capstone sprint",
    kind: "node",
    filterId: "capstone",
  },
  {
    id: "node-next-gen",
    title: "Next-Gen node",
    description: "Unlocked Next-Gen QA",
    kind: "node",
    filterId: "next-gen",
  },
]

export const FEATURED_BADGES = BADGE_CATALOG.filter(
  (badge) => badge.kind === "achievement"
)

export function getBadge(id: string) {
  return BADGE_CATALOG.find((badge) => badge.id === id) ?? null
}

export type BadgeProgressReader = {
  isComplete: (category: string, lessonId: string) => boolean
  getQuizScore: (category: string, lessonId: string) => number | null
  isSandboxBugResolved: (bugId: SandboxDefectId) => boolean
  getSandboxPoints: () => number
}

function tracksFromProgress(progress: BadgeProgressReader): TrackSummary[] {
  return resolveCatalog({
    isComplete: progress.isComplete,
    getQuizScore: progress.getQuizScore,
    sandboxResolved: SANDBOX_DEFECTS.filter((defect) =>
      progress.isSandboxBugResolved(defect.id)
    ).length,
    sandboxPoints: progress.getSandboxPoints(),
  }).tracks
}

function completedLesson(
  category: string,
  lessonId: string,
  isComplete: BadgeProgressReader["isComplete"]
) {
  return isComplete(category, lessonId)
}

export function evaluateEarnedBadges(
  progress: BadgeProgressReader
): BadgeDefinition[] {
  const tracks = tracksFromProgress(progress)
  const earned: BadgeDefinition[] = []

  for (const badge of BADGE_CATALOG) {
    if (isBadgeEarned(badge, progress, tracks)) {
      earned.push(badge)
    }
  }

  return earned
}

export function isBadgeEarned(
  badge: BadgeDefinition,
  progress: BadgeProgressReader,
  tracks = tracksFromProgress(progress)
) {
  if (badge.id === "bug-hunter") {
    return SANDBOX_DEFECTS.every((defect) =>
      progress.isSandboxBugResolved(defect.id)
    )
  }

  if (badge.id === "api-wizard") {
    return (
      completedLesson("api-testing", "03-intro-to-postman", progress.isComplete) ||
      completedLesson(
        "api-testing",
        "04-postman-collections",
        progress.isComplete
      )
    )
  }

  if (badge.id === "automation-apprentice") {
    return completedLesson(
      "ui-automation",
      "02-first-playwright-test",
      progress.isComplete
    )
  }

  if (badge.kind === "node" && badge.filterId) {
    const track = tracks.find((item) => item.filterId === badge.filterId)
    return Boolean(track?.unlocked)
  }

  return false
}
