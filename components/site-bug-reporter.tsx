"use client"

import { type FormEvent, useState } from "react"
import { usePathname } from "next/navigation"
import { BugIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import {
  SITE_BUG_SEVERITIES,
  submitSiteBug,
  validateSiteBugDetails,
  validateSiteBugTitle,
  type SiteBugSeverity,
} from "@/lib/site-bugs"
import { cn } from "@/lib/utils"

export function SiteBugReporter() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [details, setDetails] = useState("")
  const [severity, setSeverity] = useState<SiteBugSeverity>("medium")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  function reset() {
    setTitle("")
    setDetails("")
    setSeverity("medium")
    setError(null)
    setPending(false)
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const titleError = validateSiteBugTitle(title)
    const detailsError = validateSiteBugDetails(details)
    const nextError = titleError ?? detailsError
    if (nextError) {
      setError(nextError)
      return
    }

    setPending(true)
    const result = await submitSiteBug({
      title,
      details,
      severity,
      pagePath: pathname,
    })
    setPending(false)

    if (!result.ok) {
      setError(result.message)
      return
    }

    toast.success("Bug filed", {
      description: "Thanks — we logged this against the live platform.",
    })
    setOpen(false)
    reset()
  }

  return (
    <>
      <footer className="print:hidden pointer-events-none fixed inset-x-0 bottom-0 z-30 flex items-end justify-start p-3 md:p-4">
        <button
          type="button"
          onClick={() => {
            reset()
            setOpen(true)
          }}
          className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 font-mono text-xs text-muted-foreground shadow-card backdrop-blur-md transition-colors hover:border-qa-bug/40 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none light:border-black/10 light:bg-white/70"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="site-bug-panel"
        >
          <BugIcon className="size-3.5 text-qa-bug" aria-hidden />
          Found a bug on this site?
        </button>
      </footer>

      <Sheet
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) {
            reset()
          }
        }}
      >
        <SheetContent
          id="site-bug-panel"
          side="right"
          className="w-full gap-0 overflow-y-auto sm:max-w-md"
        >
          <form onSubmit={onSubmit} className="flex h-full flex-col">
            <SheetHeader className="border-b border-white/10">
              <SheetTitle>Report a platform bug</SheetTitle>
              <SheetDescription>
                Use this for real defects on Quality Central — broken pages,
                auth, progress, or the editor. Sandbox training bugs stay in QA
                Mode.
              </SheetDescription>
            </SheetHeader>

            <div className="grid flex-1 gap-4 p-4">
              <div className="grid gap-1.5">
                <Label htmlFor="site-bug-title">Summary</Label>
                <Input
                  id="site-bug-title"
                  value={title}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "site-bug-error" : "site-bug-path"}
                  onChange={(event) => {
                    setTitle(event.target.value)
                    setError(null)
                  }}
                  placeholder="Lesson quiz score did not save"
                  autoComplete="off"
                />
              </div>

              <fieldset className="grid gap-2">
                <legend className="text-sm font-medium">Severity</legend>
                <div
                  role="radiogroup"
                  aria-label="Bug severity"
                  className="flex flex-wrap gap-2"
                >
                  {SITE_BUG_SEVERITIES.map((level) => (
                    <label
                      key={level}
                      className={cn(
                        "inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-xs capitalize",
                        severity === level
                          ? "border-qa-primary/50 bg-qa-primary/10 text-foreground"
                          : "border-white/10 text-muted-foreground"
                      )}
                    >
                      <input
                        type="radio"
                        name="site-bug-severity"
                        value={level}
                        checked={severity === level}
                        onChange={() => setSeverity(level)}
                        className="accent-[var(--qa-primary)]"
                      />
                      {level}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="grid gap-1.5">
                <Label htmlFor="site-bug-details">What happened?</Label>
                <Textarea
                  id="site-bug-details"
                  value={details}
                  aria-invalid={Boolean(error)}
                  onChange={(event) => {
                    setDetails(event.target.value)
                    setError(null)
                  }}
                  placeholder="Steps, expected result, and what you saw instead."
                  rows={6}
                />
                {error ? (
                  <p id="site-bug-error" role="alert" className="text-xs text-qa-bug">
                    {error}
                  </p>
                ) : (
                  <p id="site-bug-path" className="font-mono text-xs text-muted-foreground">
                    Filing from {pathname}
                  </p>
                )}
              </div>
            </div>

            <SheetFooter className="border-t border-white/10">
              <Button type="submit" disabled={pending}>
                {pending ? "Filing…" : "Submit bug"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  )
}
