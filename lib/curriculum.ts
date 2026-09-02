import {
  BookOpen,
  Bug,
  Globe,
  LayoutDashboard,
  MonitorPlay,
  type LucideIcon,
} from "lucide-react"

export type CurriculumTopic = {
  title: string
  href: string
  description: string
}

export type CurriculumSection = {
  title: string
  href: string
  description: string
  icon: LucideIcon
  items?: CurriculumTopic[]
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
    items: [
      {
        title: "Manual QA",
        href: "/foundation/manual-qa",
        description: "Test design, exploratory testing, and defect reporting",
      },
      {
        title: "SDLC",
        href: "/foundation/sdlc",
        description: "Software development life cycle and where QA fits",
      },
      {
        title: "STLC",
        href: "/foundation/stlc",
        description: "Software testing life cycle from plan to closure",
      },
    ],
  },
  {
    title: "API Testing",
    href: "/api-testing",
    description: "REST contracts and HTTP methods",
    icon: Globe,
    items: [
      {
        title: "REST",
        href: "/api-testing/rest",
        description: "Resources, status codes, and API contracts",
      },
      {
        title: "HTTP Methods",
        href: "/api-testing/http-methods",
        description: "GET, POST, PUT, PATCH, DELETE, and idempotency",
      },
    ],
  },
  {
    title: "UI Automation",
    href: "/ui-automation",
    description: "Frameworks and the DOM",
    icon: MonitorPlay,
    items: [
      {
        title: "Frameworks",
        href: "/ui-automation/frameworks",
        description: "Selecting and structuring UI automation tools",
      },
      {
        title: "DOM",
        href: "/ui-automation/dom",
        description: "Locators, accessibility trees, and stable selectors",
      },
    ],
  },
  {
    title: "The Sandbox",
    href: "/sandbox",
    description: "Interactive bug hunting practice",
    icon: Bug,
  },
]

export function findSection(pathname: string): CurriculumSection | undefined {
  return curriculum.find(
    (section) =>
      pathname === section.href || pathname.startsWith(`${section.href}/`)
  )
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
