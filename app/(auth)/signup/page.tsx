import type { Metadata } from "next"

import { AuthForm } from "@/components/auth/auth-form"
import { DEFAULT_AUTH_NEXT, safeNextPath } from "@/lib/auth/paths"

export const metadata: Metadata = {
  title: "Create account",
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const params = await searchParams
  const nextPath = safeNextPath(params.next, DEFAULT_AUTH_NEXT)

  return (
    <div className="grid gap-6">
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Save lesson completion, quiz scores, and Sandbox finds to your
          profile.
        </p>
      </div>
      <AuthForm mode="signup" nextPath={nextPath} />
    </div>
  )
}
