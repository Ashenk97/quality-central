"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { AwardIcon, CheckIcon } from "lucide-react"
import { toast } from "sonner"

import { fireCapstoneConfetti } from "@/components/capstone/fire-confetti"
import { CodeEditor } from "@/components/code-editor"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  DEFAULT_CAPSTONE_SPEC,
  firstFailingPhase,
  loadCapstoneClaim,
  saveCapstoneClaim,
  validateCapstone,
  type CapstonePhaseErrors,
  type CapstonePhaseId,
} from "@/lib/capstone"
import { useProgress } from "@/lib/progress"
import { cn } from "@/lib/utils"

const PHASES: { id: CapstonePhaseId; label: string; short: string }[] = [
  { id: "planning", label: "Phase 1 — Test cases", short: "Planning" },
  { id: "bug", label: "Phase 2 — Bug report", short: "Bugs" },
  { id: "sql", label: "Phase 3 — SQL", short: "SQL" },
  { id: "automation", label: "Phase 4 — Playwright", short: "Automation" },
]

export function CapstoneSubmit() {
  const { markComplete, saveQuizScore } = useProgress()
  const [tab, setTab] = useState<CapstonePhaseId>("planning")
  const [testCases, setTestCases] = useState("")
  const [severity, setSeverity] = useState("")
  const [priority, setPriority] = useState("")
  const [bugDescription, setBugDescription] = useState("")
  const [sql, setSql] = useState("")
  const [spec, setSpec] = useState(DEFAULT_CAPSTONE_SPEC)
  const [errors, setErrors] = useState<CapstonePhaseErrors>({})
  const [passed, setPassed] = useState(false)
  const [unlocked, setUnlocked] = useState(() => Boolean(loadCapstoneClaim()))

  function submit() {
    const nextErrors = validateCapstone({
      testCases,
      severity,
      priority,
      bugDescription,
      sql,
      spec,
    })
    setErrors(nextErrors)

    const failing = firstFailingPhase(nextErrors)
    if (failing) {
      setTab(failing)
      toast.warning("Capstone not complete", {
        description: "Fix the highlighted phase and validate again.",
      })
      return
    }

    saveCapstoneClaim("")
    markComplete("capstone", "01-sandbox-challenge")
    saveQuizScore("capstone", "01-sandbox-challenge", 100)
    setPassed(true)
    setUnlocked(true)
    fireCapstoneConfetti()
    toast.success("GENKI Wardrobe sprint passed", {
      description: "Claim your QA Intern Ready certificate.",
    })
  }

  return (
    <section className="my-10 space-y-5 rounded-2xl border border-indigo-500/20 bg-card p-4 shadow-sm sm:p-6">
      <div>
        <p className="font-heading text-lg font-semibold">
          GENKI Wardrobe — capstone submission
        </p>
        <p className="text-sm text-muted-foreground">
          Four phases for the hoodie checkout: BVA cases, a bug report, a Failed
          order query, and a Playwright smoke. Pass all four to claim your
          certificate.
        </p>
      </div>

      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as CapstonePhaseId)}
      >
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:grid-cols-4">
          {PHASES.map((phase) => (
            <TabsTrigger
              key={phase.id}
              value={phase.id}
              className={cn(
                "h-auto min-h-8 py-1.5",
                errors[phase.id] && "text-destructive data-active:text-destructive"
              )}
            >
              {passed ? (
                <CheckIcon data-icon="inline-start" className="text-emerald-500" />
              ) : null}
              <span className="sm:hidden">{phase.short}</span>
              <span className="hidden sm:inline">{phase.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="planning" className="mt-4 space-y-3">
          <PhaseHint error={errors.planning}>
            One GENKI hoodie checkout case per line. Include at least three rows
            and keywords such as Valid, Invalid, or Boundary.
          </PhaseHint>
          <Label htmlFor="capstone-test-cases">Test cases</Label>
          <Textarea
            id="capstone-test-cases"
            value={testCases}
            onChange={(event) => setTestCases(event.target.value)}
            rows={8}
            className="font-mono text-sm"
            placeholder={`TC-01 Valid: GENKI hoodie checkout with 5-char code SAVE2 — format accepted\nTC-02 Invalid: GENKI hoodie checkout with 4-char code ABCD — rejected below min\nTC-03 Boundary: GENKI hoodie checkout with 10-char code GENKI10MAX — format accepted`}
            aria-invalid={Boolean(errors.planning)}
          />
        </TabsContent>

        <TabsContent value="bug" className="mt-4 space-y-3">
          <PhaseHint error={errors.bug}>
            Report a GENKI checkout defect (visual overlap or SAVE20 stacking).
            Choose Severity and Priority, and write at least 20 characters.
          </PhaseHint>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="capstone-severity">Severity</Label>
              <Select onValueChange={setSeverity}>
                <SelectTrigger id="capstone-severity" className="w-full">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="major">Major</SelectItem>
                  <SelectItem value="minor">Minor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="capstone-priority">Priority</Label>
              <Select onValueChange={setPriority}>
                <SelectTrigger id="capstone-priority" className="w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Label htmlFor="capstone-bug">Description</Label>
          <Textarea
            id="capstone-bug"
            value={bugDescription}
            onChange={(event) => setBugDescription(event.target.value)}
            className="min-h-36 font-mono text-sm"
            placeholder={`Title: [GENKI checkout] Submit overlaps CVC on mobile\nSteps: Open /sandbox, narrow to 375px, try to type CVC.\nExpected: CVC stays usable. Actual: Submit covers the field.`}
            aria-invalid={Boolean(errors.bug)}
          />
        </TabsContent>

        <TabsContent value="sql" className="mt-4 space-y-3">
          <PhaseHint error={errors.sql}>
            Query the mock GENKI orders table. The grader looks for SELECT, FROM,
            and WHERE order_status = &apos;Failed&apos;.
          </PhaseHint>
          <Label htmlFor="capstone-sql">SQL</Label>
          <Textarea
            id="capstone-sql"
            value={sql}
            onChange={(event) => setSql(event.target.value)}
            className="min-h-32 font-mono text-sm"
            placeholder="SELECT id, order_status FROM orders WHERE order_status = 'Failed'"
            aria-invalid={Boolean(errors.sql)}
          />
        </TabsContent>

        <TabsContent value="automation" className="mt-4 space-y-3">
          <PhaseHint error={errors.automation}>
            Script the GENKI hoodie add-to-cart path. The grader looks for
            page.locator and expect(.
          </PhaseHint>
          <CodeEditor
            language="typescript"
            value={spec}
            onChange={setSpec}
            height={280}
            ariaLabel="Capstone Playwright spec"
          />
        </TabsContent>
      </Tabs>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="button" onClick={submit} className="w-full sm:w-auto">
          <AwardIcon data-icon="inline-start" />
          Validate submissions
        </Button>
        {unlocked ? (
          <Button variant="secondary" className="w-full sm:w-auto" asChild>
            <Link href="/certificate">Claim Your Certificate</Link>
          </Button>
        ) : null}
      </div>
    </section>
  )
}

function PhaseHint({
  error,
  children,
}: {
  error?: string
  children: ReactNode
}) {
  if (error) {
    return <p className="text-sm text-destructive">{error}</p>
  }
  return <p className="text-sm text-muted-foreground">{children}</p>
}
