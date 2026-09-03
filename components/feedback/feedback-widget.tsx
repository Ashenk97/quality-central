"use client"

import { type FormEvent, useState } from "react"
import { usePathname } from "next/navigation"
import { MessageSquarePlusIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  submitFeedback,
  validateFeedbackMessage,
  type FeedbackKind,
} from "@/lib/feedback"
import { cn } from "@/lib/utils"

function isFeedbackRoute(pathname: string) {
  return (
    pathname.startsWith("/courses/") ||
    pathname === "/sandbox" ||
    pathname.startsWith("/sandbox/")
  )
}

export function FeedbackWidget() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [kind, setKind] = useState<FeedbackKind>("bug")
  const [message, setMessage] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  if (!isFeedbackRoute(pathname)) {
    return null
  }

  function reset() {
    setKind("bug")
    setMessage("")
    setError(null)
    setPending(false)
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const messageError = validateFeedbackMessage(message)
    if (messageError) {
      setError(messageError)
      return
    }

    setPending(true)
    const result = await submitFeedback({
      kind,
      message,
      pagePath: pathname,
    })
    setPending(false)

    if (!result.ok) {
      setError(result.message)
      return
    }

    toast.success("Feedback sent", {
      description: "Thanks — this helps us shape the beta.",
    })
    setOpen(false)
    reset()
  }

  return (
    <>
      <Button
        type="button"
        size="lg"
        onClick={() => {
          reset()
          setOpen(true)
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          "print:hidden fixed z-40 gap-2 shadow-card",
          "right-4 bottom-20 md:right-6 md:bottom-24"
        )}
      >
        <MessageSquarePlusIcon data-icon="inline-start" />
        Send Feedback
      </Button>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) {
            reset()
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <form onSubmit={onSubmit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Send feedback</DialogTitle>
              <DialogDescription>
                Quick bug reports and UX notes go to the beta inbox. Include what
                you expected versus what happened.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="feedback-kind">Type</Label>
                <Select
                  value={kind}
                  onValueChange={(value) => setKind(value as FeedbackKind)}
                >
                  <SelectTrigger id="feedback-kind" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bug">Bug report</SelectItem>
                    <SelectItem value="ux">UX note</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="feedback-message">What happened?</Label>
                <Textarea
                  id="feedback-message"
                  value={message}
                  aria-invalid={Boolean(error)}
                  onChange={(event) => {
                    setMessage(event.target.value)
                    setError(null)
                  }}
                  placeholder="On this page I noticed…"
                  rows={5}
                />
                {error ? (
                  <p role="alert" className="text-xs text-destructive">
                    {error}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Sent from {pathname}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={pending}
                className="transition-transform duration-200 active:scale-[0.97]"
              >
                {pending ? "Sending…" : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
