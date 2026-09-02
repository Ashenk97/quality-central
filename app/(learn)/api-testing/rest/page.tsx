import type { Metadata } from "next"

import { LessonPlaceholder } from "@/components/lesson-placeholder"

export const metadata: Metadata = {
  title: "REST",
}

export default function RestPage() {
  return (
    <LessonPlaceholder
      title="REST"
      description="Resources, status codes, and API contracts. Lesson content will land here."
    />
  )
}
