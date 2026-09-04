import type { Metadata } from "next"

import { DashboardProgress } from "@/components/dashboard/dashboard-progress"
import { requireUser } from "@/lib/auth/session"
import { getVisibleProMembership } from "@/lib/premium"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const user = await requireUser("/dashboard")
  const { isProMember } = await getVisibleProMembership()

  return (
    <DashboardProgress
      isProMember={isProMember}
      email={user?.email ?? null}
    />
  )
}
