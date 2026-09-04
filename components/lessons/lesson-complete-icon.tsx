"use client"

import { CheckIcon } from "lucide-react"

import { parseCourseHref } from "@/lib/curriculum"
import { useProgress } from "@/lib/progress"

export function LessonCompleteIcon({ href }: { href: string }) {
  const { isComplete } = useProgress()
  const parsed = parseCourseHref(href)

  if (!parsed || !isComplete(parsed.category, parsed.lessonId)) {
    return null
  }

  return (
    <CheckIcon
      className="mt-0.5 ml-auto size-3.5 shrink-0 self-start text-success"
      aria-label="Completed"
    />
  )
}
