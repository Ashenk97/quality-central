import type { Metadata } from "next"

import { AutomationPlayground } from "@/components/playgrounds/automation-playground"

export const metadata: Metadata = {
  title: "Automation Playground",
}

export default function AutomationPlaygroundPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Automation Playground
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Edit a Playwright spec and run a simulated report. This playground
          checks syntax and test() shape — it does not launch a browser yet.
        </p>
      </div>
      <AutomationPlayground />
    </div>
  )
}
