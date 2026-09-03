export type DailyChallengeKind = "mcq" | "text"

export type DailyChallengeItem = {
  id: string
  topic: string
  prompt: string
  kind: DailyChallengeKind
  options?: string[]
  answer: string
  accepted?: string[]
  explanation: string
}

export type DailyStreakState = {
  streakCount: number
  lastAnsweredOn: string | null
  lastChallengeId: string | null
}

export const EMPTY_STREAK: DailyStreakState = {
  streakCount: 0,
  lastAnsweredOn: null,
  lastChallengeId: null,
}

export const DAILY_CHALLENGES: DailyChallengeItem[] = [
  {
    id: "http-500",
    topic: "HTTP",
    prompt: "What is the HTTP status code for Internal Server Error?",
    kind: "mcq",
    options: ["400 Bad Request", "401 Unauthorized", "500 Internal Server Error", "503 Service Unavailable"],
    answer: "500 Internal Server Error",
    explanation: "5xx means the server failed. 500 is the generic Internal Server Error.",
  },
  {
    id: "xpath-submit",
    topic: "Locators",
    prompt: "Write an XPath that targets a submit button (type=submit).",
    kind: "text",
    answer: "//button[@type='submit']",
    accepted: [
      "//button[@type='submit']",
      "//input[@type='submit']",
      "//*[@type='submit']",
      "//button[@type=\"submit\"]",
      "//input[@type=\"submit\"]",
    ],
    explanation: "Any of //button[@type='submit'], //input[@type='submit'], or //*[@type='submit'] is a solid intern answer.",
  },
  {
    id: "http-201",
    topic: "HTTP",
    prompt: "A successful POST that created a resource usually returns which status?",
    kind: "mcq",
    options: ["200 OK", "201 Created", "204 No Content", "302 Found"],
    answer: "201 Created",
    explanation: "201 Created means a new resource exists. 200 is a generic success; 204 has no body.",
  },
  {
    id: "bva-promo",
    topic: "BVA",
    prompt: "A GENKI promo code must be 5 to 10 characters. Which length is the invalid below-min boundary?",
    kind: "mcq",
    options: ["5", "10", "4", "7"],
    answer: "4",
    explanation: "Just outside the valid min is 4. 5 and 10 sit on the valid edges.",
  },
  {
    id: "get-idempotent",
    topic: "REST",
    prompt: "Which HTTP method is safe and idempotent by definition?",
    kind: "mcq",
    options: ["POST", "PATCH", "GET", "CONNECT"],
    answer: "GET",
    explanation: "GET must not change server state. Repeating it should not create new side effects.",
  },
  {
    id: "severity-priority",
    topic: "Bugs",
    prompt: "Severity measures impact. What does Priority measure?",
    kind: "mcq",
    options: [
      "How ugly the UI looks",
      "How urgently the business wants a fix",
      "How many testers found it",
      "Whether the bug is reproducible",
    ],
    answer: "How urgently the business wants a fix",
    explanation: "Severity is technical impact. Priority is business urgency — they can disagree.",
  },
  {
    id: "http-404",
    topic: "HTTP",
    prompt: "What does HTTP 404 mean?",
    kind: "mcq",
    options: [
      "The client is not authenticated",
      "The server refuses access to a known resource",
      "The server cannot find the requested resource",
      "The request body failed validation",
    ],
    answer: "The server cannot find the requested resource",
    explanation: "404 is not found. 401 is unauthenticated; 403 is forbidden; 400 is a bad request.",
  },
  {
    id: "sql-failed",
    topic: "SQL",
    prompt: "Complete the filter: WHERE order_status = ___",
    kind: "text",
    answer: "'Failed'",
    accepted: ["'failed'", "failed", "\"failed\"", "\"Failed\""],
    explanation: "The GENKI Failed-order check uses WHERE order_status = 'Failed'.",
  },
  {
    id: "playwright-expect",
    topic: "Playwright",
    prompt: "In Playwright, which helper auto-waits until the locator matches?",
    kind: "mcq",
    options: ["sleep(5000)", "waitForTimeout(5000)", "expect(locator).toHaveText(...)", "page.pause()"],
    answer: "expect(locator).toHaveText(...)",
    explanation: "expect() retries until timeout. Hard sleeps are a flake source.",
  },
  {
    id: "http-401-403",
    topic: "HTTP",
    prompt: "401 vs 403: which one means the server knows who you are but still refuses?",
    kind: "mcq",
    options: ["401 Unauthorized", "403 Forbidden", "407 Proxy Authentication Required", "429 Too Many Requests"],
    answer: "403 Forbidden",
    explanation: "401: prove who you are. 403: we know who you are and you may not do this.",
  },
  {
    id: "css-submit",
    topic: "Locators",
    prompt: "Write a CSS selector for a submit button with type=submit.",
    kind: "text",
    answer: "button[type='submit']",
    accepted: [
      "button[type=submit]",
      "button[type=\"submit\"]",
      "input[type='submit']",
      "input[type=submit]",
      "input[type=\"submit\"]",
      "[type='submit']",
      "[type=submit]",
    ],
    explanation: "button[type='submit'] or input[type='submit'] are the usual intern answers.",
  },
  {
    id: "ep-definition",
    topic: "Design",
    prompt: "Equivalence Partitioning says you should:",
    kind: "mcq",
    options: [
      "Test every integer in the valid range",
      "Pick one representative from each group that the product treats the same",
      "Only test the happy path",
      "Only test production data",
    ],
    answer: "Pick one representative from each group that the product treats the same",
    explanation: "One value stands for the partition. Boundaries get their own extra samples.",
  },
]

function pad(value: number) {
  return String(value).padStart(2, "0")
}

export function localDateKey(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function previousDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number)
  const date = new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1)
  date.setDate(date.getDate() - 1)
  return localDateKey(date)
}

export function pickDailyChallenge(dateKey = localDateKey()): DailyChallengeItem {
  let hash = 0
  for (const character of dateKey) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0
  }
  const item = DAILY_CHALLENGES[hash % DAILY_CHALLENGES.length]
  return item ?? DAILY_CHALLENGES[0]
}

export function normalizeChallengeAnswer(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/"/g, "'")
    .replace(/\s+/g, " ")
}

export function isChallengeCorrect(challenge: DailyChallengeItem, value: string) {
  const guess = normalizeChallengeAnswer(value)
  if (!guess) {
    return false
  }

  const accepted = [challenge.answer, ...(challenge.accepted ?? [])].map(
    normalizeChallengeAnswer
  )
  return accepted.includes(guess)
}

export function applyDailyStreak(
  current: DailyStreakState,
  todayKey: string,
  challengeId: string
): DailyStreakState {
  if (current.lastAnsweredOn === todayKey) {
    return {
      ...current,
      lastChallengeId: challengeId,
    }
  }

  const nextCount =
    current.lastAnsweredOn === previousDateKey(todayKey)
      ? current.streakCount + 1
      : 1

  return {
    streakCount: nextCount,
    lastAnsweredOn: todayKey,
    lastChallengeId: challengeId,
  }
}
