"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { FORGOT_PASSWORD_PATH, safeNextPath } from "@/lib/auth/paths"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

const FLOW_ID_PATTERN = /^[a-zA-Z0-9_-]{8,64}$/

const pendingExchanges = new Map<
  string,
  Promise<{ error: { message: string } | null }>
>()

export function ConfirmSession() {
  const router = useRouter()
  const [error, setError] = useState("")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get("code")
    const flowId = params.get("sb_flow_id")
    const next = safeNextPath(params.get("next"))
    const validFlowId = flowId && FLOW_ID_PATTERN.test(flowId) ? flowId : null

    if (!code) {
      setError(
        "This link is incomplete. Request a new password reset and open it in this browser."
      )
      return
    }

    const client = createSupabaseBrowserClient()
    if (!client) {
      setError("Supabase is not configured.")
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
    exchange.then(({ error: exchangeError }) => {
      if (cancelled) {
        return
      }
      if (exchangeError) {
        setError(
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
  }, [router])

  if (error) {
    return (
      <div className="grid gap-3">
        <p role="alert" className="text-sm text-destructive">
          {error}
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

  return (
    <p className="text-sm text-muted-foreground">Finishing sign-in…</p>
  )
}
