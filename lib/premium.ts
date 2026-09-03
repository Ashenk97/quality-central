import "server-only"

import { getCurrentUser } from "@/lib/auth/session"
import { isMonetizationEnabled } from "@/lib/env"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export function shouldGatePremiumLesson(
  isPremium: boolean,
  monetizationEnabled: boolean,
  isProMember: boolean
) {
  if (!monetizationEnabled) {
    return false
  }
  if (!isPremium) {
    return false
  }
  return !isProMember
}

export async function getProMembership() {
  const user = await getCurrentUser()
  if (!user) {
    return { signedIn: false, isProMember: false }
  }

  const supabase = await createSupabaseServerClient()
  if (!supabase) {
    return { signedIn: true, isProMember: false }
  }

  const { data } = await supabase
    .from("users")
    .select("is_pro_member")
    .eq("id", user.id)
    .maybeSingle()

  return {
    signedIn: true,
    isProMember: data?.is_pro_member === true,
  }
}

/** Pro badge / pricing UI only when monetization is explicitly enabled. */
export function shouldSurfaceProUi(isProMember: boolean) {
  return isMonetizationEnabled() && isProMember
}

/**
 * Profile fetch for chrome that shows Pro. Returns false when the feature
 * flag is off so badges and checkout entry points stay completely hidden.
 */
export async function getVisibleProMembership() {
  if (!isMonetizationEnabled()) {
    return {
      signedIn: false,
      isProMember: false,
      monetizationEnabled: false,
    }
  }

  const membership = await getProMembership()
  return {
    ...membership,
    monetizationEnabled: true,
  }
}

export async function resolvePremiumGate(isPremium: boolean) {
  const monetizationEnabled = isMonetizationEnabled()
  if (!monetizationEnabled || !isPremium) {
    return {
      gated: false,
      signedIn: false,
      monetizationEnabled,
    }
  }

  const membership = await getProMembership()
  return {
    gated: shouldGatePremiumLesson(
      isPremium,
      monetizationEnabled,
      membership.isProMember
    ),
    signedIn: membership.signedIn,
    monetizationEnabled,
  }
}
