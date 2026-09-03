import type { Metadata } from "next"

import { MockServerDashboard } from "@/components/mock-server-dashboard"
import { requireUser } from "@/lib/auth/session"

export const metadata: Metadata = {
  title: "Custom Mock API",
}

export default async function MockServerPage() {
  await requireUser("/mock-server")

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Custom Mock API
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Define a slug, method, status code, and JSON body. Quality Central
          hosts it at{" "}
          <code className="font-mono text-foreground">
            /api/custom-mock/&lt;slug&gt;
          </code>{" "}
          so you can aim Postman collections or Playwright specs at a live
          endpoint you control.
        </p>
      </div>
      <MockServerDashboard />
    </div>
  )
}
