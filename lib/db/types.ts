export type Track = "manual" | "api" | "automation" | "technical" | "interview" | "capstone" | "sandbox" | "next-gen"

export type UserRow = {
  id: string
  email: string
  display_name: string | null
  beta_welcome_seen_at: string | null
  created_at: string
  updated_at: string
}

export type FeedbackRow = {
  id: string
  user_id: string | null
  kind: "bug" | "ux"
  message: string
  page_path: string | null
  viewport: string | null
  created_at: string
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

export type DailyChallengeStreakRow = {
  user_id: string
  streak_count: number
  last_answered_on: string | null
  last_challenge_id: string | null
  created_at: string
  updated_at: string
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
