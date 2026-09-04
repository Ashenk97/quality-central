import "server-only"

import { createClient } from "@supabase/supabase-js"

import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/env"

export function createSupabaseAdminClient() {
  const url = getSupabaseUrl()
  const serviceRoleKey = getSupabaseServiceRoleKey()
  if (!url || !serviceRoleKey) {
    return null
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
