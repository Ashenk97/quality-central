export const MOCK_METHODS = ["GET", "POST", "PUT"] as const

export type MockMethod = (typeof MOCK_METHODS)[number]

export type MockEndpoint = {
  id: string
  userId: string
  slug: string
  method: MockMethod
  statusCode: number
  responseBody: unknown
  createdAt: string
  updatedAt: string
}

export type MockEndpointDraft = {
  slug: string
  method: MockMethod
  statusCode: number
  responseBody: unknown
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function normalizeSlug(value: string) {
  return value.trim().toLowerCase().replaceAll(/[^a-z0-9-]/g, "")
}

export function isMockMethod(value: unknown): value is MockMethod {
  return MOCK_METHODS.includes(value as MockMethod)
}

export function parseStatusCode(value: unknown): number | null {
  const numeric = typeof value === "number" ? value : Number(String(value).trim())
  if (!Number.isInteger(numeric) || numeric < 100 || numeric > 599) {
    return null
  }
  return numeric
}

export function parseJsonBody(raw: string): { ok: true; value: unknown } | { ok: false; error: string } {
  const trimmed = raw.trim()
  if (!trimmed) {
    return { ok: true, value: {} }
  }

  try {
    return { ok: true, value: JSON.parse(trimmed) }
  } catch {
    return { ok: false, error: "Response body must be valid JSON." }
  }
}

export function validateMockDraft(input: {
  slug: string
  method: unknown
  statusCode: unknown
  responseBody: unknown
}): { ok: true; draft: MockEndpointDraft } | { ok: false; error: string } {
  const slug = normalizeSlug(input.slug)
  if (slug.length < 2 || slug.length > 64 || !SLUG_PATTERN.test(slug)) {
    return {
      ok: false,
      error: "Slug must be 2–64 characters: lowercase letters, numbers, and hyphens.",
    }
  }

  if (!isMockMethod(input.method)) {
    return { ok: false, error: "Method must be GET, POST, or PUT." }
  }

  const statusCode = parseStatusCode(input.statusCode)
  if (statusCode == null) {
    return { ok: false, error: "Status code must be an integer from 100 to 599." }
  }

  return {
    ok: true,
    draft: {
      slug,
      method: input.method,
      statusCode,
      responseBody: input.responseBody ?? {},
    },
  }
}

export function mockEndpointPath(slug: string) {
  return `/api/custom-mock/${slug}`
}
