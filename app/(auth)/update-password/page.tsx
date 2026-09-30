import type { Metadata } from "next"

import { UpdatePasswordForm } from "@/components/auth/update-password-form"

export const metadata: Metadata = {
  title: "Choose a new password",
}

export default function UpdatePasswordPage() {
  return (
    <div className="grid gap-6">
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Choose a new password
        </h1>
        <p className="text-sm text-muted-foreground">
          Use at least 6 characters. After it saves, you stay signed in.
        </p>
      </div>
      <UpdatePasswordForm />
    </div>
  )
}
