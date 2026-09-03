import { createHash } from "node:crypto"

import { createSupabaseServerClient } from "@/lib/supabase/server"

export const CERTIFICATE_NAME_FALLBACK = "QA Engineer"

function firstNonEmpty(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string") {
      const trimmed = value.trim()
      if (trimmed && trimmed.toLowerCase() !== "learner") {
        return trimmed
      }
    }
  }
  return null
}

export async function getCertificateRecipient() {
  const supabase = await createSupabaseServerClient()
  if (!supabase) {
    return { name: CERTIFICATE_NAME_FALLBACK, userId: null }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { name: CERTIFICATE_NAME_FALLBACK, userId: null }
  }

  const { data: profile } = await supabase
    .from("users")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle()

  return {
    userId: user.id,
    name:
      firstNonEmpty(
        profile?.display_name,
        user.user_metadata.full_name,
        user.user_metadata.display_name,
        user.user_metadata.name,
        user.user_metadata.user_name
      ) ?? CERTIFICATE_NAME_FALLBACK,
  }
}

function localYmd(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}${month}${day}`
}

export function createVerificationId(userId: string | null, completedOn: Date) {
  const ymd = localYmd(completedOn)
  const digest = createHash("sha256")
    .update(`${userId ?? "guest"}:${ymd}`)
    .digest("hex")
    .slice(0, 8)
    .toUpperCase()

  return `QC-${ymd}-${digest}`
}

export function formatCompletionDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
