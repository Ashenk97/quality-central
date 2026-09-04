import type { SupabaseClient } from "@supabase/supabase-js"

import { isSupabaseConfigured } from "@/lib/supabase/config"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { getLearner } from "@/lib/supabase/progress"

const LOCAL_KEY = "quality-central.user_badges"

function readLocalBadges(): string[] {
  if (typeof window === "undefined") {
    return []
  }
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY)
    if (!raw) {
      return []
    }
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.filter((id): id is string => typeof id === "string")
  } catch {
    return []
  }
}

function writeLocalBadges(ids: string[]) {
  if (typeof window === "undefined") {
    return
  }
  window.localStorage.setItem(LOCAL_KEY, JSON.stringify(ids))
}

export async function loadRemoteBadgeIds(): Promise<string[]> {
  const local = readLocalBadges()

  if (!isSupabaseConfigured()) {
    return local
  }

  const client = createSupabaseBrowserClient()
  if (!client) {
    return local
  }

  try {
    const user = await getLearner(client)
    if (!user) {
      return local
    }

    const { data, error } = await client
      .from("user_badges")
      .select("badge_id")
      .eq("user_id", user.id)

    if (error) {
      throw error
    }

    const remote = (data ?? [])
      .map((row) => row.badge_id)
      .filter((id): id is string => typeof id === "string")
    const merged = [...new Set([...local, ...remote])]
    writeLocalBadges(merged)
    return merged
  } catch {
    return local
  }
}

export async function persistBadge(badgeId: string): Promise<"supabase" | "local"> {
  const next = [...new Set([...readLocalBadges(), badgeId])]
  writeLocalBadges(next)

  if (!isSupabaseConfigured()) {
    return "local"
  }

  const client = createSupabaseBrowserClient()
  if (!client) {
    return "local"
  }

  try {
    const user = await getLearner(client)
    if (!user) {
      return "local"
    }

    const { error } = await client.from("user_badges").upsert(
      { user_id: user.id, badge_id: badgeId },
      { onConflict: "user_id,badge_id" }
    )

    if (error) {
      throw error
    }

    return "supabase"
  } catch {
    return "local"
  }
}

export function clearLocalBadges() {
  writeLocalBadges([])
}

export async function clearRemoteBadges(client: SupabaseClient, userId: string) {
  const { error } = await client
    .from("user_badges")
    .delete()
    .eq("user_id", userId)

  if (error) {
    throw error
  }
}
