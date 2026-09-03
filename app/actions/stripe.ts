"use server"

import {
  getSiteUrl,
  getStripeProPriceId,
  isMonetizationEnabled,
} from "@/lib/env"
import { getCurrentUser } from "@/lib/auth/session"
import {
  checkoutIntegrationIdentifier,
  createStripeClient,
  isStripePriceId,
} from "@/lib/stripe/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getLearner } from "@/lib/supabase/progress"

export type CheckoutSessionResult =
  | {
      ok: true
      url: string | null
      clientSecret: string | null
    }
  | {
      ok: false
      message: string
    }

export async function createCheckoutSession(
  priceId: string
): Promise<CheckoutSessionResult> {
  if (!isMonetizationEnabled()) {
    return {
      ok: false,
      message: "Pro checkout is not enabled.",
    }
  }

  if (!isStripePriceId(priceId)) {
    return { ok: false, message: "That Price id is not valid." }
  }

  const allowedPriceId = getStripeProPriceId()
  if (allowedPriceId && priceId !== allowedPriceId) {
    return { ok: false, message: "That Price is not available." }
  }

  const stripe = createStripeClient()
  if (!stripe) {
    return {
      ok: false,
      message:
        "Stripe is not configured. Add STRIPE_SECRET_KEY from .env.example.",
    }
  }

  const user = await getCurrentUser()
  if (!user) {
    return { ok: false, message: "Sign in to start a Pro subscription." }
  }

  const supabase = await createSupabaseServerClient()
  if (!supabase) {
    return { ok: false, message: "Could not verify your account." }
  }

  try {
    await getLearner(supabase)
  } catch {
    return { ok: false, message: "Could not verify your account." }
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("is_pro_member, stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle()

  if (profileError) {
    return {
      ok: false,
      message:
        "Could not load membership. Run supabase/migrations/20260904000007_pro_membership.sql in the Supabase SQL Editor.",
    }
  }

  if (profile?.is_pro_member) {
    return { ok: false, message: "You already have a Pro membership." }
  }

  let customerId =
    typeof profile?.stripe_customer_id === "string"
      ? profile.stripe_customer_id
      : null

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id

    const { error } = await supabase
      .from("users")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id)

    if (error) {
      return {
        ok: false,
        message:
          "Could not store the Stripe customer. Run supabase/migrations/20260904000007_pro_membership.sql in the Supabase SQL Editor.",
      }
    }
  }

  const origin = getSiteUrl()
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    client_reference_id: user.id,
    integration_identifier: checkoutIntegrationIdentifier(),
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/dashboard?checkout=success`,
    cancel_url: `${origin}/dashboard?checkout=cancel`,
    metadata: { supabase_user_id: user.id },
    subscription_data: {
      metadata: { supabase_user_id: user.id },
    },
  })

  return {
    ok: true,
    url: session.url,
    clientSecret: session.client_secret,
  }
}
