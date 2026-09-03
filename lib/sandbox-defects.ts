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

export type SandboxCoordinateId =
  | "payment-cvc-submit"
  | "contact-email"
  | "summary-promo"

export type SandboxDefectState = {
  visualOverlap: boolean
  validationBypass: boolean
  discountStacking: boolean
}

/**
 * Seeded student-facing defects. Keep every flag `true`.
 * QA Mode only reveals locations — it must not repair the checkout.
 */
export const SEEDED_DEFECT_STATE: SandboxDefectState = {
  visualOverlap: true,
  validationBypass: true,
  discountStacking: true,
}

export type SandboxCoordinate = {
  id: SandboxCoordinateId
  defectId: SandboxDefectId
  label: string
  region: string
  selector: string
  viewport?: string
}

export type SandboxDefect = {
  id: SandboxDefectId
  title: string
  category: Exclude<SandboxBugCategory, "other">
  coordinateId: SandboxCoordinateId
  points: number
  instructorNote: string
  subject: string[]
  signals: string[]
  expectedHints: string[]
  actualHints: string[]
}

export type BugReportField =
  | "category"
  | "coordinate"
  | "steps"
  | "expected"
  | "actual"

export type BugFieldErrors = Partial<Record<BugReportField, string>>

export type BugReportInput = {
  category: SandboxBugCategory | ""
  coordinate: SandboxCoordinateId | ""
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
      fields?: BugFieldErrors
    }

export const SANDBOX_COORDINATES: SandboxCoordinate[] = [
  {
    id: "payment-cvc-submit",
    defectId: "visual-overlap",
    label: "Payment — CVC and Submit order",
    region: "Payment",
    selector: "#sandbox-cvc",
    viewport: "below 768px",
  },
  {
    id: "contact-email",
    defectId: "validation-bypass",
    label: "Contact — Email",
    region: "Email",
    selector: "#sandbox-email",
  },
  {
    id: "summary-promo",
    defectId: "discount-stacking",
    label: "Order summary — promo code",
    region: "Promo",
    selector: "#sandbox-promo",
  },
]

export const SANDBOX_DEFECTS: SandboxDefect[] = [
  {
    id: "visual-overlap",
    title: "Submit button overlaps CVC",
    category: "visual",
    coordinateId: "payment-cvc-submit",
    points: SANDBOX_BUG_POINTS,
    instructorNote:
      "On viewports below 768px the Submit button is absolutely positioned over the CVC field and covers it.",
    subject: [
      "cvc",
      "cvv",
      "security code",
      "card code",
      "payment field",
      "expiry",
      "submit",
      "place order",
      "submit button",
      "submit order",
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
    coordinateId: "contact-email",
    points: SANDBOX_BUG_POINTS,
    instructorNote:
      "Email is required only via the HTML required attribute. There is no JavaScript check, so removing the attribute in DevTools lets an empty email submit.",
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
    coordinateId: "summary-promo",
    points: SANDBOX_BUG_POINTS,
    instructorNote:
      "SAVE20 subtracts 20% of the original subtotal on every apply. There is no single-use guard, so two applies take 40% off.",
    subject: ["save20", "promo", "discount", "coupon", "code"],
    signals: [
      "twice",
      "two times",
      "second time",
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
      "second time",
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

export const DISCOUNT_RATE = 0.2

const TOO_THIN =
  "Add more specific steps, expected behavior, and actual results. Vague reports are not credited."

const WRONG_CATEGORY =
  "That category does not match a seeded Sandbox defect. Pick Visual, Validation, or Calculation and describe the failure you observed."

const COORDINATE_MISMATCH =
  "That location does not match the category you selected. Report the control you actually used."

export function getSandboxDefect(id: string) {
  return SANDBOX_DEFECTS.find((defect) => defect.id === id)
}

export function getSandboxCoordinate(id: string) {
  return SANDBOX_COORDINATES.find((coordinate) => coordinate.id === id)
}

export function sandboxDefectAnchor(id: SandboxDefectId) {
  return `sandbox-defect-${id}`
}

export function nextDiscountApplies(
  current: number,
  stacking: boolean
) {
  if (!stacking && current >= 1) {
    return current
  }
  return current + 1
}

export function discountCents(
  subtotal: number,
  applyCount: number,
  stacking: boolean
) {
  const applies = stacking ? applyCount : Math.min(applyCount, 1)
  return Math.round(subtotal * DISCOUNT_RATE) * applies
}

export function jsEmailBlocksSubmit(bypass: boolean, email: string) {
  return !bypass && email.trim().length === 0
}

export function validateBugReportFields(input: BugReportInput): BugFieldErrors {
  const errors: BugFieldErrors = {}
  const steps = input.steps.trim()
  const expected = input.expected.trim()
  const actual = input.actual.trim()

  if (!input.category) {
    errors.category = "Choose a bug category."
  }

  if (!input.coordinate) {
    errors.coordinate = "Choose where you observed the failure."
  }

  if (steps.length < 24) {
    errors.steps =
      "List the steps you took, including the control and viewport if it matters."
  }

  if (expected.length < 12) {
    errors.expected = "Describe the correct behavior in a full sentence."
  }

  if (actual.length < 12) {
    errors.actual = "Describe what you observed instead."
  }

  if (
    expected.length >= 12 &&
    actual.length >= 12 &&
    normalize(expected) === normalize(actual)
  ) {
    errors.actual =
      "Expected and actual results are the same. Contrast what should happen with what you saw."
  }

  return errors
}

export function evaluateSandboxReport(input: BugReportInput): BugVerdict {
  const fields = validateBugReportFields(input)
  if (Object.keys(fields).length > 0) {
    return {
      ok: false,
      message: Object.values(fields)[0] ?? "Complete every field before submitting.",
      fields,
    }
  }

  if (input.category === "other") {
    return {
      ok: false,
      message: WRONG_CATEGORY,
      fields: { category: WRONG_CATEGORY },
    }
  }

  const coordinate = getSandboxCoordinate(input.coordinate)
  if (!coordinate) {
    return {
      ok: false,
      message: "Choose a known checkout location.",
      fields: { coordinate: "Choose a known checkout location." },
    }
  }

  const defect = getSandboxDefect(coordinate.defectId)
  if (!defect) {
    return { ok: false, message: TOO_THIN }
  }

  if (defect.category !== input.category) {
    return {
      ok: false,
      message: COORDINATE_MISMATCH,
      fields: {
        category: "Category does not match this location.",
        coordinate: "Location does not match this category.",
      },
    }
  }

  const steps = input.steps.trim()
  const expected = input.expected.trim()
  const actual = input.actual.trim()
  const combined = normalize(`${steps} ${expected} ${actual}`)
  const expectedNorm = normalize(expected)
  const actualNorm = normalize(actual)

  const subjectHits = countHits(combined, defect.subject)
  const signalHits = countHits(combined, defect.signals)
  const expectedHits = countHits(expectedNorm, defect.expectedHints)
  const actualHits = countHits(actualNorm, defect.actualHints)

  if (
    subjectHits === 0 ||
    signalHits === 0 ||
    expectedHits === 0 ||
    actualHits === 0
  ) {
    return { ok: false, message: TOO_THIN }
  }

  return {
    ok: true,
    defectId: defect.id,
    title: defect.title,
    points: defect.points,
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
