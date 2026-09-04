"use client"

import { CheckIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useProgress } from "@/lib/progress"

export function MarkCompleteButton({
  category,
  lessonId,
}: {
  category: string
  lessonId: string
}) {
  const {
    ready,
    isComplete,
    markComplete,
    markIncomplete,
    source,
    syncError,
  } = useProgress()
  const completed = isComplete(category, lessonId)

  const persistenceHint = syncError
    ? "Could not reach Supabase, so this save is local to the browser."
    : source === "supabase"
      ? "Progress is stored in your account and will persist after reload."
      : "Progress is saved in this browser. Sign in to sync it to your account."

  function completeLesson() {
    markComplete(category, lessonId)
    toast.success("Lesson complete", {
      description: "Progress saved on this path.",
      id: `lesson-complete-${category}-${lessonId}`,
    })
  }

  function reopenLesson() {
    markIncomplete(category, lessonId)
    toast.message("Lesson reopened", {
      description: "Marked incomplete so you can work through it again.",
      id: `lesson-incomplete-${category}-${lessonId}`,
    })
  }

  return (
    <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium">
          {completed ? "Lesson complete" : "Finished this lesson?"}
        </p>
        <p className="text-sm text-muted-foreground">{persistenceHint}</p>
      </div>
      {completed ? (
        <Button
          variant="outline"
          onClick={reopenLesson}
          disabled={!ready}
          className="transition-transform duration-200 active:scale-[0.97]"
        >
          <CheckIcon data-icon="inline-start" />
          Completed
        </Button>
      ) : (
        <Button
          onClick={completeLesson}
          disabled={!ready}
          className="transition-transform duration-200 active:scale-[0.97]"
        >
          Mark as Complete
        </Button>
      )}
    </div>
  )
}
