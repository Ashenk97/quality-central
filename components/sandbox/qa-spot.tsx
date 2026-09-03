import type { ReactNode } from "react"

import { sandboxDefectAnchor, type SandboxDefectId } from "@/lib/sandbox-defects"
import { cn } from "@/lib/utils"

export function QaSpot({
  active,
  defectId,
  id,
  title,
  note,
  className,
  children,
}: {
  active: boolean
  defectId: SandboxDefectId
  id: string
  title: string
  note: string
  className?: string
  children: ReactNode
}) {
  return (
    <div
      id={sandboxDefectAnchor(defectId)}
      data-sandbox-spot={defectId}
      role={active ? "region" : undefined}
      aria-label={active ? `${id}: ${title}` : undefined}
      className={cn(
        "relative scroll-mt-24",
        active && "rounded-lg ring-2 ring-destructive ring-offset-2 ring-offset-background",
        className
      )}
    >
      {active ? (
        <div className="absolute -top-2.5 left-2 z-30 flex max-w-[calc(100%-1rem)] items-center gap-1.5 rounded-md bg-destructive px-2 py-0.5 text-[10px] font-medium text-destructive-foreground">
          <span>{id}</span>
          <span className="truncate">{title}</span>
        </div>
      ) : null}
      {children}
      {active ? (
        <p className="px-1 pt-2 text-xs text-destructive">{note}</p>
      ) : null}
    </div>
  )
}
