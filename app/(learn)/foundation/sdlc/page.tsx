import type { Metadata } from "next"

import { LessonPlaceholder } from "@/components/lesson-placeholder"

export const metadata: Metadata = {
  title: "SDLC",
}

export default function SdlcPage() {
  return (
    <LessonPlaceholder
      title="SDLC"
      description="Software development life cycle and where QA fits. Lesson content will land here."
    />
  )
}
