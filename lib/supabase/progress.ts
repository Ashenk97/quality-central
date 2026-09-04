import type { SupabaseClient, User } from "@supabase/supabase-js"

import { lessonModuleSlug, type LessonProgress } from "@/lib/db/types"

type Client = SupabaseClient

export async function getLearner(client: Client): Promise<User | null> {
  const {
    data: { user },
  } = await client.auth.getUser()

  if (!user) {
    return null
  }

  const email =
    user.email ??
    (typeof user.user_metadata.email === "string"
      ? user.user_metadata.email
      : `${user.id}@users.quality-central.local`)

  const displayName =
    (typeof user.user_metadata.full_name === "string" &&
      user.user_metadata.full_name) ||
    (typeof user.user_metadata.user_name === "string" &&
      user.user_metadata.user_name) ||
    (typeof user.user_metadata.display_name === "string" &&
      user.user_metadata.display_name) ||
    "Learner"

  const { error } = await client.from("users").upsert(
    {
      id: user.id,
      email,
      display_name: displayName,
    },
    { onConflict: "id" }
  )

  if (error) {
    throw error
  }

  return user
}

export async function fetchRemoteProgress(
  client: Client,
  userId: string
): Promise<Record<string, LessonProgress>> {
  const { data, error } = await client
    .from("user_progress")
    .select("completed, completed_at, quiz_score, modules!inner(category, lesson_id)")
    .eq("user_id", userId)

  if (error) {
    throw error
  }

  const entries: Record<string, LessonProgress> = {}

  for (const raw of data ?? []) {
    const row = raw as {
      completed: boolean
      completed_at: string | null
      quiz_score: number | string | null
      modules:
        | { category: string; lesson_id: string | null }
        | { category: string; lesson_id: string | null }[]
        | null
    }
    const lessonModule = Array.isArray(row.modules)
      ? row.modules[0]
      : row.modules
    const lessonId = lessonModule?.lesson_id
    const category = lessonModule?.category
    if (!lessonId || !category) {
      continue
    }

    const moduleSlug = lessonModuleSlug(category, lessonId)
    entries[moduleSlug] = {
      moduleSlug,
      completed: row.completed,
      completedAt: row.completed_at,
      quizScore: row.quiz_score == null ? null : Number(row.quiz_score),
    }
  }

  return entries
}

export async function upsertRemoteProgress(
  client: Client,
  userId: string,
  category: string,
  lessonId: string,
  entry: LessonProgress
) {
  const { data: lessonModule, error: lessonModuleError } = await client
    .from("modules")
    .select("id")
    .eq("category", category)
    .eq("lesson_id", lessonId)
    .maybeSingle()

  if (lessonModuleError) {
    throw lessonModuleError
  }

  if (!lessonModule) {
    throw new Error(`Unknown module ${category}/${lessonId}`)
  }

  const { error } = await client.from("user_progress").upsert(
    {
      user_id: userId,
      module_id: lessonModule.id,
      completed: entry.completed,
      completed_at: entry.completedAt,
      quiz_score: entry.quizScore,
    },
    { onConflict: "user_id,module_id" }
  )

  if (error) {
    throw error
  }
}

/** Clears account progress via UPDATE (works with existing RLS). Delete is best-effort. */
export async function resetRemoteProgress(client: Client, userId: string) {
  const { error: updateError } = await client
    .from("user_progress")
    .update({
      completed: false,
      completed_at: null,
      quiz_score: null,
    })
    .eq("user_id", userId)

  if (updateError) {
    throw updateError
  }

  const { error: deleteError } = await client
    .from("user_progress")
    .delete()
    .eq("user_id", userId)

  void deleteError
}
