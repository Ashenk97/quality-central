"use client"

import { type FormEvent, type ReactNode, useState } from "react"
import { CheckIcon, ShoppingBagIcon } from "lucide-react"

import { useSandboxQa } from "@/components/sandbox/qa-mode"
import { QaSpot } from "@/components/sandbox/qa-spot"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  DISCOUNT_RATE,
  SEEDED_DEFECT_STATE,
  discountCents,
  jsEmailBlocksSubmit,
  nextDiscountApplies,
  type SandboxDefectState,
} from "@/lib/sandbox-defects"
import { cn } from "@/lib/utils"

const CART_ITEMS = [
  { id: "pack", name: "Trail Pack 22L", detail: "Slate / One size", price: 6400 },
  { id: "socks", name: "Merino Crew Socks", detail: "Heather grey", price: 1200 },
] as const

const SHIPPING_CENTS = 600
const PROMO_CODE = "SAVE20"

function formatCents(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100)
}

export function BuggyCheckout() {
  const { qaMode, setQaMode, setDrawerOpen } = useSandboxQa()
  const [defects] = useState<SandboxDefectState>(() => ({
    ...SEEDED_DEFECT_STATE,
  }))
  const [promoInput, setPromoInput] = useState("")
  const [promoMessage, setPromoMessage] = useState<string | null>(null)
  const [discountApplies, setDiscountApplies] = useState(0)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [receipt, setReceipt] = useState<{ email: string; total: number } | null>(
    null
  )

  const subtotal = CART_ITEMS.reduce((sum, item) => sum + item.price, 0)
  const discount = discountCents(
    subtotal,
    discountApplies,
    defects.discountStacking
  )
  const total = subtotal + SHIPPING_CENTS - discount

  function applyPromo() {
    if (promoInput.trim().toUpperCase() !== PROMO_CODE) {
      setPromoMessage("Code not recognized.")
      return
    }

    setDiscountApplies((count) =>
      nextDiscountApplies(count, defects.discountStacking)
    )
    setPromoMessage("SAVE20 applied.")
  }

  function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const email = String(new FormData(event.currentTarget).get("email") ?? "")

    // Seeded BUG-02: when validationBypass is true there is no JS check.
    if (jsEmailBlocksSubmit(defects.validationBypass, email)) {
      setEmailError("Enter an email address.")
      return
    }

    setEmailError(null)
    setReceipt({ email, total })
  }

  if (receipt) {
    return (
      <Card className="mx-auto w-full max-w-xl">
        <CardHeader>
          <CardTitle>Order placed</CardTitle>
          <CardDescription>
            Confirmation for {receipt.email || "(no email provided)"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="font-mono text-2xl">{formatCents(receipt.total)}</p>
          <Button
            variant="outline"
            onClick={() => {
              setReceipt(null)
              setDiscountApplies(0)
              setPromoMessage(null)
              setPromoInput("")
              setEmailError(null)
            }}
          >
            Place another order
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="mx-auto w-full max-w-5xl" data-qa-mode={qaMode ? "on" : "off"}>
      {qaMode ? (
        <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          QA Mode is on. Three seeded defects are outlined below. This banner is
          for instructors — it is not part of the student scenario.
        </div>
      ) : null}

      <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
        <div className="flex items-center justify-between gap-3 border-b bg-card px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <ShoppingBagIcon className="size-4" />
            </span>
            <div className="leading-tight">
              <p className="font-heading text-sm font-semibold">
                Nimbus Outfitters
              </p>
              <p className="text-xs text-muted-foreground">Secure checkout</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Guest</Badge>
            <button
              type="button"
              onClick={() => {
                const next = !qaMode
                setQaMode(next)
                if (next) {
                  setDrawerOpen(true)
                }
              }}
              aria-pressed={qaMode}
              aria-label="Toggle QA Mode"
              title="Toggle QA Mode"
              className={cn(
                "size-2.5 rounded-full transition-opacity",
                qaMode
                  ? "bg-destructive opacity-100"
                  : "bg-foreground/40 opacity-70"
              )}
            />
          </div>
        </div>

        <div className="grid bg-background lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={placeOrder} className="p-4 md:p-6">
            <h2 className="font-heading text-lg font-semibold">Checkout</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Ships in 2–4 business days.
            </p>

            <div className="mt-6 space-y-4">
              <QaSpot
                active={qaMode}
                defectId="validation-bypass"
                id="BUG-02"
                title="Client-side validation"
                note="Email is required only via the HTML required attribute. There is no JavaScript or server check, so removing the attribute in DevTools lets an empty email submit."
              >
                <Field label="Email" htmlFor="sandbox-email">
                  <Input
                    id="sandbox-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={emailError ? true : undefined}
                    aria-describedby={emailError ? "sandbox-email-error" : undefined}
                  />
                  {emailError ? (
                    <p id="sandbox-email-error" className="text-xs text-destructive">
                      {emailError}
                    </p>
                  ) : null}
                </Field>
              </QaSpot>

              <Field label="Full name" htmlFor="sandbox-name">
                <Input
                  id="sandbox-name"
                  name="name"
                  autoComplete="name"
                  placeholder="Alex Rivera"
                />
              </Field>

              <Field label="Shipping address" htmlFor="sandbox-address">
                <Input
                  id="sandbox-address"
                  name="address"
                  autoComplete="street-address"
                  placeholder="18 Harbor Ave"
                />
              </Field>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="City" htmlFor="sandbox-city">
                  <Input id="sandbox-city" name="city" placeholder="Portland" />
                </Field>
                <Field label="Postal code" htmlFor="sandbox-postal">
                  <Input
                    id="sandbox-postal"
                    name="postal"
                    placeholder="97201"
                  />
                </Field>
              </div>

              <Separator />

              <p className="text-sm font-medium">Payment</p>
              <Field label="Card number" htmlFor="sandbox-card">
                <Input
                  id="sandbox-card"
                  name="card"
                  inputMode="numeric"
                  placeholder="4242 4242 4242 4242"
                />
              </Field>

              <QaSpot
                active={qaMode}
                defectId="visual-overlap"
                id="BUG-01"
                title="Visual regression"
                note="On viewports below 768px the Submit button is absolutely positioned over the CVC field and covers it."
              >
                <div className="relative">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Expiry" htmlFor="sandbox-expiry">
                      <Input
                        id="sandbox-expiry"
                        name="expiry"
                        placeholder="MM / YY"
                      />
                    </Field>
                    <Field label="CVC" htmlFor="sandbox-cvc">
                      <Input
                        id="sandbox-cvc"
                        name="cvc"
                        inputMode="numeric"
                        placeholder="123"
                      />
                    </Field>
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    data-sandbox-defect={
                      defects.visualOverlap ? "visual-overlap" : undefined
                    }
                    className={cn(
                      "mt-4 w-full",
                      defects.visualOverlap &&
                        "max-md:absolute max-md:bottom-0 max-md:left-0 max-md:z-10 max-md:mt-0"
                    )}
                  >
                    Submit order
                  </Button>
                </div>
              </QaSpot>
            </div>
          </form>

          <aside className="border-t bg-muted/30 p-4 md:p-6 lg:border-t-0 lg:border-l">
            <h2 className="font-heading text-lg font-semibold">Order summary</h2>
            <ul className="mt-4 space-y-3">
              {CART_ITEMS.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                  <p className="font-mono text-sm">{formatCents(item.price)}</p>
                </li>
              ))}
            </ul>

            <QaSpot
              active={qaMode}
              defectId="discount-stacking"
              id="BUG-03"
              title="Discount stacking"
              className="mt-5"
              note="SAVE20 subtracts 20% of the original subtotal on every apply. There is no single-use guard, so two applies take 40% off."
            >
              <div className="flex gap-2">
                <Input
                  id="sandbox-promo"
                  value={promoInput}
                  onChange={(event) => setPromoInput(event.target.value)}
                  placeholder="Discount code"
                  aria-label="Discount code"
                  data-sandbox-defect={
                    defects.discountStacking ? "discount-stacking" : undefined
                  }
                />
                <Button type="button" variant="outline" onClick={applyPromo}>
                  Apply
                </Button>
              </div>
              {promoMessage ? (
                <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  {promoMessage === "SAVE20 applied." ? (
                    <CheckIcon className="size-3" />
                  ) : null}
                  {promoMessage}
                  {discountApplies > 1
                    ? ` (${discountApplies} times)`
                    : null}
                </p>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">
                  Promo: {Math.round(DISCOUNT_RATE * 100)}% off with SAVE20
                </p>
              )}
            </QaSpot>

            <dl className="mt-5 space-y-2 text-sm">
              <Row label="Subtotal" value={formatCents(subtotal)} />
              <Row
                label={
                  discountApplies > 0
                    ? `Discount (${discountApplies}× SAVE20)`
                    : "Discount"
                }
                value={discount > 0 ? `−${formatCents(discount)}` : formatCents(0)}
              />
              <Row label="Shipping" value={formatCents(SHIPPING_CENTS)} />
              <Separator />
              <Row label="Total" value={formatCents(total)} strong />
            </dl>
          </aside>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: ReactNode
}) {
  return (
    <label htmlFor={htmlFor} className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium">{label}</span>
      {children}
    </label>
  )
}

function Row({
  label,
  value,
  strong = false,
}: {
  label: string
  value: string
  strong?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className={strong ? "font-medium" : "text-muted-foreground"}>
        {label}
      </dt>
      <dd
        className={cn("font-mono", strong && "text-base font-semibold")}
        data-sandbox-total={strong ? "true" : undefined}
      >
        {value}
      </dd>
    </div>
  )
}
