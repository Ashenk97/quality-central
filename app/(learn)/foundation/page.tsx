import type { Metadata } from "next"

import { LessonPlaceholder } from "@/components/lesson-placeholder"
import { getSection } from "@/lib/curriculum"

const section = getSection("/foundation")

export const metadata: Metadata = {
  title: "Foundation",
}

export default function FoundationPage() {
  return (
    <LessonPlaceholder
      title={section.title}
      description={section.description}
      topics={section.items}
    />
  )
}
