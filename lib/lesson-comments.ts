import type { User } from "@supabase/supabase-js"

import type { LessonCommentRow } from "@/lib/db/types"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { getLearner } from "@/lib/supabase/progress"

export const LESSON_COMMENT_MIN = 8
export const LESSON_COMMENT_MAX = 2000

export type LessonComment = {
  id: string
  userId: string
  parentId: string | null
  body: string
  authorName: string
  voteCount: number
  createdAt: string
  voted: boolean
}

export type LessonCommentThread = LessonComment & {
  replies: LessonComment[]
}

const MISSING_TABLE_MESSAGE =
  "Discussion needs the lesson_comments table. Run supabase/migrations/20260904000006_lesson_comments.sql in the Supabase SQL Editor."

function isMissingTable(error: { code?: string; message?: string }) {
  return (
    error.code === "PGRST205" ||
    error.code === "42P01" ||
    /lesson_comments|lesson_comment_votes/i.test(error.message ?? "")
  )
}

function mapComment(row: LessonCommentRow, votedIds: Set<string>): LessonComment {
  return {
    id: row.id,
    userId: row.user_id,
    parentId: row.parent_id,
    body: row.body,
    authorName: row.author_name,
    voteCount: row.vote_count,
    createdAt: row.created_at,
    voted: votedIds.has(row.id),
  }
}

export function nestLessonComments(comments: LessonComment[]): LessonCommentThread[] {
  const replies = new Map<string, LessonComment[]>()
  const roots: LessonComment[] = []

  for (const comment of comments) {
    if (!comment.parentId) {
      roots.push(comment)
      continue
    }
    const list = replies.get(comment.parentId) ?? []
    list.push(comment)
    replies.set(comment.parentId, list)
  }

  return roots.map((root) => ({
    ...root,
    replies: (replies.get(root.id) ?? []).sort((a, b) => {
      if (b.voteCount !== a.voteCount) {
        return b.voteCount - a.voteCount
      }
      return a.createdAt.localeCompare(b.createdAt)
    }),
  }))
}

export function validateLessonCommentBody(body: string) {
  const trimmed = body.trim()
  if (trimmed.length < LESSON_COMMENT_MIN) {
    return `Write at least ${LESSON_COMMENT_MIN} characters.`
  }
  if (trimmed.length > LESSON_COMMENT_MAX) {
    return `Keep it under ${LESSON_COMMENT_MAX} characters.`
  }
  return null
}

export function authorNameFromUser(user: User, displayName?: string | null) {
  const candidates = [
    displayName,
    typeof user.user_metadata.full_name === "string"
      ? user.user_metadata.full_name
      : null,
    typeof user.user_metadata.user_name === "string"
      ? user.user_metadata.user_name
      : null,
    typeof user.user_metadata.display_name === "string"
      ? user.user_metadata.display_name
      : null,
    user.email?.split("@")[0] ?? null,
  ]

  for (const candidate of candidates) {
    const name = candidate?.trim()
    if (name) {
      return name.slice(0, 80)
    }
  }

  return "Learner"
}

export async function getLessonCommentViewer() {
  const client = createSupabaseBrowserClient()
  if (!client) {
    return { client: null, user: null as User | null }
  }

  const {
    data: { user },
  } = await client.auth.getUser()

  return { client, user }
}

export async function fetchLessonComments(category: string, lessonId: string) {
  const { client, user } = await getLessonCommentViewer()
  if (!client) {
    return {
      ok: false as const,
      message:
        "Discussion is not connected in this environment. Add the Supabase keys from .env.example.",
      threads: [] as LessonCommentThread[],
      userId: null as string | null,
    }
  }

  const { data, error } = await client
    .from("lesson_comments")
    .select(
      "id, user_id, category, lesson_id, parent_id, body, author_name, vote_count, created_at"
    )
    .eq("category", category)
    .eq("lesson_id", lessonId)
    .order("created_at", { ascending: true })

  if (error) {
    return {
      ok: false as const,
      message: isMissingTable(error)
        ? MISSING_TABLE_MESSAGE
        : "Could not load the discussion. Try again in a moment.",
      threads: [] as LessonCommentThread[],
      userId: user?.id ?? null,
    }
  }

  const rows = (data ?? []) as LessonCommentRow[]
  const ids = rows.map((row) => row.id)
  const votedIds = new Set<string>()

  if (user && ids.length > 0) {
    const { data: votes } = await client
      .from("lesson_comment_votes")
      .select("comment_id")
      .eq("user_id", user.id)
      .in("comment_id", ids)

    for (const vote of votes ?? []) {
      votedIds.add((vote as { comment_id: string }).comment_id)
    }
  }

  return {
    ok: true as const,
    threads: nestLessonComments(rows.map((row) => mapComment(row, votedIds))),
    userId: user?.id ?? null,
  }
}

export async function postLessonComment({
  category,
  lessonId,
  body,
  parentId = null,
}: {
  category: string
  lessonId: string
  body: string
  parentId?: string | null
}) {
  const bodyError = validateLessonCommentBody(body)
  if (bodyError) {
    return { ok: false as const, message: bodyError }
  }

  const { client, user } = await getLessonCommentViewer()
  if (!client) {
    return {
      ok: false as const,
      message:
        "Discussion is not connected in this environment. Add the Supabase keys from .env.example.",
    }
  }

  if (!user) {
    return { ok: false as const, message: "Sign in to join the discussion." }
  }

  try {
    await getLearner(client)
  } catch {
    return {
      ok: false as const,
      message: "Could not verify your account. Try signing in again.",
    }
  }

  const { data, error } = await client
    .from("lesson_comments")
    .insert({
      user_id: user.id,
      category,
      lesson_id: lessonId,
      parent_id: parentId,
      body: body.trim(),
      author_name: authorNameFromUser(user),
    })
    .select(
      "id, user_id, category, lesson_id, parent_id, body, author_name, vote_count, created_at"
    )
    .single()

  if (error || !data) {
    return {
      ok: false as const,
      message: error && isMissingTable(error)
        ? MISSING_TABLE_MESSAGE
        : "Could not post. Try again in a moment.",
    }
  }

  return {
    ok: true as const,
    comment: mapComment(data as LessonCommentRow, new Set()),
  }
}

export async function toggleLessonCommentVote(commentId: string, currentlyVoted: boolean) {
  const { client, user } = await getLessonCommentViewer()
  if (!client || !user) {
    return { ok: false as const, message: "Sign in to upvote an answer." }
  }

  try {
    await getLearner(client)
  } catch {
    return {
      ok: false as const,
      message: "Could not verify your account. Try signing in again.",
    }
  }

  const query = currentlyVoted
    ? client
        .from("lesson_comment_votes")
        .delete()
        .eq("comment_id", commentId)
        .eq("user_id", user.id)
    : client.from("lesson_comment_votes").insert({
        comment_id: commentId,
        user_id: user.id,
      })

  const { error } = await query

  if (error) {
    const ownComment = /upvote your own/i.test(error.message)
    return {
      ok: false as const,
      message: ownComment
        ? "You cannot upvote your own comment."
        : isMissingTable(error)
          ? MISSING_TABLE_MESSAGE
          : "Could not update the vote. Try again in a moment.",
    }
  }

  return { ok: true as const }
}
