import "server-only"

import Stripe from "stripe"

import { getStripeSecretKey } from "@/lib/env"

export function createStripeClient() {
  const secretKey = getStripeSecretKey()
  if (!secretKey) {
    return null
  }

  return new Stripe(secretKey, {
    typescript: true,
  })
}

export function isStripePriceId(value: string) {
  return /^price_[A-Za-z0-9]+$/.test(value)
}

export function checkoutIntegrationIdentifier() {
  const suffix = Array.from({ length: 8 }, () =>
    String.fromCharCode(97 + Math.floor(Math.random() * 26))
  ).join("")
  return `qc-pro-checkout-${suffix}`
}
