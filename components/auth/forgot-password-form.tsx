"use client"

import { type FormEvent, useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LOGIN_PATH, UPDATE_PASSWORD_PATH } from "@/lib/auth/paths"
import { getAuthCallbackUrl, isSupabaseConfigured } from "@/lib/env"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")
  const [pending, setPending] = useState(false)
  const configured = isSupabaseConfigured()

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setInfo("")
    setPending(true)

    const client = createSupabaseBrowserClient()
    if (!client) {
      setPending(false)
      setError("Supabase is not configured.")
      return
    }

    const { error: resetError } = await client.auth.resetPasswordForEmail(
      email,
      { redirectTo: getAuthCallbackUrl(UPDATE_PASSWORD_PATH) }
    )

    setPending(false)

    if (resetError) {
      setError(resetError.message)
      return
    }

    setInfo(
      "If an account exists for that email, we sent a link to choose a new password. Open that link in this same browser."
    )
  }

  return (
    <form onSubmit={submit} className="grid gap-3">
      <div className="grid gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
        />
      </div>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      {info ? (
        <p role="status" className="text-sm text-muted-foreground">
          {info}
        </p>
      ) : null}
      {!configured ? (
        <p className="text-sm text-muted-foreground">
          Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to
          enable authentication.
        </p>
      ) : null}
      <Button type="submit" disabled={!configured || pending}>
        {pending ? "Please wait…" : "Send reset link"}
      </Button>
      <p className="text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link
          href={LOGIN_PATH}
          className="font-medium text-foreground underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </form>
  )
}
