import {
  BookOpen,
  Bug,
  Database,
  Globe,
  GraduationCap,
  LayoutDashboard,
  MonitorPlay,
  Sparkles,
  Trophy,
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
    description: "Zero-to-beginner QA: intro, test design, bugs, agile, and test cases",
    icon: BookOpen,
    category: "foundation",
    track: "manual",
    difficulty: "beginner",
    items: [
      {
        title: "Introduction to Software QA & STLC",
        href: courseHref("foundation", "01-introduction-to-qa"),
        lessonId: "01-introduction-to-qa",
        difficulty: "beginner",
        description: "QA as a process, plus SDLC versus the six STLC phases",
      },
      {
        title: "Test Case Design: BVA & Equivalence Partitioning",
        href: courseHref("foundation", "02-test-design-techniques"),
        lessonId: "02-test-design-techniques",
        difficulty: "beginner",
        description: "Black-box sampling with partitions and boundary values",
      },
      {
        title: "The Defect Life Cycle & Writing Bug Reports",
        href: courseHref("foundation", "03-bug-life-cycle"),
        lessonId: "03-bug-life-cycle",
        difficulty: "beginner",
        description: "Report anatomy, severity vs priority, and New through Closed",
      },
      {
        title: "Agile and Scrum QA",
        href: courseHref("foundation", "04-agile-and-scrum-qa"),
        lessonId: "04-agile-and-scrum-qa",
        difficulty: "beginner",
        description: "Stories, Definition of Done, and testing inside a sprint",
      },
      {
        title: "Writing Real-World Test Cases",
        href: courseHref("foundation", "05-writing-test-cases"),
        lessonId: "05-writing-test-cases",
        difficulty: "beginner",
        description: "Anatomy, positive vs negative vs edge, Forgot Password suite",
      },
      {
        title: "ISTQB Foundation",
        href: courseHref("foundation", "istqb"),
        lessonId: "istqb",
        difficulty: "beginner",
        description: "ISTQB principles, test levels, and the language of QA",
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
      {
        title: "Manual QA",
        href: courseHref("foundation", "manual-qa"),
        lessonId: "manual-qa",
        difficulty: "beginner",
        description: "Test design, exploratory testing, and defect reporting",
      },
    ],
  },
  {
    title: "API Testing",
    href: "/api-testing",
    description: "HTTP contracts, JSON, methods, and Postman",
    icon: Globe,
    category: "api-testing",
    track: "api",
    difficulty: "intermediate",
    items: [
      {
        title: "What is an API & How Does it Work?",
        href: courseHref("api-testing", "01-introduction-to-api-testing"),
        lessonId: "01-introduction-to-api-testing",
        difficulty: "intermediate",
        description: "Client, waiter, kitchen — and how JSON carries the plate",
      },
      {
        title: "HTTP Methods & Status Codes",
        href: courseHref("api-testing", "02-http-methods-status-codes"),
        lessonId: "02-http-methods-status-codes",
        difficulty: "intermediate",
        description: "CRUD verbs, status families, and 401 vs 403",
      },
      {
        title: "Intro to Postman",
        href: courseHref("api-testing", "03-intro-to-postman"),
        lessonId: "03-intro-to-postman",
        difficulty: "intermediate",
        description: "Headers, auth, body, and pm.expect on JSON fields",
      },
      {
        title: "REST & JSON Contracts",
        href: courseHref("api-testing", "03-rest-and-json"),
        lessonId: "03-rest-and-json",
        difficulty: "beginner",
        description: "Resources, payload shape, and contract drift",
      },
      {
        title: "Postman Collections & Environments",
        href: courseHref("api-testing", "04-postman-collections"),
        lessonId: "04-postman-collections",
        difficulty: "beginner",
        description: "Collections, variables, Tests tab, and Newman",
      },
      {
        title: "API Playground",
        href: "/api-testing/playground",
        kind: "tool",
        difficulty: "intermediate",
        description: "Send GET/POST requests against a dummy API",
      },
      {
        title: "Custom Mock Server",
        href: "/mock-server",
        kind: "tool",
        difficulty: "intermediate",
        description: "Host your own GET/POST/PUT fixtures for Postman and Playwright",
      },
    ],
  },
  {
    title: "Technical Core",
    href: "/technical-core",
    description: "SQL for backend checks, plus Git, GitHub, and Scrum ceremonies",
    icon: Database,
    category: "technical-core",
    track: "technical",
    difficulty: "intermediate",
    items: [
      {
        title: "SQL Basics: Verifying Backend Data",
        href: courseHref("technical-core", "01-sql-for-qa"),
        lessonId: "01-sql-for-qa",
        difficulty: "intermediate",
        description: "SELECT, WHERE, ORDER BY, and INNER JOIN on users and orders",
      },
      {
        title: "Git, GitHub, and Agile Ceremonies",
        href: courseHref("technical-core", "02-git-and-agile"),
        lessonId: "02-git-and-agile",
        difficulty: "intermediate",
        description: "Standup, planning, Git clone/pull, and QA on pull requests",
      },
    ],
  },
  {
    title: "UI Automation",
    href: "/ui-automation",
    description: "DOM locators, Playwright specs, and page objects",
    icon: MonitorPlay,
    category: "ui-automation",
    track: "automation",
    difficulty: "intermediate",
    items: [
      {
        title: "DOM and Locators",
        href: courseHref("ui-automation", "01-dom-and-locators"),
        lessonId: "01-dom-and-locators",
        difficulty: "advanced",
        description: "DOM render, id/CSS/XPath vs roles, brittle vs resilient",
      },
      {
        title: "Your First Playwright Test",
        href: courseHref("ui-automation", "02-first-playwright-test"),
        lessonId: "02-first-playwright-test",
        difficulty: "advanced",
        description: "AAA, goto/fill/click, and auto-waiting expect",
      },
      {
        title: "The Page Object Model (POM)",
        href: courseHref("ui-automation", "03-page-object-model"),
        lessonId: "03-page-object-model",
        difficulty: "advanced",
        description: "LoginPage class, specs keep assertions, no duplicated locators",
      },
      {
        title: "Introduction to UI Automation",
        href: courseHref("ui-automation", "01-introduction-to-ui-automation"),
        lessonId: "01-introduction-to-ui-automation",
        difficulty: "beginner",
        description: "When to automate the browser and what to skip",
      },
      {
        title: "Automation Frameworks",
        href: courseHref("ui-automation", "03-automation-frameworks"),
        lessonId: "03-automation-frameworks",
        difficulty: "beginner",
        description: "Playwright, Cypress, Selenium, and page objects",
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
    title: "Interview Prep",
    href: "/interview-prep",
    description: "Whiteboard object testing, conflict with developers, and screening vocabulary",
    icon: GraduationCap,
    category: "interview-prep",
    track: "interview",
    difficulty: "beginner",
    items: [
      {
        title: "Cracking the QA Intern Interview",
        href: courseHref("interview-prep", "01-cracking-the-qa-interview"),
        lessonId: "01-cracking-the-qa-interview",
        difficulty: "beginner",
        description: "Object testing, rejected bugs, and smoke vs sanity pairs",
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
  {
    title: "Capstone",
    href: "/capstone",
    description: "QA sprint simulation: plan, hunt, API, SQL, and Playwright",
    icon: Trophy,
    category: "capstone",
    track: "capstone",
    difficulty: "advanced",
    items: [
      {
        title: "Capstone Project: The QA Sprint Simulation",
        href: courseHref("capstone", "01-sandbox-challenge"),
        lessonId: "01-sandbox-challenge",
        difficulty: "advanced",
        description: "Four-phase GENKI Wardrobe sprint — certificate on pass",
      },
    ],
  },
  {
    title: "Next-Gen QA",
    href: "/next-gen",
    description: "LLMs for fixtures and Playwright drafts, plus testing probabilistic AI",
    icon: Sparkles,
    category: "next-gen",
    track: "next-gen",
    difficulty: "advanced",
    items: [
      {
        title: "AI in QA: Prompting & Test Generation",
        href: courseHref("next-gen", "01-ai-in-testing"),
        lessonId: "01-ai-in-testing",
        difficulty: "advanced",
        description: "Mock JSON, BVA dumps, deterministic vs probabilistic asserts",
      },
    ],
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
