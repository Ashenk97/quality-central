export type InterviewQuestion = {
  id: string
  prompt: string
  topic: string
}

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: "vending-machine",
    topic: "Exploratory",
    prompt: "Test this vending machine.",
  },
  {
    id: "login-form",
    topic: "Functional",
    prompt: "How would you test a login form that accepts email and password?",
  },
  {
    id: "severity-priority",
    topic: "Defects",
    prompt: "What is the difference between severity and priority? Give one example of each combination.",
  },
  {
    id: "bva",
    topic: "ISTQB",
    prompt: "Explain boundary value analysis and apply it to an age field that accepts 18 to 65.",
  },
  {
    id: "equivalence",
    topic: "ISTQB",
    prompt: "What is equivalence partitioning? Partition a discount field that accepts 0 to 100.",
  },
  {
    id: "bug-report",
    topic: "Defects",
    prompt: "Write a bug report for a checkout button that stays disabled after a valid promo code is applied.",
  },
  {
    id: "stlc",
    topic: "ISTQB",
    prompt: "Walk me through the STLC and where a QA engineer adds the most value.",
  },
  {
    id: "verify-validate",
    topic: "ISTQB",
    prompt: "What is the difference between verification and validation?",
  },
  {
    id: "shopping-cart",
    topic: "Exploratory",
    prompt: "How would you test an e-commerce shopping cart?",
  },
  {
    id: "flaky-test",
    topic: "Automation",
    prompt: "A Playwright test fails about 20% of the time on CI. How do you investigate and fix it?",
  },
  {
    id: "api-500",
    topic: "API",
    prompt: "An order API sometimes returns HTTP 500. How would you test, isolate, and report that?",
  },
  {
    id: "test-case-vs-scenario",
    topic: "ISTQB",
    prompt: "What is the difference between a test case and a test scenario? Give one example of each for a search box.",
  },
]

export function getInterviewQuestion(id: string) {
  return INTERVIEW_QUESTIONS.find((question) => question.id === id) ?? null
}

export function pickInterviewQuestion(excludeId?: string) {
  const pool = excludeId
    ? INTERVIEW_QUESTIONS.filter((question) => question.id !== excludeId)
    : INTERVIEW_QUESTIONS
  const index = Math.floor(Math.random() * pool.length)
  return pool[index] ?? INTERVIEW_QUESTIONS[0]
}

export const MOCK_INTERVIEW_SYSTEM_PROMPT = `You are a strict Senior QA Hiring Manager interviewing a candidate for a QA / SDET role.

Your job is to evaluate the candidate's answer to the assigned interview question. Do not invent a different question. Do not write the candidate's answer for them.

Score and coach on:
1. Clarity — structured, specific, and easy to follow
2. Edge cases — invalid input, boundaries, empty states, concurrency, payments, permissions, offline, localization
3. ISTQB principles — STLC, test design techniques (BVA, EP), verification vs validation, severity vs priority, oracles, risk-based testing

Response format (always use this):
- Verdict: Hire / Lean Hire / No Hire
- Score: X/10
- What worked: 2-4 bullets
- Gaps: 2-4 bullets (missing edge cases, vague claims, weak ISTQB language)
- Stronger answer: 3-6 sentences showing how a hire-level candidate would answer

Be direct. Do not flatter. If the answer is thin, say so and explain what evidence is missing. Keep the whole reply under 280 words.`
