import type { Metadata } from "next"

import { LessonPlaceholder } from "@/components/lesson-placeholder"
import { getSection } from "@/lib/curriculum"

const section = getSection("/ui-automation")

export const metadata: Metadata = {
  title: "UI Automation",
}

export default function UiAutomationPage() {
  return (
    <LessonPlaceholder
      title={section.title}
      description={section.description}
      topics={section.items}
    />
  )
}
