const CHECKOUT_PATH = "/api/checkout"

type CheckoutBody = {
  email?: unknown
  promoCode?: unknown
  items?: unknown
}

function json(status: number, payload: Record<string, unknown>) {
  return Response.json(payload, { status })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

export async function POST(request: Request) {
  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return json(400, {
      error: "Bad Request",
      message: "Body must be JSON.",
      orderStatus: "Failed",
    })
  }

  if (!isRecord(payload)) {
    return json(400, {
      error: "Bad Request",
      message: "JSON object required.",
      orderStatus: "Failed",
    })
  }

  const body = payload as CheckoutBody
  const errors: string[] = []
  const email = typeof body.email === "string" ? body.email.trim() : ""
  const promo =
    typeof body.promoCode === "string" ? body.promoCode.trim() : ""

  if (!email || !email.includes("@")) {
    errors.push("email must be a non-empty address")
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    errors.push("items must be a non-empty array")
  }

  if (promo.length > 0 && (promo.length < 5 || promo.length > 10)) {
    errors.push("promoCode length must be between 5 and 10 characters")
  }

  if (errors.length > 0) {
    return json(400, {
      error: "Bad Request",
      message: "Checkout payload failed validation.",
      details: errors,
      orderStatus: "Failed",
    })
  }

  return json(200, {
    ok: true,
    orderId: "ord_capstone_1042",
    orderStatus: "Pending",
    path: CHECKOUT_PATH,
  })
}
