"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BookOpenIcon, BugIcon, LayoutDashboardIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { hasSeenBetaWelcome, markBetaWelcomeSeen } from "@/lib/feedback"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { getLearner } from "@/lib/supabase/progress"

export function BetaWelcome() {
  const [open, setOpen] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function check() {
      const client = createSupabaseBrowserClient()
      if (!client) {
        return
      }

      const {
        data: { user },
      } = await client.auth.getUser()
      if (!user || cancelled) {
        return
      }

      try {
        await getLearner(client)
      } catch {
        // Welcome can still use localStorage if the profile row is delayed.
      }

      const seen = await hasSeenBetaWelcome(user.id)
      if (cancelled || seen) {
        return
      }

      setUserId(user.id)
      setOpen(true)
    }

    void check()
    return () => {
      cancelled = true
    }
  }, [])

  async function dismiss() {
    setOpen(false)
    if (userId) {
      await markBetaWelcomeSeen(userId)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          void dismiss()
        }
      }}
    >
      <DialogContent className="sm:max-w-lg" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Welcome to the Quality Central beta</DialogTitle>
          <DialogDescription>
            You are signed in. Use the sidebar to move around — start with
            Foundation before API, UI automation, or the Sandbox.
          </DialogDescription>
        </DialogHeader>

        <ul className="grid gap-3 text-sm">
          <li className="flex gap-3 rounded-lg border border-border bg-card p-3">
            <LayoutDashboardIcon className="mt-0.5 size-4 shrink-0 text-indigo-600 dark:text-indigo-300" />
            <div>
              <p className="font-medium">Dashboard</p>
              <p className="text-muted-foreground">
                Your progress across lessons, quizzes, and verified Sandbox
                defects.
              </p>
            </div>
          </li>
          <li className="flex gap-3 rounded-lg border border-border bg-card p-3">
            <BookOpenIcon className="mt-0.5 size-4 shrink-0 text-indigo-600 dark:text-indigo-300" />
            <div>
              <p className="font-medium">Tracks</p>
              <p className="text-muted-foreground">
                Foundation → API Testing → UI Automation, in that order. Each
                lesson unlocks the next.
              </p>
            </div>
          </li>
          <li className="flex gap-3 rounded-lg border border-border bg-card p-3">
            <BugIcon className="mt-0.5 size-4 shrink-0 text-indigo-600 dark:text-indigo-300" />
            <div>
              <p className="font-medium">The Sandbox</p>
              <p className="text-muted-foreground">
                A live buggy checkout for hunt-and-report practice once the
                earlier tracks are underway.
              </p>
            </div>
          </li>
        </ul>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button type="button" variant="ghost" onClick={() => void dismiss()}>
            I&apos;ll look around
          </Button>
          <Button asChild onClick={() => void dismiss()}>
            <Link href="/foundation">Start Foundation</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
