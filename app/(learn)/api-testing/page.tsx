import type { Metadata } from "next"

import { LessonPlaceholder } from "@/components/lesson-placeholder"
import { getSection } from "@/lib/curriculum"

const section = getSection("/api-testing")

export const metadata: Metadata = {
  title: "API Testing",
}

export default function ApiTestingPage() {
  return (
    <LessonPlaceholder
      title={section.title}
      description={section.description}
      topics={section.items}
    />
  )
}
