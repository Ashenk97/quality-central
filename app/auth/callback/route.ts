import { NextResponse } from "next/server"

import { DEFAULT_AUTH_NEXT, safeNextPath } from "@/lib/auth/paths"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = safeNextPath(searchParams.get("next"), DEFAULT_AUTH_NEXT)

  if (code) {
    const supabase = await createSupabaseServerClient()
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) {
        return NextResponse.redirect(
          `${origin}/login?error=${encodeURIComponent(error.message)}`
        )
      }
    }
  }

  return NextResponse.redirect(`${origin}${next}`)
}
