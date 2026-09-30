"use client"

import { type FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { PasswordField } from "@/components/auth/password-field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  DEFAULT_AUTH_NEXT,
  FORGOT_PASSWORD_PATH,
  LOGIN_PATH,
  PRIVACY_PATH,
  SIGNUP_PATH,
} from "@/lib/auth/paths"
import { getAuthCallbackUrl, isSupabaseConfigured } from "@/lib/env"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

export function AuthForm({
  mode,
  nextPath = DEFAULT_AUTH_NEXT,
  initialError,
}: {
  mode: "login" | "signup"
  nextPath?: string
  initialError?: string
}) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(friendlyAuthError(initialError ?? ""))
  const [info, setInfo] = useState("")
  const [pending, setPending] = useState(false)
  const configured = isSupabaseConfigured()

  async function signInWithProvider(provider: "github" | "google") {
    setError("")
    const client = createSupabaseBrowserClient()
    if (!client) {
      setError("Supabase is not configured.")
      return
    }

    const { error: oauthError } = await client.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: getAuthCallbackUrl(nextPath),
        ...(provider === "github"
          ? { scopes: "read:user user:email" }
          : {}),
      },
    })

    if (oauthError) {
      setError(oauthError.message)
    }
  }

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

    if (mode === "signup") {
      const { data, error: signUpError } = await client.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: getAuthCallbackUrl(nextPath),
        },
      })

      setPending(false)

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      if (data.session) {
        router.replace(nextPath)
        router.refresh()
        return
      }

      setInfo("Check your email to confirm your account, then sign in.")
      return
    }

    const { error: signInError } = await client.auth.signInWithPassword({
      email,
      password,
    })

    setPending(false)

    if (signInError) {
      setError(signInError.message)
      return
    }

    router.replace(nextPath)
    router.refresh()
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => signInWithProvider("google")}
          disabled={!configured || pending}
        >
          <GoogleMark />
          Continue with Google
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => signInWithProvider("github")}
          disabled={!configured || pending}
        >
          <GithubMark />
          Continue with GitHub
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">or email</span>
        <Separator className="flex-1" />
      </div>

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
        <PasswordField
          id="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          value={password}
          onChange={setPassword}
          labelAction={
            mode === "login" ? (
              <Link
                href={FORGOT_PASSWORD_PATH}
                className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Forgot password?
              </Link>
            ) : null
          }
        />
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
          {pending
            ? "Please wait…"
            : mode === "signup"
              ? "Create account"
              : "Sign in"}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link
              href={`${LOGIN_PATH}?next=${encodeURIComponent(nextPath)}`}
              className="font-medium text-foreground underline underline-offset-4"
            >
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link
              href={`${SIGNUP_PATH}?next=${encodeURIComponent(nextPath)}`}
              className="font-medium text-foreground underline underline-offset-4"
            >
              Create an account
            </Link>
          </>
        )}
      </p>

      {mode === "signup" ? (
        <p className="text-xs text-muted-foreground">
          By creating an account you agree to how we handle your data in the{" "}
          <Link
            href={PRIVACY_PATH}
            className="underline underline-offset-4 hover:text-foreground"
          >
            privacy notice
          </Link>
          .
        </p>
      ) : null}
    </div>
  )
}

function friendlyAuthError(message: string) {
  if (message.includes("code verifier")) {
    return "Open the reset link in the same browser where you requested it, or request a new link."
  }
  return message
}

function GoogleMark() {
  return (
    <svg
      data-icon="inline-start"
      viewBox="0 0 48 48"
      aria-hidden="true"
      className="size-4"
    >
      <path
        fill="#FFC107"
        d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.3 4.2-4.3 5.5l6.3 5.3C40.2 35.9 44 30.6 44 24c0-1.3-.1-2.6-.4-3.9z"
      />
    </svg>
  )
}

function GithubMark() {
  return (
    <svg
      data-icon="inline-start"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-4"
    >
      <path
        fill="currentColor"
        d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2 0-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.2 0 4.7-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A12 12 0 0 0 12 .3"
      />
    </svg>
  )
}
