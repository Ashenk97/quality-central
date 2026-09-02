/**
 * Central public runtime config for Vercel, local, and CI.
 *
 * Set these in the Vercel project (Production / Preview / Development):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 *   NEXT_PUBLIC_SITE_URL   (canonical origin, e.g. https://quality-central.vercel.app)
 *
 * NEXT_PUBLIC_* values are inlined at build time. After changing them in
 * Vercel, trigger a new deployment so the client bundle picks them up.
 */

function trimOrigin(value: string) {
  return value.replace(/\/$/, "")
}

export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) {
    return trimOrigin(explicit)
  }

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (production) {
    return `https://${trimOrigin(production)}`
  }

  const vercel = process.env.VERCEL_URL
  if (vercel) {
    return `https://${trimOrigin(vercel)}`
  }

  return "http://localhost:3000"
}

export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || null
}

export function getSupabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || null
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey())
}

export function getSupabaseEnv() {
  const url = getSupabaseUrl()
  const anonKey = getSupabaseAnonKey()
  if (!url || !anonKey) {
    return null
  }

  return { url, anonKey, siteUrl: getSiteUrl() }
}

export function getAuthCallbackUrl(nextPath = "/dashboard") {
  const origin =
    typeof window !== "undefined" ? window.location.origin : getSiteUrl()
  const next = encodeURIComponent(nextPath)
  return `${origin}/auth/callback?next=${next}`
}
