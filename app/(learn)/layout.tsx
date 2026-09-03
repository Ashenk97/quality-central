import { AppSidebar } from "@/components/app-sidebar"
import { BetaWelcome } from "@/components/feedback/beta-welcome"
import { FeedbackWidget } from "@/components/feedback/feedback-widget"
import { LearnHeader } from "@/components/learn-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getCurrentUser } from "@/lib/auth/session"

export default async function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  return (
    <SidebarProvider>
      <div className="print:hidden">
        <AppSidebar />
      </div>
      <SidebarInset>
        <div className="print:hidden">
          <LearnHeader email={user?.email ?? null} />
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
