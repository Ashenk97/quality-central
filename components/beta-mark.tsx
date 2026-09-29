import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function BetaMark({ className }: { className?: string }) {
  return (
    <Badge variant="warning" className={cn("tracking-wide uppercase", className)}>
      Beta
    </Badge>
  )
}
