import type { Metadata } from "next"

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata: Metadata = {
  title: "Reset password",
}

export default function ForgotPasswordPage() {
  return (
    <div className="grid gap-6">
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Reset your password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter the email on your account. We will send a link to choose a new
          password.
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  )
}
