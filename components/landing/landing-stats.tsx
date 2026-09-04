import { curriculum, getAllTopics, getTrackSections } from "@/lib/curriculum"
import { SANDBOX_DEFECTS } from "@/lib/sandbox-defects"

const toolCount = curriculum
  .flatMap((section) => section.items ?? [])
  .filter((item) => item.kind === "tool").length

const stats = [
  { value: getAllTopics().length, label: "Guided lessons" },
  { value: getTrackSections().length, label: "Career tracks" },
  { value: toolCount, label: "Live playgrounds" },
  { value: SANDBOX_DEFECTS.length, label: "Defects to hunt" },
]

export function LandingStats() {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/10 backdrop-blur-xl sm:grid-cols-4 light:border-black/5 light:bg-black/10">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col-reverse gap-1 bg-background/70 px-5 py-6 text-center"
        >
          <dt className="text-xs tracking-wide text-muted-foreground uppercase">
            {stat.label}
          </dt>
          <dd className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
