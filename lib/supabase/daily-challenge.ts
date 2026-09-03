import { EMPTY_STREAK, type DailyStreakState } from "@/lib/daily-challenge"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { getLearner } from "@/lib/supabase/progress"

const LOCAL_KEY = "quality-central.daily_challenge"

function readLocalStreak(): DailyStreakState {
  if (typeof window === "undefined") {
    return EMPTY_STREAK
  }
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY)
    if (!raw) {
      return EMPTY_STREAK
    }
    const parsed = JSON.parse(raw) as Partial<DailyStreakState>
    return {
      streakCount:
        typeof parsed.streakCount === "number" && parsed.streakCount >= 0
          ? parsed.streakCount
          : 0,
      lastAnsweredOn:
        typeof parsed.lastAnsweredOn === "string" ? parsed.lastAnsweredOn : null,
      lastChallengeId:
        typeof parsed.lastChallengeId === "string"
          ? parsed.lastChallengeId
          : null,
    }
  } catch {
    return EMPTY_STREAK
  }
}

function writeLocalStreak(state: DailyStreakState) {
  if (typeof window === "undefined") {
    return
  }
  window.localStorage.setItem(LOCAL_KEY, JSON.stringify(state))
}

export async function loadDailyStreak(): Promise<{
  state: DailyStreakState
  source: "supabase" | "local"
}> {
  const local = readLocalStreak()

  if (!isSupabaseConfigured()) {
    return { state: local, source: "local" }
  }

  const client = createSupabaseBrowserClient()
  if (!client) {
    return { state: local, source: "local" }
  }

  try {
    const user = await getLearner(client)
    if (!user) {
      return { state: local, source: "local" }
    }

    const { data, error } = await client
      .from("daily_challenge_streaks")
      .select("streak_count, last_answered_on, last_challenge_id")
      .eq("user_id", user.id)
      .maybeSingle()

    if (error) {
      throw error
    }

    if (!data) {
      return { state: local, source: "supabase" }
    }

    const state: DailyStreakState = {
      streakCount: Number(data.streak_count) || 0,
      lastAnsweredOn: data.last_answered_on,
      lastChallengeId: data.last_challenge_id,
    }
    writeLocalStreak(state)
    return { state, source: "supabase" }
  } catch {
    return { state: local, source: "local" }
  }
}

export async function saveDailyStreak(state: DailyStreakState): Promise<"supabase" | "local"> {
  writeLocalStreak(state)

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

    const { error } = await client.from("daily_challenge_streaks").upsert(
      {
        user_id: user.id,
        streak_count: state.streakCount,
        last_answered_on: state.lastAnsweredOn,
        last_challenge_id: state.lastChallengeId,
      },
      { onConflict: "user_id" }
    )

    if (error) {
      throw error
    }

    return "supabase"
  } catch {
    return "local"
  }
}
