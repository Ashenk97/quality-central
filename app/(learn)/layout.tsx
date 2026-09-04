import { AppSidebar } from "@/components/layout/app-sidebar"
import { BetaWelcome } from "@/components/feedback/beta-welcome"
import { FeedbackWidget } from "@/components/feedback/feedback-widget"
import { LearnHeader } from "@/components/layout/learn-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { requireUser } from "@/lib/auth/session"
import { getVisibleProMembership } from "@/lib/premium"

export default async function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Gates every route in this group even if a request bypasses the proxy.
  const user = await requireUser()
  const membership = await getVisibleProMembership()

  return (
    <SidebarProvider>
      <div className="print:hidden">
        <AppSidebar />
      </div>
      <SidebarInset>
        <div className="print:hidden">
          <LearnHeader
            email={user?.email ?? null}
            isProMember={membership.isProMember}
          />
        </div>
        <div className="flex flex-1 flex-col p-4 md:p-6 print:p-0">{children}</div>
        <div className="print:hidden">
          <BetaWelcome />
          <FeedbackWidget />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
