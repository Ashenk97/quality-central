import { AppSidebar } from "@/components/app-sidebar"
import { LearnHeader } from "@/components/learn-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <LearnHeader />
        <div className="flex flex-1 flex-col p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
