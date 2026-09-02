import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { curriculum } from "@/lib/curriculum"

export function DashboardSkeleton() {
  const tracks = curriculum.filter((section) => section.href !== "/dashboard")

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Your progress across the Zero to Advanced QA Engineering path. Tracking
          is a placeholder until lessons ship.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Overall progress" value="0%" />
        <StatCard label="Modules started" value="0 / 8" />
        <StatCard label="Bugs found in Sandbox" value="0" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Learning path</CardTitle>
          <CardDescription>
            Complete Foundation, API Testing, and UI Automation, then practice in
            The Sandbox.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {tracks.map((track) => (
            <Link
              key={track.href}
              href={track.href}
              className="flex flex-col gap-2 rounded-lg p-2 transition-colors hover:bg-muted/60"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <track.icon className="size-4 text-muted-foreground" />
                  <span className="font-medium">{track.title}</span>
                </div>
                <Badge variant="outline">Not started</Badge>
              </div>
              <Progress value={0} aria-label={`${track.title} progress`} />
              <p className="text-xs text-muted-foreground">{track.description}</p>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="font-mono text-2xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  )
}
