export type Track = "manual" | "api" | "automation" | "sandbox"

export type UserRow = {
  id: string
  email: string
  display_name: string | null
  created_at: string
  updated_at: string
}

export type ModuleRow = {
  id: string
  slug: string
  title: string
  description: string | null
  track: Track
  category: string
  lesson_id: string | null
  sort_order: number
  created_at: string
}

export type UserProgressRow = {
  id: string
  user_id: string
  module_id: string
  completed: boolean
  completed_at: string | null
  quiz_score: number | null
  created_at: string
  updated_at: string
}

export type LessonProgress = {
  moduleSlug: string
  completed: boolean
  completedAt: string | null
  quizScore: number | null
}

/** @deprecated Use LessonProgress */
export type SimulatedProgress = LessonProgress

export function lessonModuleSlug(category: string, lessonId: string) {
  return `${category}/${lessonId}`
}
