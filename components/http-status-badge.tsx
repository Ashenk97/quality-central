import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function httpStatusTone(status: number): "success" | "destructive" {
  return status >= 200 && status < 300 ? "success" : "destructive"
}

export function HttpStatusBadge({
  status,
  statusText,
  className,
}: {
  status: number
  statusText?: string
  className?: string
}) {
  const ok = httpStatusTone(status) === "success"

  return (
    <Badge
      variant={ok ? "success" : "destructive"}
      className={cn(
        "font-mono tabular-nums transition-all duration-200",
        ok
          ? "border-success/30 bg-success/15 text-success"
          : "border-destructive/30 bg-destructive/15 text-destructive",
        className
      )}
    >
      {status}
      {statusText ? ` ${statusText}` : ""}
    </Badge>
  )
}
