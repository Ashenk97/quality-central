export const SANDBOX_CATEGORY = "sandbox"
export const SANDBOX_BUG_POINTS = 10

export type SandboxBugCategory =
  | "visual"
  | "validation"
  | "calculation"
  | "other"

export type SandboxDefectId =
  | "visual-overlap"
  | "validation-bypass"
  | "discount-stacking"

export type SandboxDefect = {
  id: SandboxDefectId
  title: string
  category: Exclude<SandboxBugCategory, "other">
  points: number
  subject: string[]
  signals: string[]
  expectedHints: string[]
  actualHints: string[]
}

export type BugReportInput = {
  category: SandboxBugCategory | ""
  steps: string
  expected: string
  actual: string
}

export type BugVerdict =
  | {
      ok: true
      defectId: SandboxDefectId
      title: string
      points: number
    }
  | {
      ok: false
      message: string
    }

export const SANDBOX_DEFECTS: SandboxDefect[] = [
  {
    id: "visual-overlap",
    title: "Submit button overlaps CVC",
    category: "visual",
    points: SANDBOX_BUG_POINTS,
    subject: [
      "cvc",
      "cvv",
      "security code",
      "card code",
      "payment field",
      "expiry",
      "submit",
      "place order",
    ],
    signals: [
      "overlap",
      "overlaps",
      "overlapping",
      "cover",
      "covers",
      "covering",
      "covered",
      "hidden",
      "behind",
      "on top",
      "overlay",
      "block",
      "blocks",
      "blocking",
      "obscur",
      "can't click",
      "cannot click",
      "can't type",
      "cannot type",
      "can't see",
      "cannot see",
      "mobile",
      "phone",
      "narrow",
      "small screen",
      "viewport",
      "768",
    ],
    expectedHints: [
      "visible",
      "usable",
      "accessible",
      "uncovered",
      "below",
      "above",
      "can type",
      "can enter",
      "not cover",
      "not overlap",
      "able to",
    ],
    actualHints: [
      "cover",
      "overlap",
      "hidden",
      "block",
      "can't",
      "cannot",
      "behind",
      "on top",
      "obscur",
      "inaccessible",
    ],
  },
  {
    id: "validation-bypass",
    title: "Blank email can be submitted",
    category: "validation",
    points: SANDBOX_BUG_POINTS,
    subject: ["email", "e-mail"],
    signals: [
      "required",
      "blank",
      "empty",
      "missing",
      "bypass",
      "without",
      "no email",
      "html",
      "javascript",
      "js validation",
      "client-side",
      "client side",
      "validation",
      "remove required",
      "devtools",
      "attribute",
      "no check",
    ],
    expectedHints: [
      "reject",
      "prevent",
      "error",
      "invalid",
      "required",
      "block",
      "not submit",
      "cannot submit",
      "can't submit",
      "ask for",
      "must enter",
      "should not",
    ],
    actualHints: [
      "submit",
      "submitted",
      "confirmation",
      "accepted",
      "went through",
      "goes through",
      "no email",
      "empty",
      "blank",
      "allowed",
      "order placed",
      "success",
      "no email provided",
    ],
  },
  {
    id: "discount-stacking",
    title: "Promo code stacks on every apply",
    category: "calculation",
    points: SANDBOX_BUG_POINTS,
    subject: ["save20", "promo", "discount", "coupon", "code"],
    signals: [
      "twice",
      "two times",
      "again",
      "stack",
      "stacks",
      "stacking",
      "40%",
      "40 %",
      "double",
      "multiple",
      "second apply",
      "apply twice",
      "every apply",
      "each apply",
      "20% of original",
      "subtracts again",
    ],
    expectedHints: [
      "once",
      "one time",
      "single",
      "only 20",
      "20%",
      "not stack",
      "same discount",
      "apply once",
      "one apply",
    ],
    actualHints: [
      "twice",
      "two times",
      "40",
      "stack",
      "more",
      "extra",
      "double",
      "again",
      "30.40",
      "51.60",
      "increased",
      "second",
    ],
  },
]

export const MAX_SANDBOX_POINTS =
  SANDBOX_DEFECTS.length * SANDBOX_BUG_POINTS

const TOO_THIN =
  "Add more specific steps, expected behavior, and actual results. Vague reports are not credited."

const WRONG_CATEGORY =
  "That category does not match a seeded Sandbox defect. Pick Visual, Validation, or Calculation and describe the failure you observed."

export function getSandboxDefect(id: string) {
  return SANDBOX_DEFECTS.find((defect) => defect.id === id)
}

export function evaluateSandboxReport(input: BugReportInput): BugVerdict {
  const category = input.category
  const steps = input.steps.trim()
  const expected = input.expected.trim()
  const actual = input.actual.trim()

  if (!category) {
    return { ok: false, message: "Choose a bug category." }
  }

  if (steps.length < 24 || expected.length < 12 || actual.length < 12) {
    return {
      ok: false,
      message:
        "A valid report needs clear steps to reproduce plus distinct expected and actual results.",
    }
  }

  if (normalize(expected) === normalize(actual)) {
    return {
      ok: false,
      message:
        "Expected and actual results are the same. Describe what should happen versus what you observed.",
    }
  }

  if (category === "other") {
    return { ok: false, message: WRONG_CATEGORY }
  }

  const combined = normalize(`${steps} ${expected} ${actual}`)
  const expectedNorm = normalize(expected)
  const actualNorm = normalize(actual)

  let best:
    | { defect: SandboxDefect; score: number }
    | null = null

  for (const defect of SANDBOX_DEFECTS) {
    if (defect.category !== category) {
      continue
    }

    const subjectHits = countHits(combined, defect.subject)
    const signalHits = countHits(combined, defect.signals)
    const expectedHits = countHits(expectedNorm, defect.expectedHints)
    const actualHits = countHits(actualNorm, defect.actualHints)

    if (subjectHits === 0 || signalHits === 0) {
      continue
    }

    if (expectedHits === 0 || actualHits === 0) {
      continue
    }

    const score =
      subjectHits * 3 + signalHits * 2 + expectedHits * 2 + actualHits * 2

    if (!best || score > best.score) {
      best = { defect, score }
    }
  }

  if (!best) {
    return { ok: false, message: TOO_THIN }
  }

  return {
    ok: true,
    defectId: best.defect.id,
    title: best.defect.title,
    points: best.defect.points,
  }
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replaceAll(/[^a-z0-9%.]+/g, " ")
    .replaceAll(/\s+/g, " ")
    .trim()
}

function countHits(haystack: string, phrases: string[]) {
  let count = 0
  for (const phrase of phrases) {
    if (haystack.includes(phrase.toLowerCase())) {
      count += 1
    }
  }
  return count
}
