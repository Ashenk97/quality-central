import type { Metadata } from "next"

import { LessonPlaceholder } from "@/components/lesson-placeholder"

export const metadata: Metadata = {
  title: "STLC",
}

export default function StlcPage() {
  return (
    <LessonPlaceholder
      title="STLC"
      description="Software testing life cycle from plan to closure. Lesson content will land here."
    />
  )
}
