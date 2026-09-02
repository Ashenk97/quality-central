import type { Metadata } from "next"

import { DashboardProgress } from "@/components/dashboard-progress"
import { requireUser } from "@/lib/auth/session"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  await requireUser("/dashboard")
  return <DashboardProgress />
}
