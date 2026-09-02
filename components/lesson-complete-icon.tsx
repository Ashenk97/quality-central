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
    <CheckIcon className="ml-auto size-3.5 text-success" aria-label="Completed" />
  )
}
