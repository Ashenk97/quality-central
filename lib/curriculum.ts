import {
  BookOpen,
  Bug,
  Globe,
  LayoutDashboard,
  MonitorPlay,
  type LucideIcon,
} from "lucide-react"

import type { Track } from "@/lib/db/types"

export type Difficulty = "beginner" | "intermediate" | "advanced"

export const difficultyLabel: Record<Difficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
}

export type CurriculumTopic = {
  title: string
  href: string
  description: string
  lessonId?: string
  kind?: "lesson" | "tool"
  difficulty?: Difficulty
}

export type CurriculumSection = {
  title: string
  href: string
  description: string
  icon: LucideIcon
  category?: string
  track?: Track
  difficulty?: Difficulty
  items?: CurriculumTopic[]
}

export function courseHref(category: string, lessonId: string) {
  return `/courses/${category}/${lessonId}`
}

export const curriculum: CurriculumSection[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    description: "User progress across the learning path",
    icon: LayoutDashboard,
  },
  {
    title: "Foundation",
    href: "/foundation",
    description: "Manual QA, SDLC, and STLC fundamentals",
    icon: BookOpen,
    category: "foundation",
    track: "manual",
    difficulty: "beginner",
    items: [
      {
        title: "Manual QA",
        href: courseHref("foundation", "manual-qa"),
        lessonId: "manual-qa",
        difficulty: "beginner",
        description: "Test design, exploratory testing, and defect reporting",
      },
      {
        title: "SDLC",
        href: courseHref("foundation", "sdlc"),
        lessonId: "sdlc",
        difficulty: "beginner",
        description: "Software development life cycle and where QA fits",
      },
      {
        title: "STLC",
        href: courseHref("foundation", "stlc"),
        lessonId: "stlc",
        difficulty: "beginner",
        description: "Software testing life cycle from plan to closure",
      },
    ],
  },
  {
    title: "API Testing",
    href: "/api-testing",
    description: "REST contracts and HTTP methods",
    icon: Globe,
    category: "api-testing",
    track: "api",
    difficulty: "intermediate",
    items: [
      {
        title: "REST",
        href: courseHref("api-testing", "rest"),
        lessonId: "rest",
        difficulty: "intermediate",
        description: "Resources, status codes, and API contracts",
      },
      {
        title: "HTTP Methods",
        href: courseHref("api-testing", "http-methods"),
        lessonId: "http-methods",
        difficulty: "intermediate",
        description: "GET, POST, PUT, PATCH, DELETE, and idempotency",
      },
      {
        title: "API Playground",
        href: "/api-testing/playground",
        kind: "tool",
        difficulty: "intermediate",
        description: "Send GET/POST requests against a dummy API",
      },
    ],
  },
  {
    title: "UI Automation",
    href: "/ui-automation",
    description: "Frameworks and the DOM",
    icon: MonitorPlay,
    category: "ui-automation",
    track: "automation",
    difficulty: "intermediate",
    items: [
      {
        title: "Frameworks",
        href: courseHref("ui-automation", "frameworks"),
        lessonId: "frameworks",
        difficulty: "intermediate",
        description: "Selecting and structuring UI automation tools",
      },
      {
        title: "DOM",
        href: courseHref("ui-automation", "dom"),
        lessonId: "dom",
        difficulty: "intermediate",
        description: "Locators, accessibility trees, and stable selectors",
      },
      {
        title: "Automation Playground",
        href: "/ui-automation/playground",
        kind: "tool",
        difficulty: "advanced",
        description: "Edit and simulate a Playwright spec",
      },
    ],
  },
  {
    title: "The Sandbox",
    href: "/sandbox",
    description: "Interactive bug hunting practice",
    icon: Bug,
    difficulty: "advanced",
  },
]

export function findSection(pathname: string): CurriculumSection | undefined {
  return curriculum.find((section) => {
    if (
      section.category &&
      (pathname === `/courses/${section.category}` ||
        pathname.startsWith(`/courses/${section.category}/`))
    ) {
      return true
    }

    return (
      pathname === section.href || pathname.startsWith(`${section.href}/`)
    )
  })
}

export function findTopic(
  pathname: string
): { section: CurriculumSection; topic: CurriculumTopic } | undefined {
  for (const section of curriculum) {
    const topic = section.items?.find((item) => item.href === pathname)
    if (topic) {
      return { section, topic }
    }
  }
  return undefined
}

export function getSection(href: string): CurriculumSection {
  const section = curriculum.find((item) => item.href === href)
  if (!section) {
    throw new Error(`Unknown curriculum section: ${href}`)
  }
  return section
}

export function parseCourseHref(href: string) {
  const match = href.match(/^\/courses\/([^/]+)\/([^/]+)$/)
  if (!match) {
    return null
  }

  return { category: match[1], lessonId: match[2] }
}

export function getAllTopics() {
  return curriculum.flatMap((section) =>
    (section.items ?? []).filter((item) => item.kind !== "tool")
  )
}

export function getTrackSections() {
  return curriculum.filter((section) => Boolean(section.track))
}

export function getSectionLessons(section: CurriculumSection) {
  return (section.items ?? []).filter((item) => item.kind !== "tool")
}
