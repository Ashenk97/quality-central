import { Suspense } from "react"
import type { Metadata } from "next"

import { CatalogNavTabs } from "@/components/catalog/catalog-tabs"
import { SandboxExperience } from "@/components/sandbox/sandbox-experience"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "The Sandbox",
}

export default function SandboxPage() {
  return (
    <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-6">
      <CatalogNavTabs active="sandbox" />
      <Suspense fallback={<SandboxSkeleton />}>
        <SandboxExperience />
      </Suspense>
    </div>
  )
}

function SandboxSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-[32rem] w-full rounded-xl" />
    </div>
  )
}
