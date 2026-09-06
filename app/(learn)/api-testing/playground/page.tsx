import type { Metadata } from "next"

import { MockApiPlayground } from "@/components/playgrounds/mock-api-playground"

export const metadata: Metadata = {
  title: "API Playground",
}

export default function ApiPlaygroundPage() {
  return (
    <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-6">
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Mock API Playground
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Send GET and POST requests to the dummy Quality Central API. Status
          codes 200, 404, and 500 are driven by the URL query or JSON{" "}
          <code className="font-mono text-foreground">status</code> field.
        </p>
      </div>
      <MockApiPlayground />
    </div>
  )
}
