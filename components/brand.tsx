import Link from "next/link"
import { ShieldCheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export function Brand({
  href = "/",
  compact = false,
  className,
}: {
  href?: string
  compact?: boolean
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn("flex min-w-0 items-center gap-2", className)}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/20 transition-transform duration-200 hover:scale-[1.03]">
        <ShieldCheckIcon className="size-4" />
      </span>
      <span className="flex min-w-0 flex-col leading-tight group-data-[collapsible=icon]:hidden">
        <span className="truncate font-heading text-sm font-semibold">
          Quality Central
        </span>
        {compact ? null : (
          <span className="truncate text-xs text-muted-foreground">
            QA Engineering
          </span>
        )}
      </span>
    </Link>
  )
}
