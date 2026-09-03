"use client"

import { type FormEvent, useState } from "react"
import { BugIcon, CheckIcon, PartyPopperIcon } from "lucide-react"

import { DifficultyBadge } from "@/components/difficulty-badge"
import { QaModeToggle } from "@/components/sandbox/qa-mode"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useProgress } from "@/lib/progress"
import {
  evaluateSandboxReport,
  MAX_SANDBOX_POINTS,
  SANDBOX_COORDINATES,
  SANDBOX_DEFECTS,
  type BugFieldErrors,
  type BugVerdict,
  type SandboxBugCategory,
  type SandboxCoordinateId,
} from "@/lib/sandbox-defects"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const EMPTY_FORM = {
  category: "" as SandboxBugCategory | "",
  coordinate: "" as SandboxCoordinateId | "",
  steps: "",
  expected: "",
  actual: "",
}

export function SandboxHunter() {
  const {
    ready,
    isSandboxBugResolved,
    resolveSandboxBug,
    getSandboxPoints,
  } = useProgress()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState<BugFieldErrors>({})
  const [verdict, setVerdict] = useState<(BugVerdict & { alreadyFound?: boolean }) | null>(
    null
  )

  const points = getSandboxPoints()

  function resetForm() {
    setForm(EMPTY_FORM)
    setFieldErrors({})
    setVerdict(null)
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = evaluateSandboxReport(form)
    if (!result.ok) {
      setFieldErrors(result.fields ?? {})
      const firstFieldMessage = result.fields
        ? Object.values(result.fields)[0]
        : undefined
      setVerdict(result.message === firstFieldMessage ? null : result)
      return
    }

    setFieldErrors({})
    const alreadyFound = isSandboxBugResolved(result.defectId)
    const remainingAfter = SANDBOX_DEFECTS.filter(
      (defect) =>
        defect.id !== result.defectId && !isSandboxBugResolved(defect.id)
    ).length

    if (!alreadyFound) {
      resolveSandboxBug(result.defectId)
      toast.success("Nice catch!", {
        icon: <PartyPopperIcon className="size-4" />,
        description:
          remainingAfter === 0
            ? `${result.title} confirmed. All three seeded defects are logged. +${result.points} pts.`
            : `${result.title} confirmed. +${result.points} pts · ${remainingAfter} left.`,
        duration: 6000,
      })
    } else {
      toast.message(`Already logged: ${result.title}`, {
        description: "No extra points this time.",
      })
    }
    setVerdict({ ...result, alreadyFound })
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            The Sandbox
          </h1>
          <DifficultyBadge difficulty="advanced" />
          <span className="font-mono text-xs text-muted-foreground">
            {ready ? `${points} / ${MAX_SANDBOX_POINTS} pts` : "—"}
          </span>
        </div>
        <p className="max-w-2xl text-muted-foreground">
          Hunt defects in this live Nimbus Outfitters checkout. Treat it like a
          production store: explore the UI, try odd inputs, and file what you
          find. Do not assume the happy path is clean.
        </p>
        <VerifiedList />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <QaModeToggle />
        <Dialog
          open={open}
          onOpenChange={(next) => {
            setOpen(next)
            if (next) {
              resetForm()
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="transition-transform duration-200 active:scale-[0.97]">
              <BugIcon data-icon="inline-start" />
              Report Bug
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <form onSubmit={submit} noValidate className="grid gap-4">
              <DialogHeader>
                <DialogTitle>Report a defect</DialogTitle>
                <DialogDescription>
                  Log what you found. Reports are checked against the seeded
                  Sandbox coordinates — only a matching, specific write-up is
                  credited.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="bug-category">Bug category</Label>
                  <Select
                    value={form.category}
                    onValueChange={(value) => {
                      setForm((current) => ({
                        ...current,
                        category: value as SandboxBugCategory,
                      }))
                      setFieldErrors((current) => ({
                        ...current,
                        category: undefined,
                      }))
                    }}
                  >
                    <SelectTrigger
                      id="bug-category"
                      className="w-full"
                      aria-invalid={Boolean(fieldErrors.category)}
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visual">Visual / layout</SelectItem>
                      <SelectItem value="validation">Validation</SelectItem>
                      <SelectItem value="calculation">
                        Calculation / pricing
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError message={fieldErrors.category} />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="bug-coordinate">Where did you observe it?</Label>
                  <Select
                    value={form.coordinate}
                    onValueChange={(value) => {
                      setForm((current) => ({
                        ...current,
                        coordinate: value as SandboxCoordinateId,
                      }))
                      setFieldErrors((current) => ({
                        ...current,
                        coordinate: undefined,
                      }))
                    }}
                  >
                    <SelectTrigger
                      id="bug-coordinate"
                      className="w-full"
                      aria-invalid={Boolean(fieldErrors.coordinate)}
                    >
                      <SelectValue placeholder="Select a checkout location" />
                    </SelectTrigger>
                    <SelectContent>
                      {SANDBOX_COORDINATES.map((coordinate) => (
                        <SelectItem key={coordinate.id} value={coordinate.id}>
                          {coordinate.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError message={fieldErrors.coordinate} />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="bug-steps">Steps to reproduce</Label>
                  <Textarea
                    id="bug-steps"
                    value={form.steps}
                    aria-invalid={Boolean(fieldErrors.steps)}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        steps: event.target.value,
                      }))
                    }
                    placeholder="1. Resize the viewport… 2. Try the payment fields…"
                    rows={4}
                  />
                  <FieldError message={fieldErrors.steps} />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="bug-expected">Expected result</Label>
                  <Textarea
                    id="bug-expected"
                    value={form.expected}
                    aria-invalid={Boolean(fieldErrors.expected)}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        expected: event.target.value,
                      }))
                    }
                    placeholder="What should happen for a correct checkout?"
                    rows={3}
                  />
                  <FieldError message={fieldErrors.expected} />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="bug-actual">Actual result</Label>
                  <Textarea
                    id="bug-actual"
                    value={form.actual}
                    aria-invalid={Boolean(fieldErrors.actual)}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        actual: event.target.value,
                      }))
                    }
                    placeholder="What did you observe instead?"
                    rows={3}
                  />
                  <FieldError message={fieldErrors.actual} />
                </div>
              </div>

              {verdict ? <VerdictAlert verdict={verdict} /> : null}

              <DialogFooter>
                <Button
                  type="submit"
                  disabled={!ready}
                  className="transition-transform duration-200 active:scale-[0.97]"
                >
                  Submit report
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null
  }

  return (
    <p role="alert" className="text-xs text-destructive">
      {message}
    </p>
  )
}

