import { PageTransition } from "@/components/layout/page-transition"
import { RouteLoadingGate } from "@/components/layout/route-loading-gate"

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
