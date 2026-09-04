import "server-only"

import { redirect } from "next/navigation"

import { DEFAULT_AUTH_NEXT, loginUrl } from "@/lib/auth/paths"
import { isSupabaseConfigured } from "@/lib/env"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient()
  if (!supabase) {
    return null
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

/**
 * Server-side backstop for the proxy gate. Returns null instead of redirecting
 * when Supabase is absent, matching the proxy: with no auth configured there is
 * no session to require.
 */
export async function requireUser(nextPath = DEFAULT_AUTH_NEXT) {
  const user = await getCurrentUser()
  if (!user && isSupabaseConfigured()) {
    redirect(loginUrl(nextPath))
  }
  return user
}
