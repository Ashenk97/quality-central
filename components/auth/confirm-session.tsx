"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { FORGOT_PASSWORD_PATH, safeNextPath } from "@/lib/auth/paths"
import { isSupabaseConfigured } from "@/lib/env"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

const FLOW_ID_PATTERN = /^[a-zA-Z0-9_-]{8,64}$/

const pendingExchanges = new Map<
  string,
  Promise<{ error: { message: string } | null }>
>()

export function ConfirmSession() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get("code")
  const flowId = searchParams.get("sb_flow_id")
  const next = safeNextPath(searchParams.get("next"))
  const validFlowId = flowId && FLOW_ID_PATTERN.test(flowId) ? flowId : null
  const configured = isSupabaseConfigured()
  const [exchangeError, setExchangeError] = useState("")

  useEffect(() => {
    if (!code || !configured) {
      return
    }

    const client = createSupabaseBrowserClient()
    if (!client) {
      return
    }

    const key = `${code}:${validFlowId ?? ""}`
    let exchange = pendingExchanges.get(key)
    if (!exchange) {
      exchange = client.auth.exchangeCodeForSession(
        code,
        validFlowId ? { flowId: validFlowId } : undefined
      )
      pendingExchanges.set(key, exchange)
    }

    let cancelled = false
    exchange.then(({ error }) => {
      if (cancelled) {
        return
      }
      if (error) {
        setExchangeError(
          "Open the reset email in the same browser you used to request it. If you already did, request a new link and open that one here."
        )
        return
      }
      router.replace(next)
      router.refresh()
    })

    return () => {
      cancelled = true
    }
  }, [code, configured, next, router, validFlowId])

  const message = !configured
    ? "Supabase is not configured."
    : !code
      ? "This link is incomplete. Request a new password reset and open it in this browser."
      : exchangeError

  if (message) {
    return (
      <div className="grid gap-3">
        <p role="alert" className="text-sm text-destructive">
          {message}
        </p>
        <p className="text-sm text-muted-foreground">
          <Link
            href={FORGOT_PASSWORD_PATH}
            className="font-medium text-foreground underline underline-offset-4"
          >
            Request a new link
          </Link>
        </p>
      </div>
    )
  }

  return <p className="text-sm text-muted-foreground">Finishing sign-in…</p>
}
