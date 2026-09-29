"use client"

import { useMemo } from "react"

import {
  countResolvedDefects,
  resolveCatalog,
  type ResolvedModule,
} from "@/lib/catalog"
import { useProgress } from "@/lib/progress"

export type ModuleLocks = {
  /** Local progress is loaded; locks may still change once the account syncs. */
  ready: boolean
  synced: boolean
  /** Locked modules keyed by href. */
  locked: Map<string, ResolvedModule>
  /** First open lesson, for sending learners somewhere useful. */
  nextLesson: ResolvedModule | undefined
}

export function useModuleLocks(): ModuleLocks {
  const {
    ready,
    synced,
    isComplete,
    getQuizScore,
    isSandboxBugResolved,
    getSandboxPoints,
  } = useProgress()
  const sandboxResolved = countResolvedDefects(isSandboxBugResolved)

  return useMemo(() => {
    const { modules } = resolveCatalog({
      isComplete,
      getQuizScore,
      sandboxResolved,
      sandboxPoints: getSandboxPoints(),
    })

    const locked = new Map<string, ResolvedModule>()
    for (const item of modules) {
      if (item.status === "locked") {
        locked.set(item.href, item)
      }
    }

    const nextLesson = modules.find(
      (item) => item.kind === "lesson" && item.status === "in-progress"
    )

    return { ready, synced, locked, nextLesson }
  }, [ready, synced, isComplete, getQuizScore, getSandboxPoints, sandboxResolved])
}
