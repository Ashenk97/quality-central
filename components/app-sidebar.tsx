"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HomeIcon } from "lucide-react"

import { Brand } from "@/components/brand"
import { DifficultyBadge } from "@/components/difficulty-badge"
import { LessonCompleteIcon } from "@/components/lesson-complete-icon"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { curriculum } from "@/lib/curriculum"

export function AppSidebar() {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()

  useEffect(() => {
    setOpenMobile(false)
  }, [pathname, setOpenMobile])

  return (
    <Sidebar
      collapsible="icon"
      className="border-sidebar-border/80"
    >
      <SidebarHeader className="border-b border-sidebar-border/80">
        <div className="flex h-12 items-center px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <Brand compact />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] tracking-wide text-muted-foreground uppercase">
            Learn
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {curriculum.map((section) => (
                <SidebarMenuItem key={section.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === section.href}
                    tooltip={section.title}
                    className="transition-colors duration-200 data-active:bg-sidebar-primary/10 data-active:font-medium data-active:text-sidebar-primary"
                  >
                    <Link href={section.href}>
                      <section.icon />
                      <span className="flex min-w-0 flex-1 items-center gap-2">
                        <span className="truncate">{section.title}</span>
                        {section.difficulty ? (
                          <DifficultyBadge
                            difficulty={section.difficulty}
                            className="ml-auto h-4 px-1.5 text-[10px] group-data-[collapsible=icon]:hidden"
                          />
                        ) : null}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                  {section.items ? (
                    <SidebarMenuSub className="mt-1 border-sidebar-border/80 py-1">
                      {section.items.map((topic) => (
                        <SidebarMenuSubItem key={topic.href}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === topic.href}
                            className="h-auto min-h-7 items-start overflow-visible py-1.5 whitespace-normal [&>span:last-child]:overflow-visible [&>span:last-child]:text-clip [&>span:last-child]:whitespace-normal transition-colors duration-200 data-active:bg-sidebar-primary/10 data-active:text-sidebar-primary"
                          >
                            <Link href={topic.href} className="items-start">
                              <span className="min-w-0 flex-1 leading-snug whitespace-normal">
                                {topic.title}
                              </span>
                              <LessonCompleteIcon href={topic.href} />
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/80">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Landing page"
              className="transition-colors duration-200"
            >
              <Link href="/">
                <HomeIcon />
                <span>Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
