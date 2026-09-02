"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { LOGIN_PATH } from "@/lib/auth/paths"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

export function UserMenu({ email }: { email: string | null }) {
  const router = useRouter()

  async function signOut() {
    const client = createSupabaseBrowserClient()
    await client?.auth.signOut()
    router.replace(LOGIN_PATH)
    router.refresh()
  }

  if (!email) {
    return (
      <Button variant="ghost" size="sm" asChild>
        <Link href={LOGIN_PATH}>Sign in</Link>
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden max-w-40 truncate text-xs text-muted-foreground sm:inline">
        {email}
      </span>
      <Button variant="ghost" size="sm" onClick={signOut}>
        Sign out
      </Button>
    </div>
  )
}
