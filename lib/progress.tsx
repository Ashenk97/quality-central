"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react"

import { lessonModuleSlug, type LessonProgress } from "@/lib/db/types"
import {
  SANDBOX_BUG_POINTS,
  SANDBOX_CATEGORY,
  SANDBOX_DEFECTS,
  type SandboxDefectId,
} from "@/lib/sandbox-defects"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import {
  getLearner,
  fetchRemoteProgress,
  upsertRemoteProgress,
} from "@/lib/supabase/progress"

const STORAGE_KEY = "quality-central.user_progress"
const OWNER_KEY = "quality-central.progress_owner"
const EMPTY_PROGRESS: Record<string, LessonProgress> = {}

type ProgressMap = Record<string, LessonProgress>
export type ProgressSource = "local" | "supabase"

type SyncState = {
  source: ProgressSource
  error: string | null
}

function readStorage(): ProgressMap {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ProgressMap) : EMPTY_PROGRESS
  } catch {
    return EMPTY_PROGRESS
  }
}

function writeStorage(next: ProgressMap) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

const listeners = new Set<() => void>()
let snapshot: ProgressMap = EMPTY_PROGRESS
let hydrated = false
let persistChain: Promise<void> = Promise.resolve()
let syncState: SyncState = {
  source: "local",
  error: null,
}

function emit() {
  for (const listener of listeners) {
    listener()
  }
}

function setSyncState(next: SyncState) {
  syncState = next
  emit()
}

function enqueuePersist(task: () => Promise<void>) {
  persistChain = persistChain
    .then(task)
    .catch((error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Could not save progress"
      setSyncState({ source: "local", error: message })
    })
}

async function persistEntry(category: string, lessonId: string) {
  if (!isSupabaseConfigured()) {
    return
  }

  const client = createSupabaseBrowserClient()
  if (!client) {
    return
  }

  const user = await getLearner(client)
  if (!user) {
    return
  }

  const entry = snapshot[lessonModuleSlug(category, lessonId)]
  if (!entry) {
    return
  }

  try {
    await upsertRemoteProgress(client, user.id, category, lessonId, entry)
    setSyncState({ source: "supabase", error: null })
  } catch (error) {
    if (category === SANDBOX_CATEGORY) {
      return
    }
    throw error
  }
}

async function hydrateFromSupabase() {
  if (!isSupabaseConfigured()) {
    return
  }

  const client = createSupabaseBrowserClient()
  if (!client) {
    return
  }

  const user = await getLearner(client)
  if (!user) {
    setSyncState({ source: "local", error: null })
    return
  }

  const remote = await fetchRemoteProgress(client, user.id)
  const owner = window.localStorage.getItem(OWNER_KEY)
  const local = snapshot
  const sameOwner = !owner || owner === user.id

  snapshot = sameOwner ? { ...local, ...remote } : remote
  window.localStorage.setItem(OWNER_KEY, user.id)
  writeStorage(snapshot)
  setSyncState({ source: "supabase", error: null })

  if (!sameOwner) {
    return
  }

  for (const [moduleSlug, entry] of Object.entries(local)) {
    if (remote[moduleSlug]) {
      continue
    }
    if (!entry.completed && entry.quizScore == null) {
      continue
    }
    const [category, lessonId] = moduleSlug.split("/")
    if (category && lessonId) {
      enqueuePersist(() => persistEntry(category, lessonId))
    }
  }
}

let authListening = false

function startAuthListener() {
  if (authListening || !isSupabaseConfigured()) {
    return
  }

  const client = createSupabaseBrowserClient()
  if (!client) {
    return
  }

  authListening = true
  client.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_IN") {
      enqueuePersist(hydrateFromSupabase)
    }
    if (event === "SIGNED_OUT") {
      setSyncState({ source: "local", error: null })
    }
  })
}

function subscribe(listener: () => void) {
  listeners.add(listener)

  if (!hydrated) {
    hydrated = true
    snapshot = readStorage()
    startAuthListener()
    enqueuePersist(hydrateFromSupabase)
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      snapshot = readStorage()
      emit()
    }
  }

  window.addEventListener("storage", onStorage)

  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

function getSnapshot() {
  return snapshot
}

function getServerSnapshot() {
  return EMPTY_PROGRESS
}

function getSyncSnapshot() {
  return syncState
}

