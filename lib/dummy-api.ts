export const DUMMY_API_PATH = "/api/playground"

export type DummyStatus = 200 | 404 | 500

function asStatus(value: unknown): DummyStatus | null {
  const numeric = Number(value)
  if (numeric === 200 || numeric === 404 || numeric === 500) {
    return numeric
  }

  const alias = String(value ?? "")
    .trim()
    .toLowerCase()
    .replaceAll("_", "-")

  if (alias === "ok" || alias === "success") {
    return 200
  }
  if (alias === "missing" || alias === "not-found" || alias === "notfound") {
    return 404
  }
  if (alias === "error" || alias === "fail" || alias === "crash") {
    return 500
  }

  return null
}

export function resolveDummyStatus(
  payload: unknown,
  searchParams?: URLSearchParams
): DummyStatus {
  if (payload && typeof payload === "object" && "status" in payload) {
    const fromBody = asStatus((payload as { status: unknown }).status)
    if (fromBody) {
      return fromBody
    }
  }

  const fromQuery = asStatus(searchParams?.get("status"))
  if (fromQuery) {
    return fromQuery
  }

  const fromId = asStatus(searchParams?.get("id"))
  if (fromId) {
    return fromId
  }

  return 200
}
