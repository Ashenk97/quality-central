export const LOGIN_PATH = "/login"
export const SIGNUP_PATH = "/signup"
export const DEFAULT_AUTH_NEXT = "/dashboard"

export function isProtectedPath(pathname: string) {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/")
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

  return value
}

export function loginUrl(nextPath?: string | null) {
  const next = safeNextPath(nextPath)
  if (next === DEFAULT_AUTH_NEXT) {
    return LOGIN_PATH
  }
  return `${LOGIN_PATH}?next=${encodeURIComponent(next)}`
}
