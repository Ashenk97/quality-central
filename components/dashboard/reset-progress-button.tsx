"use client"

import { useEffect, useState } from "react"
import { RotateCcwIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useProgress } from "@/lib/progress"

const RESET_TOAST_KEY = "quality-central.reset_toast"

export function ResetProgressButton() {
  const { resetAllProgress, entries } = useProgress()
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  const hasProgress = Object.values(entries).some(
    (entry) => entry.completed || entry.quizScore != null
  )

  useEffect(() => {
    try {
      const pendingToast = window.sessionStorage.getItem(RESET_TOAST_KEY)
      if (!pendingToast) {
        return
      }
      window.sessionStorage.removeItem(RESET_TOAST_KEY)
      toast.success("Progress reset", {
        description: "You're back at the start of the learning path.",
        id: "progress-reset",
      })
    } catch {
      // sessionStorage can be blocked in private mode
    }
  }, [])

  async function onConfirm() {
    if (pending) {
      return
    }

    setPending(true)
    try {
      await resetAllProgress()
      setOpen(false)
      try {
        window.sessionStorage.setItem(RESET_TOAST_KEY, "1")
      } catch {
        toast.success("Progress reset", {
          description: "You're back at the start of the learning path.",
          id: "progress-reset",
        })
      }
      window.location.assign("/dashboard")
    } catch (error) {
      const detail =
        error instanceof Error && error.message.trim()
          ? error.message
          : "Check your connection and try again."
      toast.error("Reset didn't finish", {
        description: detail,
        id: "progress-reset-error",
      })
      setPending(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (pending) {
          return
        }
        setOpen(next)
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!hasProgress}
        >
          <RotateCcwIcon data-icon="inline-start" />
          Reset progress
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset all progress?</DialogTitle>
          <DialogDescription>
            This clears lesson completion, quiz scores, Sandbox finds, earned
            badges, and your local capstone certificate claim. Discussion posts
            and daily-challenge streaks stay. This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={pending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            disabled={pending}
            onClick={() => void onConfirm()}
          >
            {pending ? "Resetting…" : "Reset everything"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
