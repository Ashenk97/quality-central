import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-heading text-2xl font-semibold">Page not found</h1>
      <p className="max-w-md text-muted-foreground">
        This address does not match a page. You can return to the start.
      </p>
      <Button asChild>
        <Link href="/">Back to landing</Link>
      </Button>
    </div>
  )
}
