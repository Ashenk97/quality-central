import type { Metadata } from "next"

import { DashboardProgress } from "@/components/dashboard-progress"
import { requireUser } from "@/lib/auth/session"
import { getVisibleProMembership } from "@/lib/premium"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  await requireUser("/dashboard")
  const { isProMember } = await getVisibleProMembership()
  return <DashboardProgress isProMember={isProMember} />
}
