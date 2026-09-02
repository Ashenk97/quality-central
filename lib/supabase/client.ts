import { createBrowserClient } from "@supabase/ssr"

import { getSupabaseEnv } from "@/lib/supabase/config"

export function createSupabaseBrowserClient() {
  const env = getSupabaseEnv()
  if (!env) {
    return null
  }

  return createBrowserClient(env.url, env.anonKey)
}
