import { Badge } from "@/components/ui/badge"
import {
  difficultyLabel,
  type Difficulty,
} from "@/lib/curriculum"
import { cn } from "@/lib/utils"

const difficultyClassName: Record<Difficulty, string> = {
  beginner:
    "border-success/25 bg-success/10 text-success hover:bg-success/15",
  intermediate:
    "border-primary/25 bg-primary/10 text-primary hover:bg-primary/15",
  advanced:
    "border-warning/30 bg-warning/10 text-warning hover:bg-warning/15",
}

export function DifficultyBadge({
  difficulty,
  className,
}: {
  difficulty: Difficulty
  className?: string
}) {
  return (
    <Badge
      variant="outline"
      className={cn(difficultyClassName[difficulty], className)}
    >
      {difficultyLabel[difficulty]}
    </Badge>
  )
}
