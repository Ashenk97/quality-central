import { NextResponse } from "next/server"

import { DEFAULT_AUTH_NEXT, safeNextPath } from "@/lib/auth/paths"
import { createSupabaseServerClient } from "@/lib/supabase/server"

const FLOW_ID_PATTERN = /^[a-zA-Z0-9_-]{8,64}$/

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = safeNextPath(searchParams.get("next"), DEFAULT_AUTH_NEXT)
  const flowId = searchParams.get("sb_flow_id")
  const validFlowId = flowId && FLOW_ID_PATTERN.test(flowId) ? flowId : null

  if (code) {
    const supabase = await createSupabaseServerClient()
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(
        code,
        validFlowId ? { flowId: validFlowId } : undefined
      )
      if (error) {
        // The one-time code lives in the browser that requested the email.
        // Let that browser finish the exchange instead of failing here.
        if (error.message.includes("code verifier")) {
          const confirmUrl = new URL("/auth/confirm", origin)
          confirmUrl.searchParams.set("code", code)
          confirmUrl.searchParams.set("next", next)
          if (validFlowId) {
            confirmUrl.searchParams.set("sb_flow_id", validFlowId)
          }
          return NextResponse.redirect(confirmUrl)
        }

        return NextResponse.redirect(
          `${origin}/login?error=${encodeURIComponent(error.message)}`
        )
      }
    }
  }

  return NextResponse.redirect(`${origin}${next}`)
}
