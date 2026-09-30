import type { Metadata } from "next"

import { ConfirmSession } from "@/components/auth/confirm-session"
import { Brand } from "@/components/brand"
import { ModeToggle } from "@/components/layout/mode-toggle"

export const metadata: Metadata = {
  title: "Confirm sign-in",
}

export default function ConfirmPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b pt-[env(safe-area-inset-top,0px)]">
        <div className="flex h-14 items-center justify-between px-4 md:px-8">
          <Brand />
          <ModeToggle />
        </div>
      </header>
      <main
        id="main-content"
        className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12 pb-24"
      >
        <div className="grid gap-6">
          <div className="space-y-2">
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              Confirming your link
            </h1>
            <p className="text-sm text-muted-foreground">
              This finishes the password reset or sign-in you just started.
            </p>
          </div>
          <ConfirmSession />
        </div>
      </main>
    </div>
  )
}
