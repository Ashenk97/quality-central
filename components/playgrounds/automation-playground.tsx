"use client"

import { useState } from "react"

import { CodeEditor } from "@/components/code-editor"
import { Button } from "@/components/ui/button"
import { simulatePlaywrightRun } from "@/lib/simulate-playwright"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export const DEFAULT_PLAYWRIGHT_SCRIPT = `import { test, expect } from '@playwright/test';

test.describe('Nimbus checkout', () => {
  test('sandbox checkout heading is visible', async ({ page }) => {
    await page.goto('/sandbox');
    await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible();
  });
});
`

export function AutomationPlayground() {
  const [source, setSource] = useState(DEFAULT_PLAYWRIGHT_SCRIPT)
  const [running, setRunning] = useState(false)
  const [output, setOutput] = useState<string>(
    "Click Run Test to parse the script and print a simulated Playwright report."
  )
  const [passed, setPassed] = useState<boolean | null>(null)

  async function runTest() {
    setRunning(true)
    setOutput("Running…")
    await new Promise((resolve) => setTimeout(resolve, 700))
    const result = simulatePlaywrightRun(source)
    setPassed(result.ok)
    setOutput(result.output)
    setRunning(false)
    if (result.ok) {
      toast.success("Simulated run passed")
    } else {
      toast.error("Simulated run failed", {
        description: "Check the terminal output for parse details.",
      })
    }
  }

  return (
    <div
      role="region"
      aria-label="Automation playground"
      className="overflow-hidden rounded-xl ring-1 ring-foreground/10"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-card px-3 py-2">
        <div>
          <p className="font-heading text-sm font-semibold">
            Automation Playground
          </p>
          <p className="text-xs text-muted-foreground">
            example.spec.ts — syntax is parsed locally; no browser is launched.
          </p>
        </div>
        <Button
          onClick={runTest}
          disabled={running}
          className="transition-transform duration-200 active:scale-[0.97]"
        >
          {running ? "Running…" : "Run Test"}
        </Button>
      </div>

      <CodeEditor
        language="typescript"
        value={source}
        onChange={setSource}
        height={360}
        ariaLabel="Playwright spec"
      />

      <div className="border-t border-border bg-background">
        <p className="border-b border-border px-3 py-1.5 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
          Terminal
        </p>
        <pre
          role="status"
          aria-live="polite"
          aria-label="Simulated test output"
          className={cn(
            "max-h-64 overflow-auto p-3 font-mono text-xs leading-relaxed transition-colors duration-200",
            passed === false ? "text-qa-bug" : "text-qa-success"
          )}
        >
          {output}
        </pre>
      </div>
    </div>
  )
}
