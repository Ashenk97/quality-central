import type { Metadata } from "next"

import { LessonPlaceholder } from "@/components/lesson-placeholder"

export const metadata: Metadata = {
  title: "Frameworks",
}

export default function FrameworksPage() {
  return (
    <LessonPlaceholder
      title="Frameworks"
      description="Selecting and structuring UI automation tools. Lesson content will land here."
    />
  )
}