function VerifiedList() {
  const { ready, isSandboxBugResolved } = useProgress()

  if (!ready) {
    return null
  }

  const resolved = SANDBOX_DEFECTS.filter((defect) =>
    isSandboxBugResolved(defect.id)
  )

  if (resolved.length === 0) {
    return null
  }

  return (
    <ul className="flex flex-wrap gap-2 pt-1">
      {resolved.map((defect) => (
        <li
          key={defect.id}
          className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground"
        >
          <CheckIcon className="size-3" aria-hidden />
          Bug Resolved · {defect.title}
        </li>
      ))}
    </ul>
  )
}

function VerdictAlert({
  verdict,
}: {
  verdict: BugVerdict & { alreadyFound?: boolean }
}) {
  if (!verdict.ok) {
    return (
      <p
        role="status"
        className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
      >
        {verdict.message}
      </p>
    )
  }

  return (
    <p
      role="status"
      className={cn(
        "rounded-lg border px-3 py-2 text-sm",
        "border-emerald-600/40 bg-emerald-500/10 text-foreground"
      )}
    >
      {verdict.alreadyFound
        ? `Already logged: ${verdict.title}. No extra points.`
        : `Bug Resolved: ${verdict.title}. +${verdict.points} points.`}
    </p>
  )
}
