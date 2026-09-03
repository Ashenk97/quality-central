"use client"

import { BuggyCheckout } from "@/components/sandbox/buggy-checkout"
import { SandboxQaProvider } from "@/components/sandbox/qa-mode"
import { SandboxHunter } from "@/components/sandbox/report-bug-dialog"

export function SandboxExperience() {
  return (
    <SandboxQaProvider>
      <SandboxHunter />
      <BuggyCheckout />
    </SandboxQaProvider>
  )
}
