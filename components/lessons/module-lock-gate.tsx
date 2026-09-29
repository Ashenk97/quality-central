"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowRightIcon, LockIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { findSection } from "@/lib/curriculum"
import { useModuleLocks } from "@/lib/use-module-locks"

export function ModuleLockGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { ready, synced, locked, nextLesson } = useModuleLocks()
  const lockedModule = ready ? locked.get(pathname) : undefined

  if (!lockedModule) {
    return children
  }

  // Local progress says locked, but the account may still unlock it.
  if (!synced) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-3" aria-busy="true">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    )
  }

  const found = findSection(pathname)
  const section = found && found.href !== pathname ? found : undefined
  const noun = lockedModule.kind === "tool" ? "tool" : "lesson"

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center py-12">
      <div
        role="region"
        aria-labelledby="module-locked-title"
        className="w-full max-w-md rounded-2xl border border-white/10 bg-black/40 p-6 text-left backdrop-blur-xl light:border-black/10 light:bg-white/70"
      >
        <p className="mb-2 inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          <LockIcon className="size-3.5" aria-hidden />
          Locked
        </p>
        <h1
          id="module-locked-title"
          className="font-heading text-2xl font-semibold tracking-tight"
        >
          {lockedModule.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {lockedModule.unlockHint ??
            `Finish the previous ${noun} to open this one.`}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {nextLesson ? (
            <Button asChild>
              <Link href={nextLesson.href}>
                Continue: {nextLesson.title}
                <ArrowRightIcon aria-hidden />
              </Link>
            </Button>
          ) : null}
          <Button asChild variant="outline">
            <Link href={section?.href ?? "/dashboard"}>
              Back to {section?.title ?? "dashboard"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
