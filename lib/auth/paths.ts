export const HOME_PATH = "/"
export const LOGIN_PATH = "/login"
export const SIGNUP_PATH = "/signup"
export const DEFAULT_AUTH_NEXT = "/dashboard"

// Only these routes render without a session. Everything else is protected, so
// a newly added route is gated by default instead of shipping public by accident.
const PUBLIC_PATHS = new Set<string>([HOME_PATH, LOGIN_PATH, SIGNUP_PATH])

// Namespaces that must never be redirected:
// - /auth completes the OAuth handshake before a session cookie exists.
// - /api answers with its own status codes instead of an HTML redirect.
// - /_next and /__nextjs are framework internals (assets, HMR, dev overlay).
const PUBLIC_PREFIXES = ["/auth", "/api", "/_next", "/__nextjs"]

export function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.has(pathname)) {
    return true
  }

  return PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

export function isProtectedPath(pathname: string) {
  return !isPublicPath(pathname)
}

export function isAuthPath(pathname: string) {
  return pathname === LOGIN_PATH || pathname === SIGNUP_PATH
}

export function safeNextPath(
  value: string | null | undefined,
  fallback = DEFAULT_AUTH_NEXT
) {
  if (!value) {
    return fallback
  }

  if (!value.startsWith("/") || value.startsWith("//") || value.includes("://")) {
    return fallback
  }

  // Bouncing back to a public auth screen after signing in would loop.
  if (isAuthPath(value.split("?")[0])) {
    return fallback
  }

  return value
}

export function loginUrl(nextPath?: string | null) {
  const next = safeNextPath(nextPath)
  if (next === DEFAULT_AUTH_NEXT) {
    return LOGIN_PATH
  }
  return `${LOGIN_PATH}?next=${encodeURIComponent(next)}`
}
