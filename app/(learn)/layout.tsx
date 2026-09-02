import { AppSidebar } from "@/components/app-sidebar"
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
      <AppSidebar />
      <SidebarInset>
        <LearnHeader email={user?.email ?? null} />
        <div className="flex flex-1 flex-col p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
