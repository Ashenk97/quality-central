import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function httpStatusTone(
  status: number
): "success" | "warning" | "destructive" {
  if (status >= 200 && status < 300) {
    return "success"
  }
  if (status >= 400 && status < 500) {
    return "warning"
  }
  return "destructive"
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
  const tone = httpStatusTone(status)

  return (
    <Badge
      variant={tone}
      className={cn(
        "font-mono tabular-nums transition-all duration-200",
        tone === "success" && "border-success/30 bg-success/15 text-success",
        tone === "warning" && "border-warning/30 bg-warning/15 text-warning",
        tone === "destructive" &&
          "border-destructive/30 bg-destructive/15 text-destructive",
        className
      )}
    >
      {status}
      {statusText ? ` ${statusText}` : ""}
    </Badge>
  )
}
