"use client"

import { Fragment } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { ModeToggle } from "@/components/mode-toggle"
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
import { findSection, findTopic } from "@/lib/curriculum"

export function LearnHeader() {
  const pathname = usePathname()
  const section = findSection(pathname)
  const match = findTopic(pathname)
  const crumbs = buildCrumbs(pathname, section?.title, match?.topic.title)

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
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
      <ModeToggle />
    </header>
  )
}

function buildCrumbs(
  pathname: string,
  sectionTitle?: string,
  topicTitle?: string
) {
  const crumbs = [{ href: "/", label: "Home" }]

  if (!sectionTitle) {
    return crumbs
  }

  const sectionHref = `/${pathname.split("/").filter(Boolean)[0]}`
  crumbs.push({ href: sectionHref, label: sectionTitle })

  if (topicTitle && pathname !== sectionHref) {
    crumbs.push({ href: pathname, label: topicTitle })
  }

  return crumbs
}
