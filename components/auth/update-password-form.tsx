"use client"

import { type FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { PasswordField } from "@/components/auth/password-field"
import { Button } from "@/components/ui/button"
import {
  DEFAULT_AUTH_NEXT,
  FORGOT_PASSWORD_PATH,
} from "@/lib/auth/paths"
import { isSupabaseConfigured } from "@/lib/env"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

type Status = "checking" | "ready" | "expired" | "unconfigured"

export function UpdatePasswordForm() {
  const router = useRouter()
  const [status, setStatus] = useState<Status>("checking")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setStatus("unconfigured")
      return
    }

    const client = createSupabaseBrowserClient()
    if (!client) {
      setStatus("unconfigured")
      return
    }

    let cancelled = false
    client.auth.getUser().then(({ data }) => {
      if (cancelled) {
        return
      }
      setStatus(data.user ? "ready" : "expired")
    })

    return () => {
      cancelled = true
    }
  }, [])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setPending(true)
    const client = createSupabaseBrowserClient()
    if (!client) {
      setPending(false)
      setError("Supabase is not configured.")
      return
    }

    const { error: updateError } = await client.auth.updateUser({ password })
    setPending(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    router.replace(DEFAULT_AUTH_NEXT)
    router.refresh()
  }

  if (status === "checking") {
    return <p className="text-sm text-muted-foreground">Checking your reset link…</p>
  }

  if (status === "unconfigured") {
    return (
      <p className="text-sm text-muted-foreground">
        Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to
        enable authentication.
      </p>
    )
  }

  if (status === "expired") {
    return (
      <div className="grid gap-3">
        <p role="alert" className="text-sm text-destructive">
          This reset link is invalid or has expired.
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
    <form onSubmit={submit} className="grid gap-3">
      <PasswordField
        id="password"
        label="New password"
        autoComplete="new-password"
        value={password}
        onChange={setPassword}
      />
      <PasswordField
        id="confirm-password"
        label="Confirm password"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={setConfirmPassword}
      />
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Please wait…" : "Update password"}
      </Button>
    </form>
  )
}
