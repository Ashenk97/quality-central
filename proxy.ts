import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

import {
  DEFAULT_AUTH_NEXT,
  isAuthPath,
  isProtectedPath,
  loginUrl,
  safeNextPath,
} from "@/lib/auth/paths"
import { getSupabaseEnv } from "@/lib/env"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const env = getSupabaseEnv()

  let response = NextResponse.next({ request })
  let userId: string | null = null

  if (env) {
    const supabase = createServerClient(env.url, env.anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value)
          }
          response = NextResponse.next({ request })
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options)
          }
        },
      },
    })

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      userId = user?.id ?? null
    } catch {
      userId = null
    }
  }

  // Without Supabase there is no sign-in to complete, so gating every route
  // would lock the app with no way back in. Auth is enforced once it exists.
  if (env && isProtectedPath(pathname) && !userId) {
    const next = `${pathname}${request.nextUrl.search}`
    return NextResponse.redirect(new URL(loginUrl(next), request.url))
  }

  if (isAuthPath(pathname) && userId) {
    const next = safeNextPath(
      request.nextUrl.searchParams.get("next"),
      DEFAULT_AUTH_NEXT
    )
    return NextResponse.redirect(new URL(next, request.url))
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next|__nextjs|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
