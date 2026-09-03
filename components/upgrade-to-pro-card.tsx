"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SparklesIcon } from "lucide-react"
import { toast } from "sonner"

import { createCheckoutSession } from "@/app/actions/stripe"
import { Button } from "@/components/ui/button"
import { loginUrl } from "@/lib/auth/paths"

export function UpgradeToProCard({
  priceId,
  signedIn,
  nextPath,
}: {
  priceId: string | null
  signedIn: boolean
  nextPath: string
}) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function subscribe() {
    if (!signedIn) {
      router.push(loginUrl(nextPath))
      return
    }

    if (!priceId) {
      toast.error("Pro checkout is not configured yet.")
      return
    }

    setPending(true)
    const result = await createCheckoutSession(priceId)
    setPending(false)

    if (!result.ok) {
      toast.error(result.message)
      return
    }

    if (result.url) {
      window.location.assign(result.url)
      return
    }

    toast.error("Checkout did not return a URL.")
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-qa-primary/40 bg-[#0A0A0A] p-6 text-left shadow-[0_0_48px_-8px_rgba(99,102,241,0.55)]">
      <p className="mb-2 inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.18em] text-qa-primary uppercase">
        <SparklesIcon className="size-3.5" aria-hidden />
        Pro
      </p>
      <h2 className="font-heading text-2xl font-semibold tracking-tight text-white">
        Upgrade to Pro
      </h2>
      <p className="mt-2 text-sm text-slate-400">
        This lesson is part of the Pro library. Subscribe to keep reading and
        unlock every premium module as they ship.
      </p>
      <ul className="mt-4 grid gap-1.5 text-sm text-slate-300">
        <li>Full access to premium lessons</li>
        <li>New Pro modules as they land</li>
        <li>Support the Quality Central roadmap</li>
      </ul>
      <Button
        type="button"
        size="lg"
        className="mt-5 w-full"
        disabled={pending}
        onClick={() => void subscribe()}
      >
        {pending ? "Redirecting…" : "Subscribe Now"}
      </Button>
    </div>
  )
}
