"use client"

import { useState } from "react"
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

export function ResetProgressButton() {
  const { resetAllProgress, entries } = useProgress()
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  const hasProgress = Object.values(entries).some(
    (entry) => entry.completed || entry.quizScore != null
  )

  async function onConfirm() {
    setPending(true)
    try {
      await resetAllProgress()
      toast.success("Progress reset", {
        description: "You can start the learning path from the beginning.",
      })
      setOpen(false)
      window.location.reload()
    } catch (error) {
      toast.error("Could not reset progress", {
        description:
          error instanceof Error
            ? error.message
            : "Try again in a moment.",
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