const SERVER_SYNC: SyncState = { source: "local", error: null }

function getServerSyncSnapshot() {
  return SERVER_SYNC
}

function writeEntry(
  category: string,
  lessonId: string,
  patch: Partial<Pick<LessonProgress, "completed" | "completedAt" | "quizScore">>
) {
  const moduleSlug = lessonModuleSlug(category, lessonId)
  const previous = snapshot[moduleSlug]
  snapshot = {
    ...snapshot,
    [moduleSlug]: {
      moduleSlug,
      completed: patch.completed ?? previous?.completed ?? false,
      completedAt:
        patch.completedAt !== undefined
          ? patch.completedAt
          : (previous?.completedAt ?? null),
      quizScore:
        patch.quizScore !== undefined
          ? patch.quizScore
          : (previous?.quizScore ?? null),
    },
  }
  writeStorage(snapshot)
  emit()
  enqueuePersist(() => persistEntry(category, lessonId))
}

type ProgressContextValue = {
  ready: boolean
  entries: ProgressMap
  source: ProgressSource
  syncError: string | null
  isComplete: (category: string, lessonId: string) => boolean
  getQuizScore: (category: string, lessonId: string) => number | null
  markComplete: (category: string, lessonId: string) => void
  markIncomplete: (category: string, lessonId: string) => void
  saveQuizScore: (category: string, lessonId: string, score: number) => void
  isSandboxBugResolved: (bugId: SandboxDefectId) => boolean
  resolveSandboxBug: (bugId: SandboxDefectId) => void
  getSandboxPoints: () => number
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

function subscribeNoop() {
  return () => {}
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const entries = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )
  const sync = useSyncExternalStore(
    subscribe,
    getSyncSnapshot,
    getServerSyncSnapshot
  )
  const ready = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  )

  const isComplete = useCallback(
    (category: string, lessonId: string) => {
      return Boolean(entries[lessonModuleSlug(category, lessonId)]?.completed)
    },
    [entries]
  )

  const getQuizScore = useCallback(
    (category: string, lessonId: string) => {
      return entries[lessonModuleSlug(category, lessonId)]?.quizScore ?? null
    },
    [entries]
  )

  const markComplete = useCallback((category: string, lessonId: string) => {
    writeEntry(category, lessonId, {
      completed: true,
      completedAt: new Date().toISOString(),
    })
  }, [])

  const markIncomplete = useCallback((category: string, lessonId: string) => {
    writeEntry(category, lessonId, {
      completed: false,
      completedAt: null,
    })
  }, [])

  const saveQuizScore = useCallback(
    (category: string, lessonId: string, score: number) => {
      writeEntry(category, lessonId, { quizScore: score })
    },
    []
  )

  const isSandboxBugResolved = useCallback(
    (bugId: SandboxDefectId) => {
      return Boolean(entries[lessonModuleSlug(SANDBOX_CATEGORY, bugId)]?.completed)
    },
    [entries]
  )

  const resolveSandboxBug = useCallback((bugId: SandboxDefectId) => {
    writeEntry(SANDBOX_CATEGORY, bugId, {
      completed: true,
      completedAt: new Date().toISOString(),
      quizScore: SANDBOX_BUG_POINTS,
    })
  }, [])

  const getSandboxPoints = useCallback(() => {
    return SANDBOX_DEFECTS.reduce((sum, defect) => {
      const entry = entries[lessonModuleSlug(SANDBOX_CATEGORY, defect.id)]
      return sum + (entry?.completed ? (entry.quizScore ?? SANDBOX_BUG_POINTS) : 0)
    }, 0)
  }, [entries])

  const value = useMemo(
    () => ({
      ready,
      entries,
      source: sync.source,
      syncError: sync.error,
      isComplete,
      getQuizScore,
      markComplete,
      markIncomplete,
      saveQuizScore,
      isSandboxBugResolved,
      resolveSandboxBug,
      getSandboxPoints,
    }),
    [
      ready,
      entries,
      sync.source,
      sync.error,
      isComplete,
      getQuizScore,
      markComplete,
      markIncomplete,
      saveQuizScore,
      isSandboxBugResolved,
      resolveSandboxBug,
      getSandboxPoints,
    ]
  )

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  )
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (!context) {
    throw new Error("useProgress must be used within ProgressProvider")
  }
  return context
}
