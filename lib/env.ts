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

export function isMonetizationEnabled() {
  return process.env.NEXT_PUBLIC_ENABLE_MONETIZATION === "true"
}

export function getStripeSecretKey() {
  return process.env.STRIPE_SECRET_KEY?.trim() || null
}

export function getStripePublishableKey() {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() || null
}

export function getStripeProPriceId() {
  return process.env.STRIPE_PRO_PRICE_ID?.trim() || null
}

export function getStripeWebhookSecret() {
  return process.env.STRIPE_WEBHOOK_SECRET?.trim() || null
}

export function getSupabaseServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || null
}

export function isAiGatewayConfigured() {
  return Boolean(
    process.env.AI_GATEWAY_API_KEY?.trim() ||
      process.env.VERCEL_OIDC_TOKEN?.trim()
  )
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
