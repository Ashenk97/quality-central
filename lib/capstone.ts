export type CapstonePhaseId = "planning" | "bug" | "sql" | "automation"

export type CapstonePhaseErrors = Partial<Record<CapstonePhaseId, string>>

export type CapstoneClaim = {
  unlocked: true
  name: string
  passedAt: string
}

export const CAPSTONE_CLAIM_KEY = "qc.capstone.certificate"

const PHASE1_KEYWORDS = /\b(valid|invalid|boundary)\b/i
const SQL_SELECT = /\bSELECT\b/i
const SQL_FROM = /\bFROM\b/i
const SQL_FAILED_STATUS = /WHERE\s+order_status\s*=\s*'Failed'/i
const PLAYWRIGHT_LOCATOR = /page\.locator/
const PLAYWRIGHT_EXPECT = /expect\(/

export function validatePhase1TestCases(text: string): string | null {
  const rows = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  if (rows.length < 3) {
    return "Write at least three test-case rows (one case per line) for the GENKI hoodie checkout."
  }

  if (!PHASE1_KEYWORDS.test(text)) {
    return 'Mark cases with keywords such as Valid, Invalid, or Boundary.'
  }

  return null
}

export function validatePhase2BugReport(input: {
  severity: string
  priority: string
  description: string
}): string | null {
  if (!input.severity.trim()) {
    return "Select a Severity."
  }
  if (!input.priority.trim()) {
    return "Select a Priority."
  }
  if (input.description.trim().length < 20) {
    return "Write a bug description of at least 20 characters."
  }
  return null
}

export function validatePhase3Sql(sql: string): string | null {
  const value = sql.trim()
  if (!value) {
    return "Write a SELECT that verifies the Failed GENKI order."
  }
  if (!SQL_SELECT.test(value)) {
    return "The query must include SELECT."
  }
  if (!SQL_FROM.test(value)) {
    return "The query must include FROM."
  }
  if (!SQL_FAILED_STATUS.test(value)) {
    return "Filter with WHERE order_status = 'Failed'."
  }
  return null
}

export function validatePhase4Playwright(source: string): string | null {
  if (!source.trim()) {
    return "Write a Playwright spec for the GENKI hoodie checkout."
  }
  if (!PLAYWRIGHT_LOCATOR.test(source)) {
    return "Use page.locator to target the GENKI cart controls."
  }
  if (!PLAYWRIGHT_EXPECT.test(source)) {
    return "Assert with expect(."
  }
  return null
}

export function validateCapstone(input: {
  testCases: string
  severity: string
  priority: string
  bugDescription: string
  sql: string
  spec: string
}): CapstonePhaseErrors {
  const errors: CapstonePhaseErrors = {}
  const planning = validatePhase1TestCases(input.testCases)
  if (planning) {
    errors.planning = planning
  }
  const bug = validatePhase2BugReport({
    severity: input.severity,
    priority: input.priority,
    description: input.bugDescription,
  })
  if (bug) {
    errors.bug = bug
  }
  const sql = validatePhase3Sql(input.sql)
  if (sql) {
    errors.sql = sql
  }
  const automation = validatePhase4Playwright(input.spec)
  if (automation) {
    errors.automation = automation
  }
  return errors
}

export function firstFailingPhase(
  errors: CapstonePhaseErrors
): CapstonePhaseId | null {
  const order: CapstonePhaseId[] = ["planning", "bug", "sql", "automation"]
  return order.find((phase) => errors[phase]) ?? null
}

export function saveCapstoneClaim(name: string) {
  if (typeof window === "undefined") {
    return
  }
  const claim: CapstoneClaim = {
    unlocked: true,
    name: name.trim(),
    passedAt: new Date().toISOString(),
  }
  window.localStorage.setItem(CAPSTONE_CLAIM_KEY, JSON.stringify(claim))
}

export function loadCapstoneClaim(): CapstoneClaim | null {
  if (typeof window === "undefined") {
    return null
  }
  try {
    const raw = window.localStorage.getItem(CAPSTONE_CLAIM_KEY)
    if (!raw) {
      return null
    }
    const parsed = JSON.parse(raw) as Partial<CapstoneClaim>
    if (parsed.unlocked !== true) {
      return null
    }
    return {
      unlocked: true,
      name: typeof parsed.name === "string" ? parsed.name : "",
      passedAt:
        typeof parsed.passedAt === "string"
          ? parsed.passedAt
          : new Date().toISOString(),
    }
  } catch {
    return null
  }
}

export function clearCapstoneClaim() {
  if (typeof window === "undefined") {
    return
  }
  window.localStorage.removeItem(CAPSTONE_CLAIM_KEY)
}

export const DEFAULT_CAPSTONE_SPEC = `import { test, expect } from "@playwright/test"

test("GENKI hoodie checkout increases the cart counter", async ({ page }) => {
  await page.goto("/sandbox")
  await page.locator('[data-testid="add-to-cart"]').click()
  await expect(page.locator('[data-testid="cart-count"]')).toHaveText("1")
})
`

export const DEFAULT_INVALID_CHECKOUT = `{
  "email": "",
  "promoCode": "AB",
  "items": []
}
`
