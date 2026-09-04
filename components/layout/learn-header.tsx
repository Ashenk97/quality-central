"use client"

import { Fragment } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { UserMenu } from "@/components/auth/user-menu"
import { ProMemberBadge } from "@/components/pro-member-badge"
import { ModeToggle } from "@/components/layout/mode-toggle"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  findSection,
  findTopic,
  type CurriculumSection,
} from "@/lib/curriculum"

export function LearnHeader({
  email,
  isProMember = false,
}: {
  email: string | null
  isProMember?: boolean
}) {
  const pathname = usePathname()
  const section = findSection(pathname)
  const match = findTopic(pathname)
  const crumbs = buildCrumbs(pathname, section, match?.topic.title)

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/80 bg-background/80 px-4 backdrop-blur-md">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb className="min-w-0 flex-1">
        <BreadcrumbList>
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1

            return (
              <Fragment key={crumb.href}>
                {index > 0 ? <BreadcrumbSeparator /> : null}
                <BreadcrumbItem className="min-w-0">
                  {isLast ? (
                    <BreadcrumbPage className="truncate">
                      {crumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={crumb.href} className="truncate">
                        {crumb.label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
      {isProMember ? <ProMemberBadge /> : null}
      <UserMenu email={email} />
      <ModeToggle />
    </header>
  )
}

function buildCrumbs(
  pathname: string,
  section?: CurriculumSection,
  topicTitle?: string
) {
  const crumbs = [{ href: "/", label: "Home" }]

  if (!section) {
    return crumbs
  }

  crumbs.push({ href: section.href, label: section.title })

  if (topicTitle && pathname !== section.href) {
    crumbs.push({ href: pathname, label: topicTitle })
  }

  return crumbs
}
