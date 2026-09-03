import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { getLearner } from "@/lib/supabase/progress"

export const SITE_BUG_SEVERITIES = ["low", "medium", "high"] as const

export type SiteBugSeverity = (typeof SITE_BUG_SEVERITIES)[number]

export type SiteBugPayload = {
  title: string
  details: string
  severity: SiteBugSeverity
  pagePath: string
}

export const SITE_BUG_TITLE_MIN = 4
export const SITE_BUG_TITLE_MAX = 120
export const SITE_BUG_DETAILS_MIN = 8
export const SITE_BUG_DETAILS_MAX = 2000

export function validateSiteBugTitle(title: string) {
  const trimmed = title.trim()
  if (trimmed.length < SITE_BUG_TITLE_MIN) {
    return `Give the bug a name of at least ${SITE_BUG_TITLE_MIN} characters.`
  }
  if (trimmed.length > SITE_BUG_TITLE_MAX) {
    return `Keep the title under ${SITE_BUG_TITLE_MAX} characters.`
  }
  return null
}

export function validateSiteBugDetails(details: string) {
  const trimmed = details.trim()
  if (trimmed.length < SITE_BUG_DETAILS_MIN) {
    return `Describe what happened in at least ${SITE_BUG_DETAILS_MIN} characters.`
  }
  if (trimmed.length > SITE_BUG_DETAILS_MAX) {
    return `Keep the details under ${SITE_BUG_DETAILS_MAX} characters.`
  }
  return null
}

export async function submitSiteBug(payload: SiteBugPayload) {
  const client = createSupabaseBrowserClient()
  if (!client) {
    return {
      ok: false as const,
      message:
        "Bug reports are not connected in this environment. Add the Supabase keys from .env.example.",
    }
  }

  const titleError = validateSiteBugTitle(payload.title)
  if (titleError) {
    return { ok: false as const, message: titleError }
  }

  const detailsError = validateSiteBugDetails(payload.details)
  if (detailsError) {
    return { ok: false as const, message: detailsError }
  }

  if (!SITE_BUG_SEVERITIES.includes(payload.severity)) {
    return { ok: false as const, message: "Choose a severity." }
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

  const { error } = await client.from("site_bugs").insert({
    user_id: userId,
    title: payload.title.trim(),
    details: payload.details.trim(),
    severity: payload.severity,
    page_path: payload.pagePath.slice(0, 200),
    viewport:
      typeof window === "undefined"
        ? null
        : `${window.innerWidth}x${window.innerHeight}`,
  })

  if (error) {
    const missingTable =
      error.code === "PGRST205" ||
      error.code === "42P01" ||
      /site_bugs/i.test(error.message)
    return {
      ok: false as const,
      message: missingTable
        ? "Bug reports need the site_bugs table. Run supabase/migrations/20260904000005_site_bugs.sql in the Supabase SQL Editor."
        : "Could not file the bug. Try again in a moment.",
    }
  }

  return { ok: true as const }
}
