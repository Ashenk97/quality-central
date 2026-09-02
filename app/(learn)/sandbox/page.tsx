import { Suspense } from "react"
import type { Metadata } from "next"

import { CatalogNavTabs } from "@/components/catalog/catalog-tabs"
import { BuggyCheckout } from "@/components/sandbox/buggy-checkout"
import { SandboxHunter } from "@/components/sandbox/report-bug-dialog"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "The Sandbox",
}

export default function SandboxPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <CatalogNavTabs active="sandbox" />
      <SandboxHunter />

      <Suspense fallback={<Skeleton className="h-[32rem] w-full rounded-xl" />}>
        <BuggyCheckout />
      </Suspense>
    </div>
  )
}
