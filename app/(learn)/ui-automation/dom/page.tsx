import type { Metadata } from "next"

import { LessonPlaceholder } from "@/components/lesson-placeholder"

export const metadata: Metadata = {
  title: "DOM",
}

export default function DomPage() {
  return (
    <LessonPlaceholder
      title="DOM"
      description="Locators, accessibility trees, and stable selectors. Lesson content will land here."
    />
  )
}
