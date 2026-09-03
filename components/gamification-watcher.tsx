"use client"

import { useEffect, useRef } from "react"
import {
  BugIcon,
  MonitorPlayIcon,
  SparklesIcon,
  WandSparklesIcon,
} from "lucide-react"
import { toast } from "sonner"

import {
  evaluateEarnedBadges,
  type BadgeDefinition,
} from "@/lib/badges"
import { useProgress } from "@/lib/progress"
import { persistBadge } from "@/lib/supabase/badges"

function badgeIcon(badge: BadgeDefinition) {
  if (badge.id === "bug-hunter") {
    return <BugIcon className="size-4 text-success" />
  }
  if (badge.id === "api-wizard") {
    return <WandSparklesIcon className="size-4 text-primary" />
  }
  if (badge.id === "automation-apprentice") {
    return <MonitorPlayIcon className="size-4 text-primary" />
  }
  return <SparklesIcon className="size-4 text-primary" />
}

function celebrate(badge: BadgeDefinition) {
  if (badge.kind === "node") {
    toast.success(`${badge.title} unlocked`, {
      description: badge.description,
      icon: badgeIcon(badge),
    })
    return
  }

  toast.success(`Badge earned: ${badge.title}`, {
    description: badge.description,
    icon: badgeIcon(badge),
  })
}

export function GamificationWatcher() {
  const progress = useProgress()
  const previous = useRef<Set<string> | null>(null)
  const toastAfter = useRef(0)

  useEffect(() => {
    if (!progress.ready) {
      return
    }

    const earned = evaluateEarnedBadges(progress)
    const current = new Set(earned.map((badge) => badge.id))

    if (previous.current === null) {
      previous.current = current
      toastAfter.current = Date.now() + 2500
      for (const badge of earned) {
        void persistBadge(badge.id)
      }
      return
    }

    const newlyEarned = earned.filter(
      (badge) => !previous.current?.has(badge.id)
    )
    previous.current = current

    if (Date.now() < toastAfter.current) {
      return
    }

    for (const badge of newlyEarned) {
      void persistBadge(badge.id)
      celebrate(badge)
    }
  }, [progress])

  return null
}
