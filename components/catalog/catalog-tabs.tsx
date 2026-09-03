"use client"

import type { KeyboardEvent } from "react"
import Link from "next/link"

import {
  CATALOG_TABS,
  type CatalogFilterId,
} from "@/lib/catalog"
import { cn } from "@/lib/utils"

const tabClassName = (active: boolean) =>
  cn(
    "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
    active
      ? "bg-background text-foreground shadow-sm ring-1 ring-border"
      : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
  )

const listClassName =
  "flex flex-wrap gap-1 rounded-xl border border-border/80 bg-muted/50 p-1"

const FILTER_IDS = ["all", ...CATALOG_TABS.map((tab) => tab.id)] as const

function moveFilter(
  event: KeyboardEvent<HTMLButtonElement>,
  current: CatalogFilterId | "all",
  onChange: (value: CatalogFilterId | "all") => void
) {
  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
    return
  }

  event.preventDefault()
  const index = FILTER_IDS.indexOf(current)
  const delta = event.key === "ArrowRight" ? 1 : -1
  const next = FILTER_IDS[(index + delta + FILTER_IDS.length) % FILTER_IDS.length]
  onChange(next)
}

export function CatalogNavTabs({ active }: { active: CatalogFilterId }) {
  return (
    <nav aria-label="Course categories" className={listClassName}>
      {CATALOG_TABS.map((tab) => {
        const isActive = tab.id === active

        return (
          <Link
            key={tab.id}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={tabClassName(isActive)}
          >
            <tab.icon className="size-3.5" aria-hidden />
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function CatalogFilterTabs({
  value,
  onChange,
}: {
  value: CatalogFilterId | "all"
  onChange: (value: CatalogFilterId | "all") => void
}) {
  return (
    <div role="tablist" aria-label="Filter modules" className={listClassName}>
      <button
        type="button"
        role="tab"
        aria-selected={value === "all"}
        tabIndex={value === "all" ? 0 : -1}
        className={tabClassName(value === "all")}
        onClick={() => onChange("all")}
        onKeyDown={(event) => {
          moveFilter(event, value, onChange)
          window.requestAnimationFrame(() => {
            event.currentTarget.parentElement
              ?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')
              ?.focus()
          })
        }}
      >
        All
      </button>
      {CATALOG_TABS.map((tab) => {
        const isActive = value === tab.id

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            className={tabClassName(isActive)}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => {
              moveFilter(event, value, onChange)
              window.requestAnimationFrame(() => {
                event.currentTarget.parentElement
                  ?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')
                  ?.focus()
              })
            }}
          >
            <tab.icon className="size-3.5" aria-hidden />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
