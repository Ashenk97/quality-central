import type { Metadata } from "next"

import { AuthForm } from "@/components/auth/auth-form"
import { DEFAULT_AUTH_NEXT, safeNextPath } from "@/lib/auth/paths"

export const metadata: Metadata = {
  title: "Sign in",
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>
}) {
  const params = await searchParams
  const nextPath = safeNextPath(params.next, DEFAULT_AUTH_NEXT)

  return (
    <div className="grid gap-6">
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Sign in
        </h1>
        <p className="text-sm text-muted-foreground">
          Use GitHub or email to open your dashboard and sync progress.
        </p>
      </div>
      <AuthForm
        mode="login"
        nextPath={nextPath}
        initialError={params.error}
      />
    </div>
  )
}
