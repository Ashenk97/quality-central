import { PageTransition } from "@/components/page-transition"
import { RouteLoadingGate } from "@/components/route-loading-gate"

export default function LearnTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RouteLoadingGate>
      <PageTransition>{children}</PageTransition>
    </RouteLoadingGate>
  )
}
