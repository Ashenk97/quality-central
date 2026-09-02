import type { Metadata } from "next"

import { LessonPlaceholder } from "@/components/lesson-placeholder"

export const metadata: Metadata = {
  title: "HTTP Methods",
}

export default function HttpMethodsPage() {
  return (
    <LessonPlaceholder
      title="HTTP Methods"
      description="GET, POST, PUT, PATCH, DELETE, and idempotency. Lesson content will land here."
    />
  )
}
