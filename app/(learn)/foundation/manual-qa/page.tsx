import type { Metadata } from "next"

import { LessonPlaceholder } from "@/components/lesson-placeholder"

export const metadata: Metadata = {
  title: "Manual QA",
}

export default function ManualQaPage() {
  return (
    <LessonPlaceholder
      title="Manual QA"
      description="Test design, exploratory testing, and defect reporting. Lesson content will land here."
    />
  )
}
