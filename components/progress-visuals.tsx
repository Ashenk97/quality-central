import { cn } from "@/lib/utils"

type RadialProgressProps = {
  value: number
  size?: number
  strokeWidth?: number
  label?: string
  className?: string
}

export function RadialProgress({
  value,
  size = 96,
  strokeWidth = 8,
  label,
  className,
}: RadialProgressProps) {
  const clamped = Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - clamped / 100)
  const display = `${Math.round(clamped)}%`

  return (
    <div
      role="img"
      aria-label={label ?? `${display} complete`}
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-muted"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-success motion-reduce:transition-none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 500ms ease" }}
        />
      </svg>
      <span className="absolute font-mono text-sm font-semibold tabular-nums text-foreground">
        {display}
      </span>
    </div>
  )
}

export function SuccessBar({
  value,
  className,
  label,
}: {
  value: number
  className?: string
  label?: string
}) {
  const clamped = Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0))

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      className={cn(
        "h-2 overflow-hidden rounded-full bg-success/15",
        className
      )}
    >
      <div
        className="h-full rounded-full bg-success shadow-[0_0_12px_color-mix(in_oklch,var(--success)_45%,transparent)] transition-[width] duration-500 motion-reduce:transition-none"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
