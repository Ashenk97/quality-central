import { NextResponse } from "next/server"
import type Stripe from "stripe"

import { getStripeWebhookSecret, isMonetizationEnabled } from "@/lib/env"
import { createStripeClient } from "@/lib/stripe/server"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"

export const runtime = "nodejs"

const USER_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function stripeCustomerId(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null
) {
  if (typeof customer === "string" && customer.startsWith("cus_")) {
    return customer
  }
  if (customer && typeof customer === "object" && "id" in customer) {
    return customer.id.startsWith("cus_") ? customer.id : null
  }
  return null
}

function userIdFromMetadata(
  metadata: Stripe.Metadata | null | undefined,
  fallback?: string | null
) {
  const fromMeta = metadata?.supabase_user_id
  if (typeof fromMeta === "string" && USER_ID_RE.test(fromMeta)) {
    return fromMeta
  }
  if (typeof fallback === "string" && USER_ID_RE.test(fallback)) {
    return fallback
  }
  return null
}

export async function POST(req: Request) {
  if (!isMonetizationEnabled()) {
    return NextResponse.json(
      { error: "Monetization is disabled." },
      { status: 404 }
    )
  }

  const signature = req.headers.get("stripe-signature")
  const body = await req.text()

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header." },
      { status: 400 }
    )
  }

  const stripe = createStripeClient()
  const webhookSecret = getStripeWebhookSecret()
  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 500 }
    )
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 })
  }

  const admin = createSupabaseAdminClient()
  if (!admin) {
    return NextResponse.json(
      {
        error:
          "Add SUPABASE_SERVICE_ROLE_KEY so the webhook can update is_pro_member.",
      },
      { status: 500 }
    )
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object
        const userId = userIdFromMetadata(
          session.metadata,
          session.client_reference_id
        )
        if (!userId) {
          return NextResponse.json(
            { error: "Checkout session is missing supabase_user_id." },
            { status: 400 }
          )
        }

        const customerId = stripeCustomerId(session.customer)
        const { error } = await admin
          .from("users")
          .update({
            is_pro_member: true,
            ...(customerId ? { stripe_customer_id: customerId } : {}),
          })
          .eq("id", userId)

        if (error) {
          throw error
        }
        break
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object
        const userId = userIdFromMetadata(subscription.metadata)
        const customerId = stripeCustomerId(subscription.customer)

        if (!userId && !customerId) {
          return NextResponse.json(
            { error: "Subscription is missing a user or customer." },
            { status: 400 }
          )
        }

        const query = admin.from("users").update({ is_pro_member: false })
        const { error } = userId
          ? await query.eq("id", userId)
          : await query.eq("stripe_customer_id", customerId)

        if (error) {
          throw error
        }
        break
      }
      default:
        break
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to apply membership update." },
      { status: 500 }
    )
  }

  return NextResponse.json({ received: true })
}
