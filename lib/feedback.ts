import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { getLearner } from "@/lib/supabase/progress"

export const FEEDBACK_KINDS = ["bug", "ux"] as const

export type FeedbackKind = (typeof FEEDBACK_KINDS)[number]

export type FeedbackPayload = {
  kind: FeedbackKind
  message: string
  pagePath: string
}

export const FEEDBACK_MESSAGE_MIN = 8
export const FEEDBACK_MESSAGE_MAX = 2000

export function validateFeedbackMessage(message: string) {
  const trimmed = message.trim()
  if (trimmed.length < FEEDBACK_MESSAGE_MIN) {
    return `Write at least ${FEEDBACK_MESSAGE_MIN} characters so we can act on it.`
  }
  if (trimmed.length > FEEDBACK_MESSAGE_MAX) {
    return `Keep it under ${FEEDBACK_MESSAGE_MAX} characters.`
  }
  return null
}

export async function submitFeedback(payload: FeedbackPayload) {
  const client = createSupabaseBrowserClient()
  if (!client) {
    return {
      ok: false as const,
      message: "Feedback is not connected in this environment. Add the Supabase keys from .env.example.",
    }
  }

  const messageError = validateFeedbackMessage(payload.message)
  if (messageError) {
    return { ok: false as const, message: messageError }
  }

  if (payload.kind !== "bug" && payload.kind !== "ux") {
    return { ok: false as const, message: "Choose Bug report or UX note." }
  }

  let userId: string | null = null
  const {
    data: { user },
  } = await client.auth.getUser()

  if (user) {
    try {
      await getLearner(client)
      userId = user.id
    } catch {
      userId = null
    }
  }

  const { error } = await client.from("feedback").insert({
    user_id: userId,
    kind: payload.kind,
    message: payload.message.trim(),
    page_path: payload.pagePath.slice(0, 200),
    viewport:
      typeof window === "undefined"
        ? null
        : `${window.innerWidth}x${window.innerHeight}`,
  })

  if (error) {
    return {
      ok: false as const,
      message: "Could not send feedback. Try again in a moment.",
    }
  }

  return { ok: true as const }
}

const WELCOME_STORAGE_PREFIX = "quality-central.beta-welcome"

export function welcomeStorageKey(userId: string) {
  return `${WELCOME_STORAGE_PREFIX}:${userId}`
}

export async function hasSeenBetaWelcome(userId: string) {
  try {
    if (window.localStorage.getItem(welcomeStorageKey(userId)) === "1") {
      return true
    }
  } catch {
    // Ignore private-mode storage failures and fall through to Supabase.
  }

  const client = createSupabaseBrowserClient()
  if (!client) {
    return false
  }

  const { data } = await client
    .from("users")
    .select("beta_welcome_seen_at")
    .eq("id", userId)
    .maybeSingle()

  return Boolean(data?.beta_welcome_seen_at)
}

export async function markBetaWelcomeSeen(userId: string) {
  try {
    window.localStorage.setItem(welcomeStorageKey(userId), "1")
  } catch {
    // Still persist remotely when localStorage is blocked.
  }

  const client = createSupabaseBrowserClient()
  if (!client) {
    return
  }

  await client
    .from("users")
    .update({ beta_welcome_seen_at: new Date().toISOString() })
    .eq("id", userId)
}
