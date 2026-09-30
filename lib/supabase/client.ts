import { createBrowserClient } from "@supabase/ssr"

import { getSupabaseEnv } from "@/lib/supabase/config"

export function createSupabaseBrowserClient() {
  const env = getSupabaseEnv()
  if (!env) {
    return null
  }

  return createBrowserClient(env.url, env.anonKey, {
    auth: {
      experimental: {
        // Lets the callback match this browser's reset or sign-in attempt.
        // The redirect allow list must use a wildcard, which it does.
        appendPkceFlowIdToRedirects: true,
      },
    },
  })
}
