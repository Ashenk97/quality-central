import type { Metadata } from "next"

import { LessonPlaceholder } from "@/components/lesson-placeholder"

export const metadata: Metadata = {
  title: "The Sandbox",
}

export default function SandboxPage() {
  return (
    <LessonPlaceholder
      title="The Sandbox"
      description="Interactive bug hunting practice. Scenarios and exercises will land here."
    />
  )
}
